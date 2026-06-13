import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, query, where, limit, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyAr3arskRQdXyBhC1WBQBhFiPIA3l-fWzA',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'madhayana-80f71.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'madhayana-80f71',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'madhayana-80f71.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '948236566177',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:948236566177:web:c39b7a78876e72760d7ae0'
};

export function db(){
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  return getFirestore(app);
}

export async function updateOrder(partnerReferenceNo, data){
  if(!partnerReferenceNo) return {updated:false, reason:'partner-reference-empty'};
  try{
    const store = db();
    const q = query(collection(store, 'orders'), where('partnerReferenceNo', '==', partnerReferenceNo), limit(1));
    const snap = await getDocs(q);
    if(snap.empty) return {updated:false, reason:'order-not-found'};
    const target = snap.docs[0];
    await updateDoc(doc(store, 'orders', target.id), {...data, updatedAt: serverTimestamp()});
    return {updated:true, id:target.id};
  }catch(error){
    return {updated:false, reason:error?.message || 'firestore-update-failed'};
  }
}
