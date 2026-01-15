"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  Trash2,
  GripVertical,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Upload,
  Crown,
} from "lucide-react";
import { useAdminAuth } from "../useAdminAuth";

interface GalleryImage {
  src: string;
  alt: string;
  description: string;
  link?: string;
}

interface HomeData {
  page: string;
  title: string;
  gallery_images: GalleryImage[];
}

export default function AdminHomePage() {
  const { isAuthenticated, githubToken, config, isLoaded } = useAdminAuth();

  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<GalleryImage>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchHomepageData = useCallback(async () => {
    setSaveStatus({ type: null, message: "" });
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/content/homepage.json?ref=${config.branch}`,
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        const content = new TextDecoder().decode(
          Uint8Array.from(atob(result.content.replace(/\s/g, "")), (c) =>
            c.charCodeAt(0)
          )
        );
        setData(JSON.parse(content));
      } else {
        throw new Error("Failed to fetch homepage data");
      }
    } catch {
      setSaveStatus({ type: "error", message: "Failed to load homepage. Check your GitHub token." });
    } finally {
      setLoading(false);
    }
  }, [githubToken, config.owner, config.repo, config.branch]);

  useEffect(() => {
    if (isLoaded && isAuthenticated) {
      fetchHomepageData();
    }
  }, [isLoaded, isAuthenticated, fetchHomepageData]);

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    setSaveStatus({ type: null, message: "" });

    try {
      const getFileResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/content/homepage.json?ref=${config.branch}`,
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!getFileResponse.ok) throw new Error("Failed to get current file");

      const fileData = await getFileResponse.json();
      const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

      const updateResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/content/homepage.json`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: "Update homepage from admin panel",
            content: contentBase64,
            sha: fileData.sha,
            branch: config.branch,
          }),
        }
      );

      if (!updateResponse.ok) throw new Error("Failed to update homepage file");

      setSaveStatus({
        type: "success",
        message: "Published successfully! Site is rebuilding."
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setSaveStatus({ type: "error", message: `Failed to save: ${errorMessage}` });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus({ type: null, message: "" }), 10000);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("imageIndex", index.toString());
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!data) return;
    const dragIndex = parseInt(e.dataTransfer.getData("imageIndex"));
    if (dragIndex === dropIndex) return;

    const newImages = [...data.gallery_images];
    const [draggedImage] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    setData({ ...data, gallery_images: newImages });
  };

  const deleteImage = (index: number) => {
    if (!data) return;
    if (confirm("Delete this gallery image?")) {
      const newImages = data.gallery_images.filter((_, i) => i !== index);
      setData({ ...data, gallery_images: newImages });
    }
  };

  const addImage = () => {
    if (!data || !newImageUrl) return;
    const newImage: GalleryImage = {
      src: newImageUrl,
      alt: "New image",
      description: "New gallery image",
      link: "/",
    };
    setData({ ...data, gallery_images: [newImage, ...data.gallery_images] });
    setNewImageUrl("");
    setShowAddForm(false);
  };

  const uploadImageToGitHub = async (file: File) => {
    setUploading(true);
    setSaveStatus({ type: null, message: "" });

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const base64Content = await base64Promise;

      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = `public/images/homepage/${timestamp}_${safeName}`;

      const uploadResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: `Upload homepage image: ${safeName}`,
            content: base64Content,
            branch: config.branch,
          }),
        }
      );

      if (!uploadResponse.ok) {
        const err = await uploadResponse.json();
        throw new Error(err.message || "Failed to upload image");
      }

      const imageUrl = `/images/homepage/${timestamp}_${safeName}`;

      const newImage: GalleryImage = {
        src: imageUrl,
        alt: "New image",
        description: "New gallery image",
        link: "/",
      };
      const newData = { ...data!, gallery_images: [newImage, ...data!.gallery_images] };

      // Auto-save to GitHub immediately
      const getFileResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/content/homepage.json?ref=${config.branch}`,
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!getFileResponse.ok) throw new Error("Failed to get current file");

      const fileData = await getFileResponse.json();
      const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(newData, null, 2))));

      const updateResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/content/homepage.json`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: `Add homepage image: ${safeName}`,
            content: contentBase64,
            sha: fileData.sha,
            branch: config.branch,
          }),
        }
      );

      if (!updateResponse.ok) throw new Error("Failed to update homepage file");

      setData(newData);
      setSaveStatus({ type: "success", message: "Image uploaded! Will appear on site in ~1-2 min after rebuild." });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setSaveStatus({ type: "error", message: `Upload failed: ${errorMessage}` });
    } finally {
      setUploading(false);
      setTimeout(() => setSaveStatus({ type: null, message: "" }), 10000);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    // Check if HEIC and convert to JPEG
    const isHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');

    if (isHeic) {
      setUploading(true);
      setSaveStatus({ type: null, message: "" });

      try {
        const heic2any = (await import("heic2any")).default;
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.9,
        }) as Blob;

        const jpegName = file.name.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg');
        const convertedFile = new File([convertedBlob], jpegName, { type: "image/jpeg" });

        await uploadImageToGitHub(convertedFile);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        setSaveStatus({ type: "error", message: `HEIC conversion failed: ${errorMessage}` });
        setUploading(false);
      }
    } else {
      uploadImageToGitHub(file);
    }
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
            <h1 className="text-xl font-bold">Manage Home Page</h1>
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
        {/* Page Title Section */}
        {data && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">Page Settings</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Page Title</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">This is the browser tab title and meta title</p>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <Crown className="w-4 h-4 inline mr-1" />
            <strong>First image = Hero.</strong> Drag images to reorder. The first one displays as the featured hero image on the homepage.
          </p>
        </div>

        {/* Add Image Section */}
        <div className="mb-6 flex gap-3">
          <label className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-800">
            <Upload className="w-4 h-4" />
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Image"
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </label>

          {!showAddForm ? (
            <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg border hover:bg-gray-50">
              <Plus className="w-4 h-4" />
              Add by URL
            </button>
          ) : (
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              />
              <button onClick={addImage} className="bg-black text-white px-4 py-2 rounded-lg">Add</button>
              <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-lg hover:bg-gray-100">Cancel</button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {data?.gallery_images.map((image, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, index)}
                className="bg-white rounded-xl shadow-sm overflow-hidden group border border-gray-100"
              >
                <div className="relative aspect-square bg-gray-100 cursor-grab active:cursor-grabbing">
                  <Image src={image.src} alt={image.alt} fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                  <div className="absolute top-2 left-2 p-1 bg-white/80 backdrop-blur rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-gray-600" />
                  </div>
                  {index === 0 && (
                    <div className="absolute top-2 right-2 p-1.5 bg-yellow-400 rounded-md">
                      <Crown className="w-4 h-4 text-yellow-900" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {editingIndex === index ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Alt Text</label>
                        <input
                          type="text"
                          value={editForm.alt || ""}
                          onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
                          className="w-full px-2 py-1 border rounded text-xs"
                          placeholder="Image description"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Description</label>
                        <textarea
                          value={editForm.description || ""}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full px-2 py-1 border rounded text-xs"
                          rows={2}
                          placeholder="Gallery description"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Link</label>
                        <input
                          type="text"
                          value={editForm.link || ""}
                          onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                          className="w-full px-2 py-1 border rounded text-xs"
                          placeholder="/filmmaking"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newImages = [...data!.gallery_images];
                            newImages[index] = { ...image, ...editForm };
                            setData({ ...data!, gallery_images: newImages });
                            setEditingIndex(null);
                          }}
                          className="bg-black text-white px-3 py-1 rounded text-sm"
                        >Done</button>
                        <button onClick={() => setEditingIndex(null)} className="px-3 py-1 bg-gray-100 rounded text-sm">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-medium text-gray-700 mb-1 line-clamp-1">
                        {image.description || <span className="italic text-gray-400">No description</span>}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1 mb-3">
                        {image.link ? `Link: ${image.link}` : <span className="italic text-gray-400">No link</span>}
                      </p>
                      <div className="flex items-center justify-between border-t pt-3">
                        <button
                          onClick={() => { setEditingIndex(index); setEditForm(image); }}
                          className="text-xs font-semibold hover:underline"
                        >EDIT</button>
                        <button onClick={() => deleteImage(index)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
