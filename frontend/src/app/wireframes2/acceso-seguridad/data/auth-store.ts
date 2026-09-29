"use client";

import { useState, useEffect, useCallback } from "react";
import { MOCK_USERS_BY_ROLE, type MockUser } from "../../catalogo-interoperabilidad/data/catalogo-data";

const STORAGE_KEY = "dinarp_auth_v1";

export function useAuthStore() {
  const [activeUser, setActiveUser] = useState<MockUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial state
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setActiveUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading auth store", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever activeUser changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (activeUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activeUser));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error("Error saving auth store", e);
    }
  }, [activeUser, isLoaded]);

  const login = useCallback((input: string) => {
    const cleanInput = input.trim().toLowerCase();
    const users = Object.values(MOCK_USERS_BY_ROLE);
    const user =
      users.find(
        (u) =>
          u.email?.toLowerCase() === cleanInput ||
          u.id.toLowerCase() === cleanInput ||
          (cleanInput === "gestion.director@gmail.com" && u.role === "DIR_GESTION")
      ) || MOCK_USERS_BY_ROLE.DIR_GESTION;
    setActiveUser(user);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error("Error saving auth store", e);
    }
    return user;
  }, []);

  const logout = useCallback(() => {
    setActiveUser(null);
  }, []);

  return {
    activeUser,
    isLoaded,
    login,
    logout,
  };
}
