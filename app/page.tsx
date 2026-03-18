'use client';

import { useState } from 'react';
import Login from '@/components/Login';
import Chat from '@/components/Chat';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const handleLogin = (username: string) => {
    setUserName(username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
  };

  return (
    <div className="min-h-screen bg-white">
      {isLoggedIn ? (
        <Chat userName={userName} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}
