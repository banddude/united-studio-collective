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
} from "lucide-react";
import { useAdminAuth } from "../useAdminAuth";

interface PhotoImage {
  src: string;
  description: string;
  project?: string;
}

interface Project {
  slug: string;
  name: string;
  description?: string;
  hero: string;
  images: string[];
}

interface PhotographyData {
  page: string;
  title: string;
  layout: string;
  has_load_more: boolean;
  projects?: Project[];
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
  const [uploadTargetProject, setUploadTargetProject] = useState<string | null>(null);

  // Project management
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({});

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

  // Project management functions
  const addProject = () => {
    if (!data || !projectForm.name || !projectForm.hero) return;
    const slug = projectForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProject: Project = {
      slug,
      name: projectForm.name,
      description: projectForm.description || "",
      hero: projectForm.hero,
      images: []
    };
    const projects = data.projects || [];
    setData({ ...data, projects: [...projects, newProject] });
    setProjectForm({});
    setShowAddProject(false);
  };

  const updateProject = (index: number) => {
    if (!data || !data.projects) return;
    const projects = [...data.projects];
    projects[index] = { ...projects[index], ...projectForm } as Project;
    setData({ ...data, projects });
    setEditingProjectIndex(null);
    setProjectForm({});
  };

  const deleteProject = (index: number) => {
    if (!data || !data.projects) return;
    if (confirm("Delete this project gallery? Photos won't be deleted.")) {
      const projects = data.projects.filter((_, i) => i !== index);
      setData({ ...data, projects });
    }
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

      // Add new photo - either to a project or standalone
      const newPhoto: PhotoImage = {
        src: imageUrl,
        description: "New photograph",
        ...(uploadTargetProject ? { project: uploadTargetProject } : {})
      };
      const newData = { ...data!, images: [newPhoto, ...data!.images] };

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
      setSaveStatus({ type: "success", message: "Image uploaded! Will appear on site in ~1-2 min after rebuild." });
    } catch (error: any) {
      setSaveStatus({ type: "error", message: `Upload failed: ${error.message}` });
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
      } catch (error: any) {
        setSaveStatus({ type: "error", message: `HEIC conversion failed: ${error.message}` });
        setUploading(false);
      }
    } else {
      uploadImageToGitHub(file);
    }
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
        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Project Galleries</h2>
            <button
              onClick={() => { setShowAddProject(true); setProjectForm({}); }}
              className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-800"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Projects appear as clickable hero banners on the Photography page. Each links to its own gallery.
          </p>

          {/* Add/Edit Project Form */}
          {(showAddProject || editingProjectIndex !== null) && (
            <div className="border rounded-lg p-4 mb-4 bg-gray-50">
              <h3 className="font-medium mb-3">{editingProjectIndex !== null ? "Edit Project" : "New Project"}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Project Name *</label>
                  <input
                    type="text"
                    value={projectForm.name || ""}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    placeholder="e.g., Remain On Hold"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hero Image URL *</label>
                  <input
                    type="text"
                    value={projectForm.hero || ""}
                    onChange={(e) => setProjectForm({ ...projectForm, hero: e.target.value })}
                    placeholder="/images/photography/..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none font-mono text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input
                    type="text"
                    value={projectForm.description || ""}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Brief description of the project"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                {editingProjectIndex !== null ? (
                  <button onClick={() => updateProject(editingProjectIndex)} className="bg-black text-white px-4 py-2 rounded-lg text-sm">
                    Save Changes
                  </button>
                ) : (
                  <button onClick={addProject} disabled={!projectForm.name || !projectForm.hero} className="bg-black text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50">
                    Add Project
                  </button>
                )}
                <button onClick={() => { setShowAddProject(false); setEditingProjectIndex(null); setProjectForm({}); }} className="px-4 py-2 bg-gray-100 rounded-lg text-sm">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Projects List */}
          {data?.projects && data.projects.length > 0 ? (
            <div className="space-y-6">
              {data.projects.map((project, index) => {
                const projectPhotos = data.images.filter(img => img.project === project.slug);
                return (
                  <div key={project.slug} className="border rounded-lg overflow-hidden">
                    {/* Project Header */}
                    <div className="flex items-center gap-4 p-3 bg-gray-50">
                      <div className="w-20 h-14 relative bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <Image src={project.hero} alt={project.name} fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm">{project.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{project.description || "No description"}</p>
                        <p className="text-xs text-gray-400">{projectPhotos.length} photos in gallery</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditingProjectIndex(index); setProjectForm(project); }}
                          className="text-xs font-semibold hover:underline"
                        >
                          EDIT
                        </button>
                        <button onClick={() => deleteProject(index)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Project Photos */}
                    <div className="p-3 border-t">
                      <div className="flex items-center gap-2 mb-3">
                        <label className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded text-xs cursor-pointer hover:bg-gray-800">
                          <Upload className="w-3 h-3" />
                          {uploading && uploadTargetProject === project.slug ? "Uploading..." : "Upload to Gallery"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              setUploadTargetProject(project.slug);
                              handleFileSelect(e);
                            }}
                            disabled={uploading}
                          />
                        </label>
                      </div>

                      {projectPhotos.length > 0 ? (
                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                          {projectPhotos.map((photo, photoIndex) => {
                            const globalIndex = data.images.findIndex(img => img.src === photo.src);
                            return (
                              <div key={photo.src} className="relative aspect-square bg-gray-100 rounded overflow-hidden group">
                                <Image src={photo.src} alt="" fill className="object-cover" unoptimized />
                                <button
                                  onClick={() => {
                                    // Remove from project
                                    const newImages = [...data.images];
                                    delete newImages[globalIndex].project;
                                    setData({ ...data, images: newImages });
                                  }}
                                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Remove from gallery"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">No photos in this gallery yet. Upload some above.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No project galleries yet. Add one to create a clickable hero section.</p>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <Crown className="w-4 h-4 inline mr-1" />
            <strong>Standalone photos</strong> appear in the grid below project heroes. Drag to reorder.
          </p>
        </div>

        {/* Add Photo Section */}
        <div className="mb-6 flex gap-3">
          <label className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-800">
            <Upload className="w-4 h-4" />
            {uploading && !uploadTargetProject ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Standalone Photo"
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                setUploadTargetProject(null);
                handleFileSelect(e);
              }}
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
                  {index === 0 && (
                    <div className="absolute top-2 right-2 p-1.5 bg-yellow-400 rounded-md">
                      <Crown className="w-4 h-4 text-yellow-900" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {editingIndex === index ? (
                    <div className="space-y-3">
                      <textarea
                        value={editForm.description || ""}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        rows={2}
                        placeholder="Description"
                      />
                      <select
                        value={editForm.project || ""}
                        onChange={(e) => setEditForm({ ...editForm, project: e.target.value || undefined })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      >
                        <option value="">Standalone (no project)</option>
                        {data?.projects?.map(p => (
                          <option key={p.slug} value={p.slug}>{p.name}</option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newImages = [...data!.images];
                            const updatedPhoto = { ...photo, ...editForm };
                            if (!updatedPhoto.project) delete updatedPhoto.project;
                            newImages[index] = updatedPhoto;
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
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2 h-10">
                        {photo.description || <span className="italic text-gray-400">No description</span>}
                      </p>
                      {photo.project && (
                        <p className="text-xs text-blue-600 mb-2">
                          In: {data?.projects?.find(p => p.slug === photo.project)?.name || photo.project}
                        </p>
                      )}
                      <div className="flex items-center justify-between border-t pt-3">
                        <button
                          onClick={() => { setEditingIndex(index); setEditForm(photo); }}
                          className="text-xs font-semibold hover:underline"
                        >EDIT</button>
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
