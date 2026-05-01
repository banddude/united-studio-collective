"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Mail,
} from "lucide-react";
import { useAdminAuth } from "../useAdminAuth";

interface ContactData {
  page: string;
  title: string;
  email: string;
  background_image: string;
  form_fields: Array<{
    name: string;
    type: string;
    required?: boolean;
    placeholder?: string;
  }>;
  submit_button: string;
}

export default function AdminContactPage() {
  const { isAuthenticated, githubToken, config, isLoaded } = useAdminAuth();

  const [data, setData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const fetchContactData = useCallback(async () => {
    setSaveStatus({ type: null, message: "" });
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/content/contact.json?ref=${config.branch}`,
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
        throw new Error("Failed to fetch contact data");
      }
    } catch (error) {
      console.error(error);
      setSaveStatus({
        type: "error",
        message: "Failed to load contact data. Check your GitHub token.",
      });
    } finally {
      setLoading(false);
    }
  }, [config, githubToken]);

  useEffect(() => {
    if (isLoaded && isAuthenticated) {
      fetchContactData();
    }
  }, [isLoaded, isAuthenticated, fetchContactData]);

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    setSaveStatus({ type: null, message: "" });

    try {
      const getFileResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/content/contact.json?ref=${config.branch}`,
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!getFileResponse.ok) throw new Error("Failed to get current file");

      const fileData = await getFileResponse.json();
      const contentBase64 = btoa(
        unescape(encodeURIComponent(JSON.stringify(data, null, 2)))
      );

      const updateResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/content/contact.json`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: "Update contact page from admin panel",
            content: contentBase64,
            sha: fileData.sha,
            branch: config.branch,
          }),
        }
      );

      if (!updateResponse.ok) throw new Error("Failed to update contact file");

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

  if (!isLoaded) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">Manage Contact Page</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Publish Changes
          </button>
        </div>
      </header>

      {saveStatus.type && (
        <div
          className={`max-w-4xl mx-auto px-4 mt-4 ${
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Page Title Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5" />
                <h2 className="text-lg font-bold">Page Settings</h2>
              </div>

              <div className="space-y-4">
                {/* Title/Heading */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title / Heading
                  </label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    placeholder="Connect with us on future projects"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This is the main heading displayed on the contact form.
                  </p>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email Address
                  </label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    placeholder="Unitedstudiocollective@gmail.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Messages will be sent to this email address. Also displayed
                    at the bottom of the contact form.
                  </p>
                </div>

                {/* Background Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Image Description
                  </label>
                  <input
                    type="text"
                    value={data.background_image}
                    onChange={(e) =>
                      setData({ ...data, background_image: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    placeholder="Griffith Observatory at night"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Description of the background image for reference.
                  </p>
                </div>

                {/* Submit Button Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submit Button Text
                  </label>
                  <input
                    type="text"
                    value={data.submit_button}
                    onChange={(e) =>
                      setData({ ...data, submit_button: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    placeholder="Submit"
                  />
                </div>
              </div>
            </div>

            {/* Form Fields Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-bold mb-4">Form Fields</h2>
              <p className="text-sm text-gray-600 mb-4">
                These form fields are displayed on the contact form. You can edit
                field names and placeholders.
              </p>

              <div className="space-y-4">
                {data.form_fields.map((field, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Field Name
                        </label>
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) => {
                            const newFields = [...data.form_fields];
                            newFields[index] = {
                              ...field,
                              name: e.target.value,
                            };
                            setData({ ...data, form_fields: newFields });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm text-black"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Field Type
                        </label>
                        <select
                          value={field.type}
                          onChange={(e) => {
                            const newFields = [...data.form_fields];
                            newFields[index] = {
                              ...field,
                              type: e.target.value,
                            };
                            setData({ ...data, form_fields: newFields });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm text-black"
                        >
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="tel">Phone</option>
                          <option value="textarea">Textarea</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Placeholder
                        </label>
                        <input
                          type="text"
                          value={field.placeholder || ""}
                          onChange={(e) => {
                            const newFields = [...data.form_fields];
                            newFields[index] = {
                              ...field,
                              placeholder: e.target.value,
                            };
                            setData({ ...data, form_fields: newFields });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm text-black"
                        />
                      </div>

                      <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.required || false}
                            onChange={(e) => {
                              const newFields = [...data.form_fields];
                              newFields[index] = {
                                ...field,
                                required: e.target.checked,
                              };
                              setData({ ...data, form_fields: newFields });
                            }}
                            className="rounded"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Required Field
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                Note: Form fields are displayed in the order shown above. To
                reorder fields, please edit the contact.json file directly or
                contact an administrator.
              </p>
            </div>

            {/* Preview Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-bold mb-4">Preview</h2>
              <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                <div>
                  <h3 className="text-base font-light text-gray-800 text-center mb-4">
                    {data.title}
                  </h3>
                  <div className="space-y-2 max-w-sm mx-auto">
                    {data.form_fields.map((field, index) => (
                      <div key={index}>
                        <input
                          type={field.type === "textarea" ? "text" : field.type}
                          placeholder={`${field.name}${field.required ? " *" : ""}`}
                          disabled
                          className="w-full px-3 py-2 text-xs bg-gray-200 text-gray-500 placeholder-gray-400 border-b border-gray-300 cursor-not-allowed"
                        />
                      </div>
                    ))}
                    <div className="flex justify-center pt-2">
                      <button disabled className="px-8 py-2 bg-gray-400 text-white text-xs font-medium cursor-not-allowed rounded">
                        {data.submit_button}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <a className="text-gray-400 text-xs cursor-not-allowed">
                    {data.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
