import React, { useState } from "react";
import {useUser} from "./userContext";

const Login: React.FC = () => {
  const { setUser } = useUser();
  const [name, setName] = useState("");

  const handleLogin = () => {
    if (name.trim()) {
      setUser(name.trim());
    }
  };

  return (
    <div 
    className="flex flex-col items-center justify-center min-h-screen"
    style={{backgroundColor: "#E9FBD6"}}
    >
      <h1 className="font-gotham-rounded-bold text-2xl font-bold mb-4">Log In</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none"
      />
      <button
        onClick={handleLogin}
        className="font-gotham-rounded-medium bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        Log In
      </button>
    </div>
  );
};

export default Login;
