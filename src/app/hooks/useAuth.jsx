import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import userService from "../services/user.service";
import { toast } from "react-toastify";
import localStorageService, {
  setTokents,
} from "../services/localStorage.service";

export const httpAuth = axios.create({
  baseURL: "https://identitytoolkit.googleapis.com/v1/",
  params: {
    key: process.env.React_APP_FIREBASE_KEY,
  },
});
const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [currentUser, setUser] = useState();
  const [error, setError] = useState(null);

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async function signUp({ email, password, ...rest }) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.React_APP_FIREBASE_KEY}`;
    try {
      const { data } = await httpAuth.post(url, {
        email,
        password,
        returnSecureToken: true,
      });
      setTokents(data);
      await createUser({
        _id: data.localId,
        email,
        rate: randomInt(1, 5),
        completedMeetings: randomInt(0, 200),
        ...rest,
      });
    } catch (error) {
      errorCather(error);
      const { code, message } = error.response.data.error;
      if (code === 400) {
        if (message === "EMAIL_EXISTS") {
          const errorObject = {
            email: "Пользователь с таким E-mail уже существует",
          };
          throw errorObject;
        }
      }
      throw new Error();
    }
  }

  async function createUser(data) {
    try {
      const { content } = await userService.create(data);
      setUser(content);
    } catch (error) {
      errorCather(error);
    }
  }

  function errorCather(error) {
    const { message } = error.response.data;
    setError(message);
  }

  async function getUserData() {
    try {
      const { content } = await userService.getCurrentUser();
      setUser(content);
    } catch (error) {
      errorCather(error);
    }
  }

  useEffect(() => {
    if (localStorageService.getAccessToken()) {
      getUserData();
    }
  }, []);

  useEffect(() => {
    if (error !== null) {
      toast(error);
      setError(null);
    }
  }, [error]);

  async function signIn({ email, password }) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.React_APP_FIREBASE_KEY}`;
    try {
      const { data } = await httpAuth.post(url, {
        email,
        password,
        returnSecureToken: true,
      });
      setTokents(data);
      getUserData();
    } catch (error) {
      errorCather(error);
      const { code, message } = error.response.data.error;
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

  return (
    <AuthContext.Provider value={{ signUp, currentUser, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
