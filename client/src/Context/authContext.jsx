import { createContext, useEffect, useReducer, useState } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "SIGNUP":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [state, dispatch] = useReducer(authReducer, { user: null });

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(
          "http://localhost:4545/api/user/verify-token",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAuthenticated(true);
          dispatch({ type: "SIGNUP", payload: data.user });
        } else {
          setAuthenticated(false);
          dispatch({ type: "LOGOUT" });
        }
      } catch (error) {
        setAuthenticated(false);
        dispatch({ type: "LOGOUT" });
      }
    };

    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch, authenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
