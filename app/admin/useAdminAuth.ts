"use client";

import { useState, useEffect, useCallback } from "react";

const DEFAULT_CONFIG = {
  owner: "banddude",
  repo: "united-studio-collective",
  branch: "main",
  githubToken: "",
};

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [githubToken, setGithubToken] = useState("");
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem("usc_admin_auth");
    const savedConfig = localStorage.getItem("usc_admin_config");
    const savedToken = localStorage.getItem("usc_github_token");

    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }

    const tokenToUse = savedToken || DEFAULT_CONFIG.githubToken;

    if (savedAuth === "true" && tokenToUse) {
      setIsAuthenticated(true);
      setGithubToken(tokenToUse);
    }
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
