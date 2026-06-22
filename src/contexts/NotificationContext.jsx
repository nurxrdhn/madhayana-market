import React, { createContext, useState, useContext } from 'react';
const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const addNotification = (msg) => setNotifications(prev => [...prev, msg]);
  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}
export const useNotification = () => useContext(NotificationContext);
