import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

// module-level refresh state so multiple re-renders share the same flags
let isRefreshing = false;
let refreshQueue = []; // array of { resolve, reject }

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---- Refresh Access Token ----
  const refreshAccessToken = async () => {
    try {
      const res = await api.post("/auth/refresh"); // cookie must be sent
      const newToken = res.data.accessToken;
      setAccessToken(newToken);
      setUser(res.data.user);
      return newToken;
    } catch (err) {
      // clear state on refresh failure
      setAccessToken(null);
      setUser(null);
      return null;
    }
  };

  // helper to process queued requests when refresh completes/fails
  const processQueue = (error, token = null) => {
    refreshQueue.forEach(p => {
      if (error) p.reject(error);
      else p.resolve(token);
    });
    refreshQueue = [];
  };

  // ---- Axios Interceptors ----
  useEffect(() => {
    const reqInterceptor = api.interceptors.request.use(
      (config) => {
        if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
      },
      (err) => Promise.reject(err)
    );

    const resInterceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        // only handle 401 for non-retry requests
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (isRefreshing) {
            // queue the request and return a promise which will run once refresh completes
            return new Promise((resolve, reject) => {
              refreshQueue.push({ resolve, reject });
            }).then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            }).catch(err => Promise.reject(err));
          }

          // start refresh
          isRefreshing = true;
          try {
            const newToken = await refreshAccessToken();
            isRefreshing = false;

            if (!newToken) {
              processQueue(new Error("Refresh failed"), null);
              return Promise.reject(error);
            }

            processQueue(null, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (e) {
            isRefreshing = false;
            processQueue(e, null);
            return Promise.reject(e);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [accessToken]);

  // ---- On mount: attempt silent refresh once ----
  useEffect(() => {
    (async () => {
      await refreshAccessToken();
      setLoading(false);
    })();
  }, []);

  // ---- Auth Actions ----
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
