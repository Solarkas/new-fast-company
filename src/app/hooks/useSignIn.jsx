import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { setTokents } from "../services/localStorage.service";
import { toast } from "react-toastify";

const httpSignIn = axios.create();
const signInContext = React.createContext();

export const useSignIn = () => {
  return useContext(signInContext);
};

const SignInProvider = ({ children }) => {
  const [currentUser, setUser] = useState({});
  const [error, setError] = useState(null);

  async function signIn({ email, password }) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.React_APP_FIREBASE_KEY}`;
    try {
      const { data } = await httpSignIn.post(url, {
        email,
        password,
        returnSecureToken: true,
      });
      setTokents(data);
    } catch (error) {
      errorCather(error);
      const { code, message } = error.response.data.error;
      console.log(code, message);
      if (code === 400) {
        if (message === "EMAIL_NOT_FOUND") {
          const errorObject = {
            email: "Пользователь с таким E-mail не зарегистрирован",
          };
          throw errorObject;
        } else if (message === "INVALID_PASSWORD") {
          const errorObject = {
            password: "Неверный пароль",
          };
          throw errorObject;
        }
      }
      throw new Error();
    }
  }

  function errorCather(error) {
    const { message } = error.response.data;
    setError(message);
  }

  useEffect(() => {
    if (error !== null) {
      toast(error);
      setError(null);
    }
  }, [error]);
  return (
    <signInContext.Provider value={{ signIn }}>
      {children}
    </signInContext.Provider>
  );
};

export default SignInProvider;
