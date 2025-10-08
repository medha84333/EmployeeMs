"use client";
import { useState, useEffect } from 'react';
import { LoginForm } from '../../components/auth/LoginForm';
import { SignupForm } from '../../components/auth/SignUpForm';
import { Dashboard } from '../../components/dashboard/Dashboard';
import { Toaster } from '../../components/ui/sonner';
import { toast } from 'sonner';
import { getUserFromStorage, saveUserToStorage, clearUserFromStorage } from "../../lib/auth";

export default function Home() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user session on component mount
  useEffect(() => {
    const checkStoredUser = () => {
      try {
        // Ensure we're always on the root path
        if (window.location.pathname !== '/') {
          window.history.replaceState(null, '', '/');
        }
        
        const storedUser = getUserFromStorage();
        if (storedUser) {
          setUser(storedUser);
          setCurrentView('dashboard');
        }
      } catch (error) {
        console.error('Error retrieving stored user:', error);
        // Clear potentially corrupted data
        clearUserFromStorage();
      } finally {
        setIsLoading(false);
      }
    };

    checkStoredUser();

    // Listen for browser navigation events
    const handlePopState = () => {
      // Prevent navigation away from root path
      if (window.location.pathname !== '/') {
        window.history.replaceState(null, '', '/');
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Handle user login with API authentication
  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userData = {
          id: data.id,
          name: data.name,
          email: data.email,
          avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        };

        // Save user to state and storage
        setUser(userData);
        saveUserToStorage(userData);
        setCurrentView('dashboard');
        toast.success('Successfully logged in!');
        
        // Ensure we stay on the root path
        if (window.location.pathname !== '/') {
          window.history.pushState(null, '', '/');
        }
        
        return true;
      } else {
        toast.error(data.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Network error. Please try again.');
      return false;
    }
  };

  // Handle user signup with API registration
  const handleSignup = async (name, email, password) => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userData = {
          id: data.id,
          name: data.name,
          email: data.email,
          avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        };

        // Save user to state and storage
        setUser(userData);
        saveUserToStorage(userData);
        setCurrentView('dashboard');
        toast.success('Account created successfully!');
        return true;
      } else {
        toast.error(data.message || 'Signup failed');
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Network error. Please try again.');
      return false;
    }
  };

  // Handle user logout
  const handleLogout = () => {
    try {
      clearUserFromStorage();
      setUser(null);
      setCurrentView('login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
    }
  };

  // Show loading state while checking for stored user
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="size-full min-h-screen">
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
            userId={user.id}
            onLogout={handleLogout} 
            onProfileUpdate={(updatedUser) => {
              // Update the user state with new profile data
              setUser(prev => ({ ...prev, ...updatedUser }));
              // Update localStorage
              saveUserToStorage({ ...user, ...updatedUser });
            }}
          />
        )}
      </div>
      <Toaster />
    </>
  );
}

// "use client";
// import { useState, useEffect } from "react";
// import { LoginForm } from "../../components/auth/LoginForm";
// import { SignupForm } from "../../components/auth/SignUpForm";
// import { Dashboard } from "../../components/dashboard/Dashboard";
// import { Toaster } from "../../components/ui/sonner";
// import { toast } from "sonner";
// import { getUserFromStorage, clearUserFromStorage } from "../../lib/auth";

// export default function Home() {
//   const [view, setView] = useState("login");
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = getUserFromStorage();
//     if (storedUser) setUser(storedUser);
//   }, []);

//   const handleLogout = () => {
//     clearUserFromStorage();
//     setUser(null);
//     setView("login");
//   };

//   if (user) {
//     return (
//       <div className="p-8 text-center">
//         <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
//         <img src={user.avatar} alt="avatar" className="mx-auto my-4 w-24 h-24 rounded-full" />
//         <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded">
//           Logout
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
//       {view === "login" ? (
//         <>
//           <LoginForm onSuccess={(u) => setUser(u)} />
//           <p className="mt-4 text-sm">
//             Don’t have an account?{" "}
//             <button className="text-blue-600" onClick={() => setView("signup")}>
//               Sign Up
//             </button>
//           </p>
//         </>
//       ) : (
//         <>
//           <SignupForm onSuccess={(u) => setUser(u)} />
//           <p className="mt-4 text-sm">
//             Already have an account?{" "}
//             <button className="text-blue-600" onClick={() => setView("login")}>
//               Login
//             </button>
//           </p>
//         </>
//       )}
//       <Toaster />
//     </div>
//   );
// }
