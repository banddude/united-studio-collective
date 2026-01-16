"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Loader2, Star } from "lucide-react";
import { useAdminAuth } from "../useAdminAuth";

interface FeaturedArtist {
  name: string;
  tagline: string;
  description: string;
  image: string;
}

interface StoreConfig {
  stripeEnabled: boolean;
  defaultArtist: string;
  featuredArtist: FeaturedArtist;
  products: { id: number; name: string; artist?: string }[];
}

export default function AdminStorePage() {
  const { isAuthenticated, githubToken, config, isLoaded } = useAdminAuth();
  const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null);
  const [artists, setArtists] = useState<string[]>([]);
  const [selectedArtist, setSelectedArtist] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [artistImage, setArtistImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  useEffect(() => {
    if (isLoaded && isAuthenticated && githubToken) {
      fetchStoreConfig();
    }
  }, [isLoaded, isAuthenticated, githubToken]);

  const fetchStoreConfig = async () => {
    try {
      // Fetch from GitHub API to always get latest data (not cached static file)
      const res = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/public/config/store.json?ref=${config.branch}`,
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch store config");

      const result = await res.json();
      const content = new TextDecoder().decode(
        Uint8Array.from(atob(result.content.replace(/\s/g, "")), (c) => c.charCodeAt(0))
      );
      const data: StoreConfig = JSON.parse(content);
      setStoreConfig(data);

      // Extract unique artists
      const artistSet = new Set<string>();
      data.products.forEach((p) => {
        artistSet.add(p.artist || data.defaultArtist);
      });
      setArtists(Array.from(artistSet));

      // Set current featured artist
      setSelectedArtist(data.featuredArtist.name);
      setTagline(data.featuredArtist.tagline);
      setDescription(data.featuredArtist.description);
      setArtistImage(data.featuredArtist.image);

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch store config:", error);
      setLoading(false);
    }
  };

  const handleArtistChange = (artistName: string) => {
    setSelectedArtist(artistName);
    // Try to find an image for this artist from collective
    // For now, keep the current image or clear it
  };

  const handleSave = async () => {
    if (!storeConfig) return;

    setSaving(true);
    setSaveStatus({ type: null, message: "" });

    const updatedConfig = {
      ...storeConfig,
      featuredArtist: {
        name: selectedArtist,
        tagline: tagline,
        description: description,
        image: artistImage
      }
    };

    try {
      // Get current file SHA
      const fileRes = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/public/config/store.json?ref=${config.branch}`,
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      const fileData = await fileRes.json();

      // Update file
      const updateRes = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/public/config/store.json`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Update featured artist to ${selectedArtist}`,
            content: btoa(unescape(encodeURIComponent(JSON.stringify(updatedConfig, null, 2)))),
            sha: fileData.sha,
            branch: config.branch,
          }),
        }
      );

      if (updateRes.ok) {
        setSaveStatus({ type: "success", message: "Featured artist updated! Site will rebuild in 1-2 minutes." });
        setStoreConfig(updatedConfig);
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      setSaveStatus({ type: "error", message: "Failed to save changes. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Please log in from the admin dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-black">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-black">Manage Store</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Status Message */}
        {saveStatus.type && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              saveStatus.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}
          >
            {saveStatus.message}
          </div>
        )}

        {/* Featured Artist Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-bold text-black">Featured Artist</h2>
          </div>

          <div className="space-y-6">
            {/* Artist Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Artist
              </label>
              <select
                value={selectedArtist}
                onChange={(e) => handleArtistChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              >
                {artists.map((artist) => (
                  <option key={artist} value={artist}>
                    {artist}
                  </option>
                ))}
              </select>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g., Featured Artist"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief description about the artist..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none text-black"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artist Image URL
              </label>
              <input
                type="text"
                value={artistImage}
                onChange={(e) => setArtistImage(e.target.value)}
                placeholder="/images/collective/artist.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black font-mono text-sm"
              />
              {artistImage && (
                <div className="mt-3 w-24">
                  <div className="relative aspect-[3/4] bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={artistImage}
                      alt="Artist preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Preview</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              {artistImage && (
                <div className="w-20 flex-shrink-0">
                  <div className="relative aspect-[3/4] overflow-hidden rounded">
                    <Image
                      src={artistImage}
                      alt={selectedArtist}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">{tagline}</p>
                <p className="text-lg font-light text-black">{selectedArtist}</p>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
