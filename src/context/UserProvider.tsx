import { ReactNode, useState } from "react";
import { UserContext } from "./UserContext";

type User = {
  name: string;
  email: string;
  avatar: string;
  verified?: boolean;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // In real app: send request to backend
    const userData = {
      name: email.split("@")[0],
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const signup = async (name: string, email: string, password: string) => {
    // In real app: send signup request to backend
    const userData = {
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      verified: false, // Initially not verified
    };
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;
