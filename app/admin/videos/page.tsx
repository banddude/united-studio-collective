"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  Trash2,
  GripVertical,
  Plus,
  Eye,
  EyeOff,
  LogOut,
  Loader2,
  CheckCircle,
  AlertCircle,
  Crown,
  Settings,
} from "lucide-react";

// Import local config if available (for development)
let LOCAL_CONFIG: { githubToken?: string } | undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LOCAL_CONFIG = require('@/app/admin/config.local.ts').LOCAL_ADMIN_CONFIG;
} catch {
  // Local config doesn't exist, use empty
}

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  videoId: string;
  platform: "youtube" | "vimeo" | "local" | "pending";
  creator?: string;
  description?: string;
  backgroundSize?: string;
  hidden?: boolean;
}

// Default configuration (can be overridden by user input)
const DEFAULT_CONFIG = {
  owner: "banddude",
  repo: "united-studio-collective",
  branch: "main",
  // GitHub token from local config (if available)
  githubToken: LOCAL_CONFIG?.githubToken || "",
};

export default function AdminVideosPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [githubToken, setGithubToken] = useState("");
  const [authError, setAuthError] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [editingVideo, setEditingVideo] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Video>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState("");

  // Load config from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("usc_admin_auth");
    const savedConfig = localStorage.getItem("usc_admin_config");
    const savedToken = localStorage.getItem("usc_github_token");

    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }

    // Use hardcoded token if available, otherwise use saved token
    const tokenToUse = savedToken || DEFAULT_CONFIG.githubToken;

    if (savedAuth === "true" && tokenToUse) {
      setIsAuthenticated(true);
      setGithubToken(tokenToUse);
      fetchVideos(tokenToUse, savedConfig ? JSON.parse(savedConfig) : DEFAULT_CONFIG);
    }
  }, []);

  const fetchVideos = async (token?: string, cfg?: typeof DEFAULT_CONFIG) => {
    const tokenToUse = token || githubToken || DEFAULT_CONFIG.githubToken;
    const configToUse = cfg || config;

    if (!tokenToUse) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${configToUse.owner}/${configToUse.repo}/contents/app/filmmaking/videos.json?ref=${configToUse.branch}`,
        {
          headers: {
            Authorization: `Bearer ${tokenToUse}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const content = Buffer.from(data.content, "base64").toString("utf-8");
        const parsedVideos = JSON.parse(content);
        setVideos(parsedVideos);
      } else {
        throw new Error("Failed to fetch videos");
      }
    } catch (error) {
      setSaveStatus({ type: "error", message: "Failed to load videos. Check your GitHub token." });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Use hardcoded token or entered token
    const tokenToUse = githubToken || DEFAULT_CONFIG.githubToken;

    if (!tokenToUse) {
      setAuthError("GitHub token required - add it to config.local.ts or enter below");
      return;
    }

    setIsAuthenticated(true);
    localStorage.setItem("usc_admin_auth", "true");
    localStorage.setItem("usc_github_token", tokenToUse);
    localStorage.setItem("usc_admin_config", JSON.stringify(config));
    fetchVideos(tokenToUse, config);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("usc_admin_auth");
    localStorage.removeItem("usc_github_token");
    setGithubToken("");
  };

  const handleSave = async () => {
    const tokenToUse = githubToken || DEFAULT_CONFIG.githubToken;

    if (!tokenToUse) {
      setSaveStatus({ type: "error", message: "No GitHub token found" });
      return;
    }

    setSaving(true);
    setSaveStatus({ type: null, message: "" });

    try {
      // Create unique branch name
      const branchName = `admin/videos-update-${Date.now()}`;

      // Step 1: Get the current commit SHA from main branch
      const mainRefResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/git/refs/heads/${config.branch}`,
        {
          headers: {
            Authorization: `Bearer ${tokenToUse}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!mainRefResponse.ok) {
        throw new Error("Failed to get main branch reference");
      }

      const mainRef = await mainRefResponse.json();
      const baseSha = mainRef.object.sha;

      // Step 2: Create new branch
      const createBranchResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/git/refs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenToUse}`,
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            ref: `refs/heads/${branchName}`,
            sha: baseSha,
          }),
        }
      );

      if (!createBranchResponse.ok) {
        throw new Error("Failed to create branch");
      }

      // Step 3: Get current file SHA
      const getFileResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/app/filmmaking/videos.json?ref=${config.branch}`,
        {
          headers: {
            Authorization: `Bearer ${tokenToUse}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!getFileResponse.ok) {
        throw new Error("Failed to get current file");
      }

      const fileData = await getFileResponse.json();
      const fileSha = fileData.sha;
      const contentBase64 = Buffer.from(JSON.stringify(videos, null, 2)).toString("base64");

      // Step 4: Update videos.json on the new branch
      const updateFileResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/app/filmmaking/videos.json`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${tokenToUse}`,
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: "Update videos from admin panel",
            content: contentBase64,
            sha: fileSha,
            branch: branchName,
          }),
        }
      );

      if (!updateFileResponse.ok) {
        throw new Error("Failed to update videos file");
      }

      // Step 5: Create pull request with password in body
      const createPRResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/pulls`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenToUse}`,
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            title: "Update videos from admin panel",
            head: branchName,
            base: config.branch,
            body: `Automated video update from admin panel.`,
            labels: ["admin-update"],
          }),
        }
      );

      if (!createPRResponse.ok) {
        throw new Error("Failed to create pull request");
      }

      const prData = await createPRResponse.json();

      setSaveStatus({
        type: "success",
        message: `Pull request created! Auto-merging... View: ${prData.html_url}`
      });

      // Poll PR status to check if it was merged
      const checkMergeStatus = setInterval(async () => {
        try {
          const prStatusResponse = await fetch(prData.url, {
            headers: {
              Authorization: `Bearer ${tokenToUse}`,
              Accept: "application/vnd.github.v3+json",
            },
          });

          if (prStatusResponse.ok) {
            const prStatus = await prStatusResponse.json();

            if (prStatus.merged) {
              clearInterval(checkMergeStatus);
              setSaveStatus({
                type: "success",
                message: "Videos saved and merged successfully! Site will rebuild shortly."
              });
            } else if (prStatus.closed_at) {
              clearInterval(checkMergeStatus);
              setSaveStatus({
                type: "error",
                message: "Pull request was closed without merging. Check the GitHub Action."
              });
            }
          }
        } catch (error) {
          // Ignore polling errors
        }
      }, 3000);

      // Stop polling after 2 minutes
      setTimeout(() => clearInterval(checkMergeStatus), 120000);

    } catch (error: any) {
      setSaveStatus({ type: "error", message: `Failed to save: ${error.message}` });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus({ type: null, message: "" }), 30000);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("videoIndex", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("videoIndex"));
    if (dragIndex === dropIndex) return;

    const newVideos = [...videos];
    const [draggedVideo] = newVideos.splice(dragIndex, 1);
    newVideos.splice(dropIndex, 0, draggedVideo);
    setVideos(newVideos);
  };

  const startEdit = (video: Video) => {
    setEditingVideo(video.id);
    setEditForm({ ...video });
  };

  const cancelEdit = () => {
    setEditingVideo(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (editingVideo && editForm) {
      setVideos(videos.map((v) => (v.id === editingVideo ? { ...v, ...editForm } : v)));
      setEditingVideo(null);
      setEditForm({});
    }
  };

  const toggleHidden = (videoId: string) => {
    setVideos(
      videos.map((v) => (v.id === videoId ? { ...v, hidden: !v.hidden } : v))
    );
  };

  const deleteVideo = (videoId: string) => {
    if (confirm("Are you sure you want to delete this video?")) {
      setVideos(videos.filter((v) => v.id !== videoId));
    }
  };

  const setAsHero = (videoId: string) => {
    const videoIndex = videos.findIndex((v) => v.id === videoId);
    if (videoIndex > 0) {
      const newVideos = [...videos];
      const [heroVideo] = newVideos.splice(videoIndex, 1);
      newVideos.unshift(heroVideo);
      setVideos(newVideos);
    }
  };

  const addYouTubeVideo = async () => {
    const match = newVideoUrl.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
    );
    if (!match) {
      alert("Invalid YouTube URL");
      return;
    }

    const youtubeId = match[1];

    // Fetch video info from YouTube oEmbed
    try {
      const oembedResponse = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`
      );

      if (oembedResponse.ok) {
        const oembedData = await oembedResponse.json();

        const newVideo: Video = {
          id: youtubeId,
          videoId: youtubeId,
          title: oembedData.title,
          thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
          duration: "00:00",
          platform: "youtube",
          creator: "United Studio Collective",
          description: "",
          hidden: false,
        };

        setVideos([...videos, newVideo]);
        setNewVideoUrl("");
        setShowAddForm(false);
      } else {
        throw new Error("Failed to fetch video info");
      }
    } catch (error) {
      // Fallback: add with minimal info
      const newVideo: Video = {
        id: youtubeId,
        videoId: youtubeId,
        title: "New Video",
        thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
        duration: "00:00",
        platform: "youtube",
        creator: "United Studio Collective",
        description: "",
        hidden: false,
      };

      setVideos([...videos, newVideo]);
      setNewVideoUrl("");
      setShowAddForm(false);
    }
  };

  if (!isAuthenticated) {
    const hasHardcodedToken = DEFAULT_CONFIG.githubToken.length > 0;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-2 text-center text-black">
            United Studio Collective
          </h1>
          <p className="text-gray-600 text-center mb-6">Admin Login</p>

          {showConfig && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-black">GitHub Configuration</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  value={config.owner}
                  onChange={(e) => setConfig({ ...config, owner: e.target.value })}
                  placeholder="Repository owner"
                  className="w-full px-3 py-2 border rounded-lg text-sm text-black"
                />
                <input
                  type="text"
                  value={config.repo}
                  onChange={(e) => setConfig({ ...config, repo: e.target.value })}
                  placeholder="Repository name"
                  className="w-full px-3 py-2 border rounded-lg text-sm text-black"
                />
                <input
                  type="text"
                  value={config.branch}
                  onChange={(e) => setConfig({ ...config, branch: e.target.value })}
                  placeholder="Branch"
                  className="w-full px-3 py-2 border rounded-lg text-sm text-black"
                />
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {!hasHardcodedToken && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  GitHub Personal Access Token
                </label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono text-sm text-black"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Create at github.com/settings/tokens with repo scope
                </p>
              </div>
            )}
            {authError && (
              <p className="text-red-600 text-sm font-medium">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="w-full text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1"
            >
              <Settings className="w-4 h-4" />
              {showConfig ? "Hide" : "Show"} GitHub Config
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Video Admin Panel</h1>
            <p className="text-xs text-gray-500">
              {config.owner}/{config.repo} ({config.branch})
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Save Status */}
      {saveStatus.type && (
        <div
          className={`max-w-7xl mx-auto px-4 mt-4 ${
            saveStatus.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-2">
            {saveStatus.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {saveStatus.message}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            {/* Add Video Button */}
            <div className="mb-6">
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors border"
                >
                  <Plus className="w-4 h-4" />
                  Add YouTube Video
                </button>
              ) : (
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold mb-3">Add YouTube Video</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                      onClick={addYouTubeVideo}
                      className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setNewVideoUrl("");
                      }}
                      className="px-4 py-2 rounded-lg hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Videos List */}
            <div className="space-y-3">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`bg-white rounded-lg shadow p-4 transition-all ${
                    editingVideo === video.id ? "ring-2 ring-black" : ""
                  }`}
                >
                  {/* Drag Handle & Hero Badge */}
                  <div className="flex items-start gap-4">
                    <div className="cursor-grab active:cursor-grabbing pt-2">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    </div>

                    {index === 0 && (
                      <div className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        HERO
                      </div>
                    )}

                    {/* Thumbnail */}
                    <div className="relative w-48 aspect-video bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Video Info */}
                    <div className="flex-1 min-w-0">
                      {editingVideo === video.id ? (
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Title
                            </label>
                            <input
                              type="text"
                              value={editForm.title || ""}
                              onChange={(e) =>
                                setEditForm({ ...editForm, title: e.target.value })
                              }
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <textarea
                              value={editForm.description || ""}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  description: e.target.value,
                                })
                              }
                              rows={4}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700">
                                Duration
                              </label>
                              <input
                                type="text"
                                value={editForm.duration || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    duration: e.target.value,
                                  })
                                }
                                placeholder="03:14"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">
                                Creator
                              </label>
                              <input
                                type="text"
                                value={editForm.creator || ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    creator: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={saveEdit}
                              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-4 py-2 rounded-lg hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-semibold text-lg mb-1">
                            {video.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {video.creator} • {video.duration}
                          </p>
                          {video.description && (
                            <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                              {video.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              {video.platform}
                            </span>
                            {video.hidden && (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                Hidden
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    {editingVideo !== video.id && (
                      <div className="flex items-center gap-2">
                        {index !== 0 && (
                          <button
                            onClick={() => setAsHero(video.id)}
                            className="p-2 rounded-lg hover:bg-yellow-100 text-yellow-700"
                            title="Set as Hero"
                          >
                            <Crown className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => toggleHidden(video.id)}
                          className="p-2 rounded-lg hover:bg-gray-100"
                          title={video.hidden ? "Show" : "Hide"}
                        >
                          {video.hidden ? (
                            <EyeOff className="w-4 h-4 text-gray-600" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                        <button
                          onClick={() => startEdit(video)}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                          title="Edit"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteVideo(video.id)}
                          className="p-2 rounded-lg hover:bg-red-100 text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="mt-8 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                How to use this panel:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Drag</strong> videos to reorder them (first is the hero)</li>
                <li>• Click the <strong>Crown icon</strong> to set a video as the hero</li>
                <li>• <strong>Edit</strong> titles, descriptions, and other info</li>
                <li>• <strong>Hide/Show</strong> videos using the eye icon</li>
                <li>• <strong>Add</strong> YouTube videos by pasting a URL</li>
                <li>• Don't forget to <strong>Save Changes</strong> when done!</li>
              </ul>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
