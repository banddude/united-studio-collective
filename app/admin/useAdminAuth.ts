"use client";

import { useState, useEffect, useCallback } from "react";

const DEFAULT_CONFIG = {
  owner: "banddude",
  repo: "united-studio-collective",
  branch: "main",
  githubToken: "",
};

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      const savedAuth = localStorage.getItem("usc_admin_auth");
      const savedToken = localStorage.getItem("usc_github_token") || DEFAULT_CONFIG.githubToken;
      return savedAuth === "true" && !!savedToken;
    }
    return false;
  });
  const [githubToken, setGithubToken] = useState(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("usc_github_token");
      return savedToken || DEFAULT_CONFIG.githubToken;
    }
    return DEFAULT_CONFIG.githubToken;
  });
  const [config, setConfig] = useState(() => {
    if (typeof window !== "undefined") {
      const savedConfig = localStorage.getItem("usc_admin_config");
      if (savedConfig) {
        try {
          return JSON.parse(savedConfig);
        } catch (e) {
          console.error("Failed to parse saved config", e);
        }
      }
    }
    return DEFAULT_CONFIG;
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const login = useCallback((token: string) => {
    setIsAuthenticated(true);
    setGithubToken(token);
    localStorage.setItem("usc_admin_auth", "true");
    localStorage.setItem("usc_github_token", token);
    localStorage.setItem("usc_admin_config", JSON.stringify(DEFAULT_CONFIG));
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setGithubToken("");
    localStorage.removeItem("usc_admin_auth");
    localStorage.removeItem("usc_github_token");
  }, []);

  return {
    isAuthenticated,
    githubToken,
    config,
    login,
    logout,
    isLoaded
  };
}
