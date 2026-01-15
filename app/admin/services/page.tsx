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
  Pencil,
  Upload,
  X,
} from "lucide-react";
import { useAdminAuth } from "../useAdminAuth";

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  image: string;
}

interface CTA {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

interface ServicesData {
  page: string;
  title: string;
  subtitle: string;
  services: Service[];
  cta: CTA;
}

export default function AdminServicesPage() {
  const { isAuthenticated, githubToken, config, isLoaded } = useAdminAuth();

  const [data, setData] = useState<ServicesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [editServiceForm, setEditServiceForm] = useState<Partial<Service>>({});
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [newService, setNewService] = useState<Service>({
    id: "",
    title: "",
    description: "",
    features: [],
    image: "",
  });
  const [newFeatureInput, setNewFeatureInput] = useState("");
  const [editingCTA, setEditingCTA] = useState(false);
  const [editingPageSettings, setEditingPageSettings] = useState(false);

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
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/content/services.json?ref=${config.branch}`,
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
        throw new Error("Failed to fetch services data");
      }
    } catch (error) {
      setSaveStatus({ type: "error", message: "Failed to load services. Check your GitHub token." });
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
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/content/services.json?ref=${config.branch}`,
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
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/content/services.json`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: "Update services from admin panel",
            content: contentBase64,
            sha: fileData.sha,
            branch: config.branch,
          }),
        }
      );

      if (!updateResponse.ok) throw new Error("Failed to update services file");

      setSaveStatus({
        type: "success",
        message: "Published successfully! Site is rebuilding.",
      });
    } catch (error: any) {
      setSaveStatus({ type: "error", message: `Failed to save: ${error.message}` });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus({ type: null, message: "" }), 10000);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("serviceIndex", index.toString());
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!data) return;
    const dragIndex = parseInt(e.dataTransfer.getData("serviceIndex"));
    if (dragIndex === dropIndex) return;

    const newServices = [...data.services];
    const [draggedService] = newServices.splice(dragIndex, 1);
    newServices.splice(dropIndex, 0, draggedService);
    setData({ ...data, services: newServices });
  };

  const deleteService = (index: number) => {
    if (!data) return;
    if (confirm("Delete this service?")) {
      const newServices = data.services.filter((_, i) => i !== index);
      setData({ ...data, services: newServices });
    }
  };

  const addService = () => {
    if (!data || !newService.title || !newService.id) return;
    setData({ ...data, services: [...data.services, newService] });
    setNewService({ id: "", title: "", description: "", features: [], image: "" });
    setShowAddServiceForm(false);
  };

  const addFeatureToNew = () => {
    if (newFeatureInput.trim()) {
      setNewService({
        ...newService,
        features: [...newService.features, newFeatureInput.trim()],
      });
      setNewFeatureInput("");
    }
  };

  const removeFeatureFromNew = (index: number) => {
    setNewService({
      ...newService,
      features: newService.features.filter((_, i) => i !== index),
    });
  };

  const addFeatureToEdit = () => {
    if (newFeatureInput.trim() && editServiceForm.features) {
      setEditServiceForm({
        ...editServiceForm,
        features: [...editServiceForm.features, newFeatureInput.trim()],
      });
      setNewFeatureInput("");
    }
  };

  const removeFeatureFromEdit = (index: number) => {
    if (editServiceForm.features) {
      setEditServiceForm({
        ...editServiceForm,
        features: editServiceForm.features.filter((_, i) => i !== index),
      });
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
            <h1 className="text-xl font-bold">Manage Services</h1>
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
        {data && !editingPageSettings && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Page Settings</h2>
              <button
                onClick={() => setEditingPageSettings(true)}
                className="flex items-center gap-2 text-sm font-semibold hover:underline"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="space-y-2">
              <p><span className="font-semibold">Title:</span> {data.title}</p>
              <p><span className="font-semibold">Subtitle:</span> {data.subtitle}</p>
            </div>
          </div>
        )}

        {data && editingPageSettings && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">Edit Page Settings</h2>
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
                <label className="block text-sm font-medium mb-1">Subtitle</label>
                <textarea
                  value={data.subtitle}
                  onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
              </div>
              <button
                onClick={() => setEditingPageSettings(false)}
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {data && !editingCTA && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">CTA Section</h2>
              <button
                onClick={() => setEditingCTA(true)}
                className="flex items-center gap-2 text-sm font-semibold hover:underline"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="space-y-2">
              <p><span className="font-semibold">Title:</span> {data.cta.title}</p>
              <p><span className="font-semibold">Description:</span> {data.cta.description}</p>
              <p><span className="font-semibold">Button Text:</span> {data.cta.buttonText}</p>
              <p><span className="font-semibold">Button Link:</span> {data.cta.buttonLink}</p>
            </div>
          </div>
        )}

        {data && editingCTA && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">Edit CTA Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">CTA Title</label>
                <input
                  type="text"
                  value={data.cta.title}
                  onChange={(e) => setData({ ...data, cta: { ...data.cta, title: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CTA Description</label>
                <textarea
                  value={data.cta.description}
                  onChange={(e) => setData({ ...data, cta: { ...data.cta, description: e.target.value } })}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Button Text</label>
                <input
                  type="text"
                  value={data.cta.buttonText}
                  onChange={(e) => setData({ ...data, cta: { ...data.cta, buttonText: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Button Link</label>
                <input
                  type="text"
                  value={data.cta.buttonLink}
                  onChange={(e) => setData({ ...data, cta: { ...data.cta, buttonLink: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
              </div>
              <button
                onClick={() => setEditingCTA(false)}
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Add Service Button */}
        <div className="mb-6">
          {!showAddServiceForm ? (
            <button
              onClick={() => setShowAddServiceForm(true)}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Add New Service</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Service ID (slug)</label>
                  <input
                    type="text"
                    value={newService.id}
                    onChange={(e) => setNewService({ ...newService, id: e.target.value })}
                    placeholder="e.g., fashion-films"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Service Title</label>
                  <input
                    type="text"
                    value={newService.title}
                    onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                    placeholder="e.g., Fashion Films"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    rows={3}
                    placeholder="Service description..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="text"
                    value={newService.image}
                    onChange={(e) => setNewService({ ...newService, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Features</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newFeatureInput}
                      onChange={(e) => setNewFeatureInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addFeatureToNew()}
                      placeholder="Add feature..."
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                    />
                    <button
                      onClick={addFeatureToNew}
                      className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {newService.features.map((feature, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">{feature}</span>
                        <button
                          onClick={() => removeFeatureFromNew(i)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addService}
                    disabled={!newService.title || !newService.id}
                    className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    Add Service
                  </button>
                  <button
                    onClick={() => {
                      setShowAddServiceForm(false);
                      setNewService({ id: "", title: "", description: "", features: [], image: "" });
                      setNewFeatureInput("");
                    }}
                    className="px-4 py-2 bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Services List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {data?.services.map((service, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, index)}
                className="bg-white rounded-lg shadow-sm overflow-hidden group border border-gray-100"
              >
                {editingServiceIndex === index ? (
                  <div className="p-6">
                    <h3 className="font-semibold mb-4">Edit Service</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Service ID</label>
                        <input
                          type="text"
                          value={editServiceForm.id || ""}
                          onChange={(e) => setEditServiceForm({ ...editServiceForm, id: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                          type="text"
                          value={editServiceForm.title || ""}
                          onChange={(e) => setEditServiceForm({ ...editServiceForm, title: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          value={editServiceForm.description || ""}
                          onChange={(e) => setEditServiceForm({ ...editServiceForm, description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Image URL</label>
                        <input
                          type="text"
                          value={editServiceForm.image || ""}
                          onChange={(e) => setEditServiceForm({ ...editServiceForm, image: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Features</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={newFeatureInput}
                            onChange={(e) => setNewFeatureInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addFeatureToEdit()}
                            placeholder="Add feature..."
                            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none text-sm"
                          />
                          <button
                            onClick={addFeatureToEdit}
                            className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg"
                          >
                            Add
                          </button>
                        </div>
                        <div className="space-y-2">
                          {editServiceForm.features?.map((feature, i) => (
                            <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-sm">{feature}</span>
                              <button
                                onClick={() => removeFeatureFromEdit(i)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newServices = [...data!.services];
                            newServices[index] = { ...service, ...editServiceForm };
                            setData({ ...data!, services: newServices });
                            setEditingServiceIndex(null);
                            setNewFeatureInput("");
                          }}
                          className="bg-black text-white px-3 py-1 rounded text-sm"
                        >
                          Done
                        </button>
                        <button
                          onClick={() => {
                            setEditingServiceIndex(null);
                            setNewFeatureInput("");
                          }}
                          className="px-3 py-1 bg-gray-100 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    <div className="md:col-span-1">
                      <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3">
                        {service.image && (
                          <Image src={service.image} alt={service.title} fill className="object-cover" unoptimized />
                        )}
                      </div>
                      <button
                        onClick={() => deleteService(index)}
                        className="w-full text-red-500 hover:text-red-700 text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                      <p className="text-sm text-gray-500 mb-2 font-mono">{service.id}</p>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{service.description}</p>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-2">Features:</p>
                        <div className="flex flex-wrap gap-2">
                          {service.features.map((feature, i) => (
                            <span key={i} className="bg-gray-100 text-xs px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setEditingServiceIndex(index);
                          setEditServiceForm(service);
                        }}
                        className="mt-4 flex items-center gap-2 text-xs font-semibold hover:underline"
                      >
                        <Pencil className="w-4 h-4" />
                        EDIT
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
