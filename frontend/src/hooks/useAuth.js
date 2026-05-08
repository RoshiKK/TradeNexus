import { useState } from "react";

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo")) || null;
    } catch {
      return null;
    }
  });

  const setAuth = (nextToken, info) => {
    if (nextToken) {
      localStorage.setItem("token", nextToken);
      localStorage.setItem("userInfo", JSON.stringify(info || {}));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    }
    setToken(nextToken);
    setUserInfo(info || null);
  };

  return { token, userInfo, setAuth };
};
