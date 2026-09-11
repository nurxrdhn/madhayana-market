import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import {
  auth,
  db,
  googleProvider,
} from "../firebase/config";

const AuthContext = createContext(null);

const allowedRoles = ["buyer", "reseller", "operator"];

function normalizeRole(role) {
  return allowedRoles.includes(role) ? role : "buyer";
}

function createUserCode(role, uid) {
  const prefixes = {
    buyer: "BYR",
    reseller: "SLR",
    operator: "OPR",
  };

  return `${prefixes[role] || "BYR"}-2026-${uid
    .slice(-6)
    .toUpperCase()}`;
}

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function readProfile(uid) {
    const snapshot = await getDoc(doc(db, "users", uid));

    if (!snapshot.exists()) {
      return null;
    }

    return {
      uid: snapshot.id,
      ...snapshot.data(),
    };
  }

  async function saveProfile(currentUser, requestedRole, extraData = {}) {
    const userReference = doc(db, "users", currentUser.uid);
    const existingSnapshot = await getDoc(userReference);
    const existingData = existingSnapshot.exists()
      ? existingSnapshot.data()
      : null;

    /*
     * Pengguna lama mempertahankan role dari Firestore.
     * Role pilihan hanya digunakan ketika akun baru dibuat.
     */
    const role = existingData?.role
      ? normalizeRole(existingData.role)
      : normalizeRole(requestedRole);

    const profileData = {
      uid: currentUser.uid,
      userCode:
        existingData?.userCode ||
        createUserCode(role, currentUser.uid),
      name:
        extraData.name ||
        currentUser.displayName ||
        existingData?.name ||
        "Pengguna Madhayana",
      email:
        currentUser.email ||
        existingData?.email ||
        "",
      phone:
        extraData.phone ||
        existingData?.phone ||
        "",
      photoURL:
        currentUser.photoURL ||
        existingData?.photoURL ||
        "",
      role,
      status:
        existingData?.status ||
        (role === "operator" ? "pending" : "active"),
      membership:
        existingData?.membership ||
        "free",
      coin:
        existingData?.coin ??
        0,
      balance:
        existingData?.balance ??
        0,
      updatedAt: serverTimestamp(),
    };

    if (!existingSnapshot.exists()) {
      profileData.createdAt = serverTimestamp();
    }

    await setDoc(userReference, profileData, {
      merge: true,
    });

    const latestProfile = await readProfile(currentUser.uid);
    setProfile(latestProfile);

    return latestProfile;
  }

  useEffect(() => {
    let unsubscribe = () => {};

    async function initializeAuthentication() {
      try {
        await setPersistence(auth, browserLocalPersistence);

        unsubscribe = onAuthStateChanged(
          auth,
          async (currentUser) => {
            try {
              setFirebaseUser(currentUser);

              if (!currentUser) {
                setProfile(null);
                return;
              }

              const existingProfile = await readProfile(
                currentUser.uid
              );

              if (existingProfile) {
                const activeRole =
                  sessionStorage.getItem(
                    "madhayanaActiveRole"
                  );

                if (
                  activeRole === "buyer" ||
                  activeRole === "reseller"
                ) {
                  setProfile({
                    ...existingProfile,
                    role: activeRole,
                  });
                } else {
                  setProfile(existingProfile);
                }
              } else {
                const activeRole =
                  sessionStorage.getItem(
                    "madhayanaActiveRole"
                  );

                await saveProfile(
                  currentUser,
                  activeRole === "reseller"
                    ? "reseller"
                    : "buyer"
                );
              }
            } catch (error) {
              console.error(
                "Gagal membaca profil pengguna:",
                error
              );
              setProfile(null);
            } finally {
              setLoading(false);
            }
          }
        );
      } catch (error) {
        console.error(
          "Gagal menyiapkan autentikasi:",
          error
        );
        setLoading(false);
      }
    }

    initializeAuthentication();

    return () => unsubscribe();
  }, []);

  async function register({
    name,
    email,
    password,
    phone,
    role,
  }) {
    const normalizedRole = normalizeRole(role);

    if (normalizedRole === "operator") {
      throw new Error(
        "Akun operator hanya dapat dibuat oleh Super Admin."
      );
    }

    const credential =
      await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

    await updateProfile(credential.user, {
      displayName: name.trim(),
    });

    const savedProfile = await saveProfile(
      credential.user,
      normalizedRole,
      {
        name: name.trim(),
        phone: phone.trim(),
      }
    );

    setFirebaseUser(credential.user);

    return savedProfile;
  }

  async function login({ email, password }) {
    const credential =
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

    const existingProfile = await readProfile(
      credential.user.uid
    );

    if (!existingProfile) {
      throw new Error(
        "Profil akun tidak ditemukan di database."
      );
    }

    if (existingProfile.status === "blocked") {
      await signOut(auth);

      throw new Error(
        "Akun ini sedang diblokir."
      );
    }

    setFirebaseUser(credential.user);
    setProfile(existingProfile);

    return existingProfile;
  }

  async function loginGoogle(role = "buyer") {
    const normalizedRole = normalizeRole(role);

    if (normalizedRole === "operator") {
      throw new Error(
        "Operator harus masuk menggunakan akun yang dibuat Super Admin."
      );
    }

    /*
     * Simpan portal yang dipilih sebelum popup Google dibuka.
     * Ini mencegah onAuthStateChanged mengembalikan role lama.
     */
    sessionStorage.setItem(
      "madhayanaActiveRole",
      normalizedRole
    );

    const credential = await signInWithPopup(
      auth,
      googleProvider
    );

    const existingProfile = await readProfile(
      credential.user.uid
    );

    if (
      existingProfile?.status === "blocked"
    ) {
      sessionStorage.removeItem(
        "madhayanaActiveRole"
      );

      await signOut(auth);

      throw new Error(
        "Akun ini sedang diblokir."
      );
    }

    let userCode =
      existingProfile?.userCode || "";

    if (normalizedRole === "reseller") {
      if (userCode.startsWith("RSL-")) {
        userCode = userCode.replace(
          /^RSL-/,
          "SLR-"
        );
      } else if (!userCode.startsWith("SLR-")) {
        userCode = createUserCode(
          "reseller",
          credential.user.uid
        );
      }
    }

    if (normalizedRole === "buyer") {
      if (!userCode.startsWith("BYR-")) {
        userCode = createUserCode(
          "buyer",
          credential.user.uid
        );
      }
    }

    await setDoc(
      doc(db, "users", credential.user.uid),
      {
        uid: credential.user.uid,
        name:
          existingProfile?.name ||
          credential.user.displayName ||
          "Pengguna Madhayana",
        email:
          credential.user.email ||
          existingProfile?.email ||
          "",
        photoURL:
          credential.user.photoURL ||
          existingProfile?.photoURL ||
          "",
        role: normalizedRole,
        userCode,
        status:
          existingProfile?.status ||
          "active",
        membership:
          existingProfile?.membership ||
          "free",
        coin:
          existingProfile?.coin ??
          0,
        balance:
          existingProfile?.balance ??
          0,
        updatedAt: serverTimestamp(),
      },
      {
        merge: true,
      }
    );

    const latestProfile = await readProfile(
      credential.user.uid
    );

    const activeProfile = {
      ...latestProfile,
      role: normalizedRole,
      userCode,
    };

    setFirebaseUser(credential.user);
    setProfile(activeProfile);

    return activeProfile;
  }

  function enterAsGuest() {
    setFirebaseUser(null);

    setProfile({
      uid: "guest",
      userCode: "GST-2026-000000",
      name: "Guest",
      email: "",
      phone: "",
      photoURL: "",
      role: "guest",
      status: "active",
      membership: "free",
      coin: 0,
      balance: 0,
      isGuest: true,
    });
  }

  async function logout() {
    sessionStorage.removeItem(
      "madhayanaActiveRole"
    );

    if (firebaseUser) {
      await signOut(auth);
    }

    setFirebaseUser(null);
    setProfile(null);
  }

  const value = useMemo(
    () => ({
      firebaseUser,
      user: profile,
      profile,
      loading,
      register,
      login,
      loginGoogle,
      enterAsGuest,
      logout,
    }),
    [firebaseUser, profile, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth harus digunakan di dalam AuthProvider."
    );
  }

  return context;
}
