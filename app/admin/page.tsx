"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Video, 
  Camera, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  ChevronRight,
  LayoutDashboard
} from "lucide-react";
import { useAdminAuth } from "./useAdminAuth";

export default function AdminDashboard() {
  const { isAuthenticated, login, logout, isLoaded, githubToken } = useAdminAuth();
  const [tokenInput, setTokenInput] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput) {
      setError("Please enter your GitHub token");
      return;
    }
    login(tokenInput);
  };

  if (!isLoaded) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
              <LayoutDashboard className="text-white w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-center text-black">
            United Studio Collective
          </h1>
          <p className="text-gray-600 text-center mb-8">Admin Portal</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                GitHub Personal Access Token
              </label>
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono text-sm text-black"
              />
              <p className="text-xs text-gray-500 mt-2">
                Requires 'repo' scope access to banddude
              </p>
            </div>
            {error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const adminModules = [
    {
      title: "Filmmaking",
      description: "Manage videos, descriptions, and order on the films page.",
      icon: Video,
      href: "/admin/videos",
      color: "bg-blue-500",
    },
    {
      title: "Photography",
      description: "Update the photo gallery, captions, and reorder images.",
      icon: Camera,
      href: "/admin/photography",
      color: "bg-purple-500",
    },
    {
      title: "Store",
      description: "Manage products, prices, and Stripe payment links.",
      icon: ShoppingBag,
      href: "/store", // Placeholder for now
      color: "bg-green-500",
      disabled: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-black" />
            <h1 className="text-xl font-bold text-black">Admin Dashboard</h1>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600">Select a section to manage your site content.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminModules.map((module) => (
            <Link 
              key={module.title}
              href={module.disabled ? "#" : module.href}
              className={`group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-gray-200 flex items-start gap-5 ${module.disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className={`${module.color} p-4 rounded-xl text-white shadow-lg shadow-${module.color.split('-')[1]}-100`}>
                <module.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
                  {!module.disabled && <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {module.description}
                </p>
                {module.disabled && (
                  <span className="inline-block mt-3 text-[10px] font-bold tracking-wider uppercase bg-gray-100 text-gray-500 px-2 py-1 rounded">
                    Coming Soon
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-gray-400" />
            <h3 className="font-bold text-gray-900">System Status</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-500 mb-1">Deployment</p>
              <p className="font-semibold text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-500 mb-1">API Key</p>
              <p className="font-semibold text-gray-900 font-mono text-xs">
                {githubToken.substring(0, 8)}...
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-500 mb-1">Repository</p>
              <p className="font-semibold text-gray-900">banddude/usc-site</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
