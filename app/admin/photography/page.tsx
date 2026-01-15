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
  Image as LucideImage,
  Upload,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useAdminAuth } from "../useAdminAuth";

interface PhotoImage {
  src: string;
  description: string;
}

interface HeroData {
  enabled: boolean;
  image: string;
  title: string;
  subtitle: string;
}

interface PhotographyData {
  page: string;
  title: string;
  layout: string;
  has_load_more: boolean;
  hero?: HeroData;
  images: PhotoImage[];
}

export default function AdminPhotographyPage() {
  const { isAuthenticated, githubToken, config, isLoaded } = useAdminAuth();
  
  const [data, setData] = useState<PhotographyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<PhotoImage>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<"hero" | "gallery" | null>(null);

  useEffect(() => {
    if (isLoaded && isAuthenticated) {
      fetchPhotos();
    }
  }, [isLoaded, isAuthenticated]);

  const fetchPhotos = async () => {
    setSaveStatus({ type: null, message: "" });
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/content/photography.json?ref=${config.branch}`,
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
        throw new Error("Failed to fetch photography data");
      }
    } catch (error) {
      setSaveStatus({ type: "error", message: "Failed to load photos. Check your GitHub token." });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    setSaveStatus({ type: null, message: "" });

    try {
      const getFileResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/content/photography.json?ref=${config.branch}`,
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
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/content/photography.json`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: "Update photography from admin panel",
            content: contentBase64,
            sha: fileData.sha,
            branch: config.branch,
          }),
        }
      );

      if (!updateResponse.ok) throw new Error("Failed to update photography file");

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
    e.dataTransfer.setData("photoIndex", index.toString());
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!data) return;
    const dragIndex = parseInt(e.dataTransfer.getData("photoIndex"));
    if (dragIndex === dropIndex) return;

    const newImages = [...data.images];
    const [draggedPhoto] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedPhoto);
    setData({ ...data, images: newImages });
  };

  const deletePhoto = (index: number) => {
    if (!data) return;
    if (confirm("Delete this photo?")) {
      const newImages = data.images.filter((_, i) => i !== index);
      setData({ ...data, images: newImages });
    }
  };

  const addPhoto = () => {
    if (!data || !newPhotoUrl) return;
    const newPhoto: PhotoImage = {
      src: newPhotoUrl,
      description: "New photograph"
    };
    setData({ ...data, images: [newPhoto, ...data.images] });
    setNewPhotoUrl("");
    setShowAddForm(false);
  };

  const uploadImageToGitHub = async (file: File, target: "hero" | "gallery") => {
    setUploading(true);
    setUploadTarget(target);
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
      const filePath = `public/images/photography/${timestamp}_${safeName}`;

      // Upload image file to GitHub
      const uploadResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: `Upload photo: ${safeName}`,
            content: base64Content,
            branch: config.branch,
          }),
        }
      );

      if (!uploadResponse.ok) {
        const err = await uploadResponse.json();
        throw new Error(err.message || "Failed to upload image");
      }

      const imageUrl = `/images/photography/${timestamp}_${safeName}`;

      // Build updated data
      let newData: PhotographyData;
      if (target === "hero") {
        newData = {
          ...data!,
          hero: { ...data!.hero!, image: imageUrl },
        };
      } else {
        const newPhoto: PhotoImage = {
          src: imageUrl,
          description: "New photograph",
        };
        newData = { ...data!, images: [newPhoto, ...data!.images] };
      }

      // Auto-save to GitHub immediately
      const getFileResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/content/photography.json?ref=${config.branch}`,
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
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/content/photography.json`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: `Add photo: ${safeName}`,
            content: contentBase64,
            sha: fileData.sha,
            branch: config.branch,
          }),
        }
      );

      if (!updateResponse.ok) throw new Error("Failed to update photography file");

      setData(newData);
      setSaveStatus({ type: "success", message: "Image uploaded and published! Site is rebuilding." });
    } catch (error: any) {
      setSaveStatus({ type: "error", message: `Upload failed: ${error.message}` });
    } finally {
      setUploading(false);
      setUploadTarget(null);
      setTimeout(() => setSaveStatus({ type: null, message: "" }), 10000);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, target: "hero" | "gallery") => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    // Check if HEIC and convert to JPEG
    const isHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');

    if (isHeic) {
      setUploading(true);
      setUploadTarget(target);
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

        await uploadImageToGitHub(convertedFile, target);
      } catch (error: any) {
        setSaveStatus({ type: "error", message: `HEIC conversion failed: ${error.message}` });
        setUploading(false);
        setUploadTarget(null);
      }
    } else {
      uploadImageToGitHub(file, target);
    }
  };

  const updateHero = (field: keyof HeroData, value: string | boolean) => {
    if (!data) return;
    setData({
      ...data,
      hero: { ...data.hero!, [field]: value },
    });
  };

  if (!isLoaded) return null;
  if (!isAuthenticated) return null; // Handled by dash redirection usually

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">Manage Photography</h1>
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
        {/* Hero Section Editor */}
        {data?.hero && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Hero Section</h2>
              <button
                onClick={() => updateHero("enabled", !data.hero!.enabled)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                  data.hero.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                }`}
              >
                {data.hero.enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                {data.hero.enabled ? "Enabled" : "Disabled"}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                  {data.hero.image && (
                    <Image src={data.hero.image} alt="Hero preview" fill className="object-cover" unoptimized />
                  )}
                  {uploading && uploadTarget === "hero" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800">
                    <Upload className="w-4 h-4" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e, "hero")}
                      disabled={uploading}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={data.hero.image}
                  onChange={(e) => updateHero("image", e.target.value)}
                  placeholder="Or paste image URL..."
                  className="w-full mt-2 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={data.hero.title}
                    onChange={(e) => updateHero("title", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subtitle</label>
                  <textarea
                    value={data.hero.subtitle}
                    onChange={(e) => updateHero("subtitle", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Photo Section */}
        <div className="mb-6 flex gap-3">
          <label className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-800">
            <Upload className="w-4 h-4" />
            {uploading && uploadTarget === "gallery" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Photo"
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, "gallery")}
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
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              />
              <button onClick={addPhoto} className="bg-black text-white px-4 py-2 rounded-lg">Add</button>
              <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-lg hover:bg-gray-100">Cancel</button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">            {data?.images.map((photo, index) => (
              <div 
                key={index} 
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, index)}
                className="bg-white rounded-xl shadow-sm overflow-hidden group border border-gray-100"
              >
                <div className="relative aspect-square bg-gray-100 cursor-grab active:cursor-grabbing">
                  <Image src={photo.src} alt="" fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                  <div className="absolute top-2 left-2 p-1 bg-white/80 backdrop-blur rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <div className="p-4">
                  {editingIndex === index ? (
                    <div className="space-y-3">
                      <textarea
                        value={editForm.description || ""}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            const newImages = [...data!.images];
                            newImages[index] = { ...photo, ...editForm };
                            setData({ ...data!, images: newImages });
                            setEditingIndex(null);
                          }}
                          className="bg-black text-white px-3 py-1 rounded text-sm"
                        >Done</button>
                        <button onClick={() => setEditingIndex(null)} className="px-3 py-1 bg-gray-100 rounded text-sm">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                        {photo.description || <span className="italic text-gray-400">No description</span>}
                      </p>
                      <div className="flex items-center justify-between border-t pt-3">
                        <button 
                          onClick={() => { setEditingIndex(index); setEditForm(photo); }}
                          className="text-xs font-semibold hover:underline"
                        >EDIT CAPTION</button>
                        <button onClick={() => deletePhoto(index)} className="text-red-500 hover:text-red-700">
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
