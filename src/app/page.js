"use client";
import { useState } from 'react';
// Make sure the file exists at this path, or update the path if necessary
import { LoginForm } from '../../components/auth/LoginForm';
import { SignupForm } from '../../components/auth/SignUpForm';
// import { Dashboard } from '../../components/dashboard/Dashboard';
import { Dashboard } from '../../components/dashboard/Dashboard';
import { Toaster } from '../../components/ui/sonner';
import { toast } from 'sonner';

// type View = 'login' | 'signup' | 'dashboard';

// interface User {
//   name: string;
//   email: string;
//   avatar?: string;
// }

export default function Home() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);

  const handleLogin = async (email) => {
    // Mock authentication - in a real app, this would call an API
    const mockUser = {
      name: email.split('@')[0],
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    setUser(mockUser);
    setCurrentView('dashboard');
    toast.success('Successfully logged in!');
    return true;
  };

  const handleSignup = async (name, email) => {
    // Mock signup - in a real app, this would call an API
    const newUser = {
      name: name,
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    setUser(newUser);
    setCurrentView('dashboard');
    toast.success('Account created successfully!');
    return true;
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
    toast.success('Logged out successfully');
  };

  return (
    <>
      <div className="size-full">
        {currentView === 'login' && (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToSignup={() => setCurrentView('signup')}
          />
        )}
        {currentView === 'signup' && (
          <SignupForm
            onSignup={handleSignup}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        )}
        {currentView === 'dashboard' && user && (
          <Dashboard 
            userName={user.name} 
            userEmail={user.email}
            userAvatar={user.avatar}
            onLogout={handleLogout} 
          />
        )}
      </div>
      <Toaster />
    </>
  );
}