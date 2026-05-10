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
  User,
  Crown,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { useAdminAuth } from "../useAdminAuth";

interface Member {
  name: string;
  role: string;
  bio: string;
  image: string;
  website?: string;
  instagram?: string;
  youtube?: string;
  audioUrl?: string;
  storeSlug?: string;
}

interface CollectiveData {
  page: string;
  title: string;
  description: string;
  headliner: Member;
  pastArtists: Member[];
  // Legacy field, migrated on load if present
  members?: Member[];
}

const emptyMember: Member = {
  name: "",
  role: "",
  bio: "",
  image: "",
  website: "",
  instagram: "",
  youtube: "",
  audioUrl: "",
  storeSlug: "",
};

export default function AdminCollectivePage() {
  const { isAuthenticated, githubToken, config, isLoaded } = useAdminAuth();

  const [data, setData] = useState<CollectiveData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [editingHeadliner, setEditingHeadliner] = useState(false);
  const [headlinerForm, setHeadlinerForm] = useState<Partial<Member>>({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Member>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState<Member>(emptyMember);
  const [uploading, setUploading] = useState(false);
  const [uploadingFor, setUploadingFor] = useState<number | "new" | "headliner" | null>(null);

  const fetchData = useCallback(async () => {
    setSaveStatus({ type: null, message: "" });
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/content/collective.json?ref=${config.branch}`,
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch collective data");

      const result = await response.json();
      const content = new TextDecoder().decode(
        Uint8Array.from(atob(result.content.replace(/\s/g, "")), (c) =>
          c.charCodeAt(0)
        )
      );
      const parsed = JSON.parse(content) as CollectiveData;

      // Migrate legacy { members: [] } shape: first becomes headliner, rest become pastArtists
      if (!parsed.headliner && Array.isArray(parsed.members) && parsed.members.length > 0) {
        const [first, ...rest] = parsed.members;
        parsed.headliner = first;
        parsed.pastArtists = rest;
        delete parsed.members;
      }
      if (!parsed.headliner) parsed.headliner = { ...emptyMember };
      if (!Array.isArray(parsed.pastArtists)) parsed.pastArtists = [];

      setData(parsed);
    } catch {
      setSaveStatus({
        type: "error",
        message: "Failed to load data. Check your GitHub token.",
      });
    } finally {
      setLoading(false);
    }
  }, [githubToken, config.owner, config.repo, config.branch]);

  useEffect(() => {
    if (isLoaded && isAuthenticated) {
      fetchData();
    }
  }, [isLoaded, isAuthenticated, fetchData]);

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    setSaveStatus({ type: null, message: "" });

    try {
      const getFileResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/content/collective.json?ref=${config.branch}`,
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!getFileResponse.ok) throw new Error("Failed to get current file");

      const fileData = await getFileResponse.json();
      
      // Strip the legacy field on save so it doesn't reappear
      const payload: CollectiveData = {
        page: data.page,
        title: data.title,
        description: data.description,
        headliner: data.headliner,
        pastArtists: data.pastArtists,
      };
      const contentBase64 = btoa(
        unescape(encodeURIComponent(JSON.stringify(payload, null, 2)))
      );

      const updateResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/content/collective.json`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: "Update collective from admin panel",
            content: contentBase64,
            sha: fileData.sha,
            branch: config.branch,
          }),
        }
      );

      if (!updateResponse.ok) throw new Error("Failed to update file");

      setSaveStatus({
        type: "success",
        message: "Published successfully! Site is rebuilding.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setSaveStatus({ type: "error", message: `Failed to save: ${message}` });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus({ type: null, message: "" }), 10000);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("artistIndex", index.toString());
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!data) return;
    const dragIndex = parseInt(e.dataTransfer.getData("artistIndex"));
    if (Number.isNaN(dragIndex) || dragIndex === dropIndex) return;

    const newArtists = [...data.pastArtists];
    const [dragged] = newArtists.splice(dragIndex, 1);
    newArtists.splice(dropIndex, 0, dragged);
    setData({ ...data, pastArtists: newArtists });
  };

  const deletePastArtist = (index: number) => {
    if (!data) return;
    if (confirm("Delete this past artist?")) {
      setData({
        ...data,
        pastArtists: data.pastArtists.filter((_, i) => i !== index),
      });
    }
  };

  const addPastArtist = () => {
    if (!data || !newMember.name) return;
    setData({ ...data, pastArtists: [...data.pastArtists, newMember] });
    setNewMember(emptyMember);
    setShowAddForm(false);
  };

  // Promote a past artist to headliner. The current headliner moves into the
  // past artists list at the same index the promoted artist used to occupy,
  // so the relative order is preserved.
  const promoteToHeadliner = (index: number) => {
    if (!data) return;
    const promoted = data.pastArtists[index];
    const newPastArtists = [...data.pastArtists];
    newPastArtists.splice(index, 1, data.headliner);
    setData({ ...data, headliner: promoted, pastArtists: newPastArtists });
    setEditingIndex(null);
    setEditingHeadliner(false);
  };

  // Move the current headliner into the past artists list (front of the list)
  // and clear the headliner slot. Saves naturally fall back to the next-most
  // recent artist if you forget to set one, but the UI still warns.
  const demoteHeadliner = () => {
    if (!data) return;
    if (!confirm("Move the current headliner into Past Artists? You'll need to promote someone else.")) return;
    setData({
      ...data,
      headliner: { ...emptyMember },
      pastArtists: [data.headliner, ...data.pastArtists],
    });
    setEditingHeadliner(false);
  };

  const uploadImage = async (file: File, target: number | "new" | "headliner") => {
    setUploading(true);
    setUploadingFor(target);

    try {
      let processedFile = file;
      const isHeic =
        file.name.toLowerCase().endsWith(".heic") ||
        file.name.toLowerCase().endsWith(".heif");
      if (isHeic) {
        const heic2any = (await import("heic2any")).default;
        const convertedBlob = (await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.9,
        })) as Blob;
        const jpegName = file.name
          .replace(/\.heic$/i, ".jpg")
          .replace(/\.heif$/i, ".jpg");
        processedFile = new File([convertedBlob], jpegName, {
          type: "image/jpeg",
        });
      }

      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(processedFile);
      const base64Content = await base64Promise;

      const timestamp = Date.now();
      const safeName = processedFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = `public/images/collective/${timestamp}_${safeName}`;

      const uploadResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: `Upload collective photo: ${safeName}`,
            content: base64Content,
            branch: config.branch,
          }),
        }
      );

      if (!uploadResponse.ok) throw new Error("Failed to upload image");

      const imageUrl = `/images/collective/${timestamp}_${safeName}`;

      if (target === "new") {
        setNewMember({ ...newMember, image: imageUrl });
      } else if (target === "headliner") {
        setHeadlinerForm({ ...headlinerForm, image: imageUrl });
      } else if (editingIndex !== null) {
        setEditForm({ ...editForm, image: imageUrl });
      }

      setSaveStatus({
        type: "success",
        message: "Image uploaded! Will appear after rebuild.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setSaveStatus({ type: "error", message: `Upload failed: ${message}` });
    } finally {
      setUploading(false);
      setUploadingFor(null);
      setTimeout(() => setSaveStatus({ type: null, message: "" }), 5000);
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
            <h1 className="text-xl font-bold">Manage Collective</h1>
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

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Settings */}
        {data && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">Page Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Page Title</label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={data.description}
                  onChange={(e) =>
                    setData({ ...data, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Headliner */}
        {data && (
          <div className="bg-white rounded-lg shadow p-6 mb-8 border-2 border-yellow-400">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-bold">Current Headliner</h2>
            </div>

            {editingHeadliner ? (
              <ArtistFormFields
                form={headlinerForm}
                onChange={(patch) => setHeadlinerForm((prev) => ({ ...prev, ...patch }))}
                imageUrl={headlinerForm.image || data.headliner.image}
                uploading={uploading && uploadingFor === "headliner"}
                onUpload={(file) => uploadImage(file, "headliner")}
                actions={
                  <>
                    <button
                      onClick={() => {
                        setData({
                          ...data,
                          headliner: { ...data.headliner, ...headlinerForm },
                        });
                        setEditingHeadliner(false);
                      }}
                      className="bg-black text-white px-3 py-1 rounded text-sm"
                    >
                      Done
                    </button>
                    <button
                      onClick={() => {
                        setEditingHeadliner(false);
                        setHeadlinerForm({});
                      }}
                      className="px-3 py-1 bg-gray-100 rounded text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={demoteHeadliner}
                      className="ml-auto px-3 py-1 bg-gray-100 rounded text-sm flex items-center gap-1 hover:bg-gray-200"
                    >
                      <ArrowDown className="w-3 h-3" />
                      Move to Past Artists
                    </button>
                  </>
                }
              />
            ) : (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-56 aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {data.headliner.image ? (
                    <Image
                      src={data.headliner.image}
                      alt={data.headliner.name || "Headliner"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold">
                    {data.headliner.name || (
                      <span className="italic text-gray-400">No headliner set</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{data.headliner.role}</p>
                  <p className="text-sm text-gray-600 mb-4 whitespace-pre-line line-clamp-4">
                    {data.headliner.bio || (
                      <span className="italic text-gray-400">No bio</span>
                    )}
                  </p>
                  <div className="text-xs text-gray-500 space-y-1 mb-4">
                    {data.headliner.youtube && (
                      <div>
                        <strong>YouTube:</strong> {data.headliner.youtube}
                      </div>
                    )}
                    {data.headliner.instagram && (
                      <div>
                        <strong>Instagram:</strong> {data.headliner.instagram}
                      </div>
                    )}
                    {data.headliner.website && (
                      <div>
                        <strong>Website:</strong> {data.headliner.website}
                      </div>
                    )}
                    {data.headliner.storeSlug && (
                      <div>
                        <strong>Store:</strong> {data.headliner.storeSlug}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setHeadlinerForm({ ...data.headliner });
                      setEditingHeadliner(true);
                    }}
                    className="text-xs font-semibold hover:underline"
                  >
                    EDIT HEADLINER
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Past Artists section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Past Artists</h2>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              <Plus className="w-4 h-4" />
              Add Past Artist
            </button>
          )}
        </div>

        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="font-semibold mb-4">Add New Past Artist</h3>
            <ArtistFormFields
              form={newMember}
              onChange={(patch) => setNewMember((prev) => ({ ...prev, ...patch }))}
              imageUrl={newMember.image}
              uploading={uploading && uploadingFor === "new"}
              onUpload={(file) => uploadImage(file, "new")}
              actions={
                <>
                  <button
                    onClick={addPastArtist}
                    disabled={!newMember.name}
                    className="bg-black text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                  >
                    Add Artist
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewMember(emptyMember);
                    }}
                    className="px-3 py-1 bg-gray-100 rounded text-sm"
                  >
                    Cancel
                  </button>
                </>
              }
            />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.pastArtists.map((member, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, index)}
                className="bg-white rounded-xl shadow-sm overflow-hidden group border border-gray-100"
              >
                <div className="relative aspect-[3/4] bg-gray-100 cursor-grab active:cursor-grabbing">
                  {member.image ? (
                    <Image src={member.image} alt={member.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 p-1 bg-white/80 backdrop-blur rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <div className="p-4">
                  {editingIndex === index ? (
                    <ArtistFormFields
                      form={editForm}
                      onChange={(patch) => setEditForm((prev) => ({ ...prev, ...patch }))}
                      imageUrl={editForm.image || member.image}
                      uploading={uploading && uploadingFor === index}
                      onUpload={(file) => uploadImage(file, index)}
                      compact
                      actions={
                        <>
                          <button
                            onClick={() => {
                              const newArtists = [...data!.pastArtists];
                              newArtists[index] = { ...member, ...editForm };
                              setData({ ...data!, pastArtists: newArtists });
                              setEditingIndex(null);
                            }}
                            className="bg-black text-white px-3 py-1 rounded text-sm"
                          >
                            Done
                          </button>
                          <button
                            onClick={() => setEditingIndex(null)}
                            className="px-3 py-1 bg-gray-100 rounded text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => promoteToHeadliner(index)}
                            className="ml-auto px-3 py-1 bg-yellow-100 text-yellow-900 rounded text-sm flex items-center gap-1 hover:bg-yellow-200"
                            title="Promote to headliner (current headliner moves here)"
                          >
                            <ArrowUp className="w-3 h-3" />
                            Make Headliner
                          </button>
                        </>
                      }
                    />
                  ) : (
                    <>
                      <h3 className="font-semibold text-black">{member.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{member.role}</p>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {member.bio || <span className="italic text-gray-400">No bio</span>}
                      </p>
                      <div className="flex items-center justify-between border-t pt-3">
                        <button
                          onClick={() => {
                            setEditingIndex(index);
                            setEditForm(member);
                          }}
                          className="text-xs font-semibold hover:underline"
                        >
                          EDIT
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => promoteToHeadliner(index)}
                            className="text-xs text-yellow-700 hover:text-yellow-900 flex items-center gap-1"
                            title="Promote to headliner"
                          >
                            <Crown className="w-3 h-3" />
                            Headliner
                          </button>
                          <button
                            onClick={() => deletePastArtist(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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

interface ArtistFormFieldsProps {
  form: Partial<Member>;
  onChange: (patch: Partial<Member>) => void;
  imageUrl: string;
  uploading: boolean;
  onUpload: (file: File) => void;
  compact?: boolean;
  actions: React.ReactNode;
}

function ArtistFormFields({ form, onChange, imageUrl, uploading, onUpload, compact, actions }: ArtistFormFieldsProps) {
  const update = (patch: Partial<Member>) => onChange(patch);

  const inputClass = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none text-sm";

  return (
    <div className={compact ? "space-y-3" : "grid md:grid-cols-2 gap-6"}>
      {!compact && (
        <div>
          <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
            {imageUrl ? (
              <Image src={imageUrl} alt="Preview" fill className="object-cover" unoptimized />
            ) : (
              <User className="w-16 h-16 text-gray-300" />
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
          <label className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800">
            <Upload className="w-4 h-4" />
            Upload Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file);
                e.target.value = "";
              }}
              disabled={uploading}
            />
          </label>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={form.name || ""}
            onChange={(e) => update({ name: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <input
            type="text"
            value={form.role || ""}
            onChange={(e) => update({ role: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            value={form.bio || ""}
            onChange={(e) => update({ bio: e.target.value })}
            rows={compact ? 2 : 4}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Website URL</label>
            <input
              type="url"
              value={form.website || ""}
              onChange={(e) => update({ website: e.target.value })}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instagram URL</label>
            <input
              type="url"
              value={form.instagram || ""}
              onChange={(e) => update({ instagram: e.target.value })}
              placeholder="https://instagram.com/..."
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">YouTube URL</label>
            <input
              type="text"
              value={form.youtube || ""}
              onChange={(e) => update({ youtube: e.target.value })}
              placeholder="https://youtu.be/VIDEO_ID"
              className={inputClass}
            />
            <p className="text-xs text-gray-500 mt-1">Full URL or just the video ID. Sets up the interview page.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Audio Interview URL</label>
            <input
              type="url"
              value={form.audioUrl || ""}
              onChange={(e) => update({ audioUrl: e.target.value })}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Store Slug</label>
          <input
            type="text"
            value={form.storeSlug || ""}
            onChange={(e) => update({ storeSlug: e.target.value })}
            placeholder="jessica-n-maxwell"
            className={inputClass}
          />
          <p className="text-xs text-gray-500 mt-1">Used for store collection link</p>
        </div>
        {compact && (
          <label className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 text-sm">
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Change Photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file);
                e.target.value = "";
              }}
              disabled={uploading}
            />
          </label>
        )}
        <div className="flex gap-2 items-center pt-2">{actions}</div>
      </div>
    </div>
  );
}
