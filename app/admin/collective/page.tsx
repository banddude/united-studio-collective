"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useAdminAuth } from "../useAdminAuth";

interface Member {
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface CollectiveData {
  page: string;
  title: string;
  description: string;
  members: Member[];
}

export default function AdminCollectivePage() {
  const { isAuthenticated, githubToken, config, isLoaded } = useAdminAuth();

  const [data, setData] = useState<CollectiveData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Member>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState<Member>({
    name: "",
    role: "",
    bio: "",
    image: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadingFor, setUploadingFor] = useState<number | "new" | null>(null);

  useEffect(() => {
    if (isLoaded && isAuthenticated) {
      fetchData();
    }
  }, [isLoaded, isAuthenticated]);

  const fetchData = async () => {
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

      if (response.ok) {
        const result = await response.json();
        const content = new TextDecoder().decode(
          Uint8Array.from(atob(result.content.replace(/\s/g, "")), (c) =>
            c.charCodeAt(0)
          )
        );
        setData(JSON.parse(content));
      } else {
        throw new Error("Failed to fetch collective data");
      }
    } catch (error) {
      setSaveStatus({ type: "error", message: "Failed to load data. Check your GitHub token." });
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
      const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

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
    e.dataTransfer.setData("memberIndex", index.toString());
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!data) return;
    const dragIndex = parseInt(e.dataTransfer.getData("memberIndex"));
    if (dragIndex === dropIndex) return;

    const newMembers = [...data.members];
    const [draggedMember] = newMembers.splice(dragIndex, 1);
    newMembers.splice(dropIndex, 0, draggedMember);
    setData({ ...data, members: newMembers });
  };

  const deleteMember = (index: number) => {
    if (!data) return;
    if (confirm("Delete this team member?")) {
      const newMembers = data.members.filter((_, i) => i !== index);
      setData({ ...data, members: newMembers });
    }
  };

  const addMember = () => {
    if (!data || !newMember.name) return;
    setData({ ...data, members: [...data.members, newMember] });
    setNewMember({ name: "", role: "", bio: "", image: "" });
    setShowAddForm(false);
  };

  const uploadImage = async (file: File, targetIndex: number | "new") => {
    setUploading(true);
    setUploadingFor(targetIndex);

    try {
      // Convert HEIC if needed
      let processedFile = file;
      const isHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
      if (isHeic) {
        const heic2any = (await import("heic2any")).default;
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.9,
        }) as Blob;
        const jpegName = file.name.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg');
        processedFile = new File([convertedBlob], jpegName, { type: "image/jpeg" });
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

      if (targetIndex === "new") {
        setNewMember({ ...newMember, image: imageUrl });
      } else if (editingIndex !== null) {
        setEditForm({ ...editForm, image: imageUrl });
      }

      setSaveStatus({ type: "success", message: "Image uploaded! Will appear after rebuild." });
    } catch (error: any) {
      setSaveStatus({ type: "error", message: `Upload failed: ${error.message}` });
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
        <div className={`max-w-7xl mx-auto px-4 mt-4 ${saveStatus.type === "success" ? "text-green-600" : "text-red-600"}`}>
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-2">
            {saveStatus.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
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
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Add Member Button */}
        <div className="mb-6">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              <Plus className="w-4 h-4" />
              Add Team Member
            </button>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Add New Team Member</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                    {newMember.image ? (
                      <Image src={newMember.image} alt="Preview" fill className="object-cover" unoptimized />
                    ) : (
                      <User className="w-16 h-16 text-gray-300" />
                    )}
                    {uploading && uploadingFor === "new" && (
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
                        if (file) uploadImage(file, "new");
                        e.target.value = "";
                      }}
                      disabled={uploading}
                    />
                  </label>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <input
                      type="text"
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea
                      value={newMember.bio}
                      onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addMember}
                      disabled={!newMember.name}
                      className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                      Add Member
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setNewMember({ name: "", role: "", bio: "", image: "" });
                      }}
                      className="px-4 py-2 bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Members List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.members.map((member, index) => (
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
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Name"
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        value={editForm.role || ""}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        placeholder="Role"
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                      <textarea
                        value={editForm.bio || ""}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        placeholder="Bio"
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        rows={2}
                      />
                      <label className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 text-sm">
                        <Upload className="w-4 h-4" />
                        {uploading && uploadingFor === index ? "Uploading..." : "Change Photo"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadImage(file, index);
                            e.target.value = "";
                          }}
                          disabled={uploading}
                        />
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newMembers = [...data!.members];
                            newMembers[index] = { ...member, ...editForm };
                            setData({ ...data!, members: newMembers });
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
                      </div>
                    </div>
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
                        <button
                          onClick={() => deleteMember(index)}
                          className="text-red-500 hover:text-red-700"
                        >
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
