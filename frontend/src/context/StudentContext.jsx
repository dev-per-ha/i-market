// frontend/src/context/StudentContext.jsx
import React, { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/student/profile");
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <StudentContext.Provider value={{ profile, setProfile, fetchProfile, loading }}>
      {children}
    </StudentContext.Provider>
  );
};