"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  Trash2,
  GripVertical,
  Plus,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  Crown,
  ChevronLeft,
  Pencil,
} from "lucide-react";
import { useAdminAuth } from "../useAdminAuth";

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

export default function AdminVideosPage() {
  const { isAuthenticated, githubToken, config, isLoaded } = useAdminAuth();
  
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

  useEffect(() => {
    if (isLoaded && isAuthenticated) {
      fetchVideos();
    }
  }, [isLoaded, isAuthenticated]);

  const fetchVideos = async () => {
    setSaveStatus({ type: null, message: "" });
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/app/filmmaking/videos.json?ref=${config.branch}`,
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Use browser-native decoding instead of Buffer
        const content = new TextDecoder().decode(
          Uint8Array.from(atob(data.content.replace(/\s/g, "")), (c) =>
            c.charCodeAt(0)
          )
        );
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

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus({ type: null, message: "" });

    try {
      // Step 1: Get current file SHA
      const getFileResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/app/filmmaking/videos.json?ref=${config.branch}`,
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!getFileResponse.ok) {
        throw new Error("Failed to get current file");
      }

      const fileData = await getFileResponse.json();
      const fileSha = fileData.sha;
      // Use browser-native encoding
      const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(videos, null, 2))));

      // Step 2: Update videos.json directly on the main branch
      const updateFileResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/app/filmmaking/videos.json`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: "Update videos from admin panel (direct commit)",
            content: contentBase64,
            sha: fileSha,
            branch: config.branch,
          }),
        }
      );

      if (!updateFileResponse.ok) {
        throw new Error("Failed to update videos file");
      }

      setSaveStatus({
        type: "success",
        message: "Published successfully! Site is rebuilding."
      });

    } catch (error: any) {
      setSaveStatus({ type: "error", message: `Failed to save: ${error.message}` });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus({ type: null, message: "" }), 10000);
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

  const addYouTubeVideo = async () => {
    const match = newVideoUrl.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
    );
    if (!match) {
      alert("Invalid YouTube URL");
      return;
    }

    const youtubeId = match[1];
    
    const newVideo: Video = {
      id: youtubeId,
      videoId: youtubeId,
      title: "New Video (Edit Title)",
      thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
      duration: "00:00",
      platform: "youtube",
      creator: "United Studio Collective",
      description: "",
      hidden: false,
    };

    try {
      const oembedResponse = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`
      );

      if (oembedResponse.ok) {
        const oembedData = await oembedResponse.json();
        newVideo.title = oembedData.title || newVideo.title;
      }
    } catch (error) {
      console.log("Could not fetch YouTube info, using defaults");
    }

    setVideos([...videos, newVideo]);
    setNewVideoUrl("");
    setShowAddForm(false);
  };

  if (!isLoaded) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-black">Manage Filmmaking</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Publish Changes
          </button>
        </div>
      </header>

      {saveStatus.type && (
        <div className={`max-w-7xl mx-auto px-4 mt-4 ${saveStatus.type === "success" ? "text-green-600" : "text-red-600"}`}>
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-2">
            {saveStatus.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {saveStatus.message}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            <div className="mb-6">
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-50 border"
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
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                    />
                    <button onClick={addYouTubeVideo} className="bg-black text-white px-4 py-2 rounded-lg">Add</button>
                    <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-lg hover:bg-gray-100">Cancel</button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`bg-white rounded-lg shadow-sm p-4 transition-all border border-gray-100 ${editingVideo === video.id ? "ring-2 ring-black" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="cursor-grab active:cursor-grabbing pt-2">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    </div>

                    {index === 0 && (
                      <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        HERO
                      </div>
                    )}

                    <div className="relative w-48 aspect-video bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      <Image src={video.thumbnail} alt={video.title} fill className="object-cover" unoptimized />
                    </div>

                    <div className="flex-1 min-w-0">
                      {editingVideo === video.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editForm.title || ""}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg text-black"
                            placeholder="Title"
                          />
                          <textarea
                            value={editForm.description || ""}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border rounded-lg text-black"
                            placeholder="Description"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={editForm.duration || ""}
                              onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg text-black"
                              placeholder="Duration (e.g. 03:14)"
                            />
                            <input
                              type="text"
                              value={editForm.creator || ""}
                              onChange={(e) => setEditForm({ ...editForm, creator: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg text-black"
                              placeholder="Creator"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button onClick={saveEdit} className="bg-black text-white px-4 py-2 rounded-lg">Done</button>
                            <button onClick={cancelEdit} className="px-4 py-2 bg-gray-100 rounded-lg">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-bold text-lg mb-1">{video.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{video.creator} • {video.duration}</p>
                          {video.description && <p className="text-sm text-gray-700 line-clamp-2 mb-2">{video.description}</p>}
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">{video.platform}</span>
                            {video.hidden && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Hidden</span>}
                          </div>
                        </>
                      )}
                    </div>

                    {editingVideo !== video.id && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleHidden(video.id)} className="p-2 hover:bg-gray-100 rounded-lg">
                          {video.hidden ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-600" />}
                        </button>
                        <button onClick={() => startEdit(video)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteVideo(video.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
