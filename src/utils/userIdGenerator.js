export const generateUserId = (rolePrefix) => {
  const currentYear = new Date().getFullYear();
  const randomSequence = Math.floor(100000 + Math.random() * 900000);
  return `${rolePrefix}-${currentYear}-${randomSequence}`;
};
