// lib/auth.ts
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const saveUserToStorage = (user: User) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("employee_user", JSON.stringify(user));
  }
};

export const getUserFromStorage = () => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("employee_user");
    return storedUser ? JSON.parse(storedUser) : null;
  }
  return null;
};

export const clearUserFromStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("employee_user");
  }
};
