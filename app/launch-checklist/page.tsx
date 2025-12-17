"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Circle, ExternalLink, RefreshCw, Loader2 } from "lucide-react";

interface ChecklistItem {
  id: string;
  task: string;
  description: string;
  owner: "Evan" | "Mike" | "Both";
  link?: string;
  blockedBy?: string;
}

interface ChecklistStatus {
  lastUpdated: string;
  items: Record<string, { done: boolean }>;
}

const basePath = process.env.NODE_ENV === "production" ? "/united-studio-collective" : "";

const GITHUB_REPO = "banddude/united-studio-collective";
const GITHUB_FILE_PATH = "public/config/checklist.json";
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || "";

const checklistItems: ChecklistItem[] = [
  {
    id: "1",
    task: "Build website",
    description: "Next.js site with all pages: Home, Filmmaking, Photography, Store, About, Contact",
    owner: "Mike",
  },
  {
    id: "2",
    task: "SEO optimizations",
    description: "Sitemap, robots.txt, meta tags, Open Graph, Twitter Cards, JSON-LD schemas",
    owner: "Mike",
  },
  {
    id: "3",
    task: "Speed optimizations",
    description: "Image compression, lazy loading, preconnect hints",
    owner: "Mike",
  },
  {
    id: "4",
    task: "Shopping cart",
    description: "Cart functionality with localStorage persistence",
    owner: "Mike",
  },
  {
    id: "5",
    task: "Product pages",
    description: "10 photography prints with frame options",
    owner: "Mike",
  },
  {
    id: "6",
    task: "Deploy to GitHub Pages",
    description: "Site is live at banddude.github.io/united-studio-collective",
    owner: "Mike",
    link: "https://banddude.github.io/united-studio-collective",
  },
  {
    id: "7",
    task: "Transfer domain to Cloudflare",
    description: "Move unitedstudiocollective.com to Cloudflare for DNS management",
    owner: "Evan",
    link: "https://dash.cloudflare.com",
  },
  {
    id: "8",
    task: "Set up DNS records",
    description: "Add A records (185.199.108-111.153) and CNAME (www -> banddude.github.io)",
    owner: "Evan",
    blockedBy: "7",
  },
  {
    id: "9",
    task: "Configure custom domain in GitHub",
    description: "Add unitedstudiocollective.com in repo Settings > Pages",
    owner: "Evan",
    link: "https://github.com/banddude/united-studio-collective/settings/pages",
    blockedBy: "8",
  },
  {
    id: "10",
    task: "Create Stripe account",
    description: "Sign up at stripe.com and verify business details",
    owner: "Evan",
    link: "https://dashboard.stripe.com/register",
  },
  {
    id: "11",
    task: "Create Stripe Payment Links",
    description: "Create payment links for each product variant (frameless, black frame, white frame)",
    owner: "Evan",
    link: "https://dashboard.stripe.com/payment-links",
    blockedBy: "10",
  },
  {
    id: "12",
    task: "Add Payment Links to store.json",
    description: "Edit public/config/store.json with Stripe URLs and set stripeEnabled: true",
    owner: "Evan",
    blockedBy: "11",
  },
  {
    id: "13",
    task: "Update base URL in code",
    description: "Change from GitHub Pages URL to unitedstudiocollective.com",
    owner: "Mike",
    blockedBy: "9",
  },
  {
    id: "14",
    task: "Add Box Chocolate video",
    description: "Replace 'Video coming soon' placeholder with actual video (optional)",
    owner: "Evan",
  },
];

export default function LaunchChecklist() {
  const [status, setStatus] = useState<ChecklistStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${basePath}/config/checklist.json?t=${Date.now()}`);
      const data = await res.json();
      setStatus(data);
      setLastFetch(new Date());
      setError(null);
    } catch (err) {
      console.error("Failed to fetch checklist status:", err);
      setError("Failed to load checklist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const toggleItem = async (id: string) => {
    if (!GITHUB_TOKEN) {
      setError("GitHub token not configured");
      return;
    }

    if (!status) return;

    setUpdating(id);
    setError(null);

    const newStatus: ChecklistStatus = {
      lastUpdated: new Date().toISOString().split("T")[0],
      items: {
        ...status.items,
        [id]: { done: !status.items[id]?.done },
      },
    };

    try {
      // Get current file SHA
      const getRes = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
        {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!getRes.ok) {
        if (getRes.status === 401) {
          setError("Invalid token. Check GitHub token configuration.");
          setUpdating(null);
          return;
        }
        throw new Error(`Failed to get file: ${getRes.status}`);
      }

      const fileData = await getRes.json();
      const sha = fileData.sha;

      // Update file
      const content = btoa(JSON.stringify(newStatus, null, 2));
      const taskName = checklistItems.find(i => i.id === id)?.task || `item ${id}`;
      const action = !status.items[id]?.done ? "Complete" : "Uncomplete";

      const updateRes = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `${action}: ${taskName}`,
            content,
            sha,
          }),
        }
      );

      if (!updateRes.ok) {
        throw new Error(`Failed to update file: ${updateRes.status}`);
      }

      // Update local state immediately
      setStatus(newStatus);
    } catch (err) {
      console.error("Failed to update checklist:", err);
      setError("Failed to save. Check your token and try again.");
    } finally {
      setUpdating(null);
    }
  };

  const isBlocked = (item: ChecklistItem): boolean => {
    if (!item.blockedBy || !status) return false;
    return !status.items[item.blockedBy]?.done;
  };

  const isDone = (id: string): boolean => {
    return status?.items[id]?.done ?? false;
  };

  const getItemsWithStatus = () => {
    return checklistItems.map(item => ({
      ...item,
      done: isDone(item.id),
      blocked: isBlocked(item),
    }));
  };

  const items = getItemsWithStatus();
  const doneCount = items.filter(i => i.done).length;
  const totalCount = items.length;
  const progress = Math.round((doneCount / totalCount) * 100);

  const evanTasks = items.filter(i => i.owner === "Evan" && !i.done);
  const mikeTasks = items.filter(i => i.owner === "Mike" && !i.done);
  const completedTasks = items.filter(i => i.done);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading checklist...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Launch Checklist</h1>
            <p className="text-sm text-gray-500">United Studio Collective</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchStatus}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Back to site
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{doneCount} of {totalCount} complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-2xl font-bold text-gray-900 mt-3">{progress}%</p>
          {lastFetch && (
            <p className="text-center text-xs text-gray-400 mt-2">
              Last updated: {status?.lastUpdated} &bull; Fetched: {lastFetch.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Evan's Tasks */}
        {evanTasks.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">E</span>
              Evan&apos;s Tasks
              <span className="text-sm font-normal text-gray-500">({evanTasks.length} remaining)</span>
            </h2>
            <div className="space-y-3">
              {evanTasks.map(item => (
                <div
                  key={item.id}
                  className={`bg-white rounded-lg shadow-sm p-4 flex items-start gap-4 ${item.blocked ? "opacity-60" : ""}`}
                >
                  <button
                    onClick={() => !item.blocked && toggleItem(item.id)}
                    disabled={item.blocked || updating === item.id}
                    className="mt-0.5 flex-shrink-0 disabled:cursor-not-allowed"
                  >
                    {updating === item.id ? (
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    ) : item.done ? (
                      <Check className="w-6 h-6 text-green-500" />
                    ) : item.blocked ? (
                      <Circle className="w-6 h-6 text-orange-300" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 hover:text-green-500 cursor-pointer" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-gray-900">{item.task}</h3>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono">#{item.id}</span>
                      {item.blocked && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                          Blocked by #{item.blockedBy}
                        </span>
                      )}
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Mike's Tasks */}
        {mikeTasks.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold">M</span>
              Mike&apos;s Tasks
              <span className="text-sm font-normal text-gray-500">({mikeTasks.length} remaining)</span>
            </h2>
            <div className="space-y-3">
              {mikeTasks.map(item => (
                <div
                  key={item.id}
                  className={`bg-white rounded-lg shadow-sm p-4 flex items-start gap-4 ${item.blocked ? "opacity-60" : ""}`}
                >
                  <button
                    onClick={() => !item.blocked && toggleItem(item.id)}
                    disabled={item.blocked || updating === item.id}
                    className="mt-0.5 flex-shrink-0 disabled:cursor-not-allowed"
                  >
                    {updating === item.id ? (
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    ) : item.done ? (
                      <Check className="w-6 h-6 text-green-500" />
                    ) : item.blocked ? (
                      <Circle className="w-6 h-6 text-orange-300" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 hover:text-green-500 cursor-pointer" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-gray-900">{item.task}</h3>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono">#{item.id}</span>
                      {item.blocked && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                          Blocked by #{item.blockedBy}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Completed Tasks */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Check className="w-6 h-6 text-green-500" />
            Completed
            <span className="text-sm font-normal text-gray-500">({completedTasks.length} tasks)</span>
          </h2>
          <div className="space-y-2">
            {completedTasks.map(item => (
              <div
                key={item.id}
                className="bg-gray-100 rounded-lg p-3 flex items-center gap-3"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  disabled={updating === item.id}
                  className="flex-shrink-0"
                >
                  {updating === item.id ? (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5 text-green-500 hover:text-orange-500 cursor-pointer" />
                  )}
                </button>
                <span className="text-gray-600 line-through">{item.task}</span>
                <span className="text-xs text-gray-400 ml-auto">{item.owner}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Instructions Section */}
        <section className="mt-12 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Setup Instructions</h2>

          {/* Step 1: Domain Transfer */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
              Transfer Domain to Cloudflare
            </h3>
            <ol className="text-sm text-blue-800 space-y-2 ml-9 list-decimal">
              <li>Go to <a href="https://dash.cloudflare.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">dash.cloudflare.com</a></li>
              <li>Click &quot;Add a Site&quot; and enter <strong>unitedstudiocollective.com</strong></li>
              <li>Select the Free plan</li>
              <li>Cloudflare will give you 2 nameservers (e.g., ada.ns.cloudflare.com)</li>
              <li>Go to your current domain registrar (Wix, GoDaddy, etc.)</li>
              <li>Update the nameservers to the Cloudflare ones</li>
              <li>Wait up to 24 hours for propagation (usually faster)</li>
            </ol>
          </div>

          {/* Step 2: DNS Records */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
              Add DNS Records in Cloudflare
            </h3>
            <p className="text-sm text-green-800 mb-4 ml-9">Once the domain is on Cloudflare, add these DNS records:</p>
            <div className="bg-white rounded border border-green-200 overflow-hidden ml-9">
              <table className="w-full text-sm">
                <thead className="bg-green-100">
                  <tr>
                    <th className="text-left px-4 py-2 text-green-900">Type</th>
                    <th className="text-left px-4 py-2 text-green-900">Name</th>
                    <th className="text-left px-4 py-2 text-green-900">Content</th>
                    <th className="text-left px-4 py-2 text-green-900">Proxy</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  <tr className="border-t border-green-100">
                    <td className="px-4 py-2">A</td>
                    <td className="px-4 py-2">@</td>
                    <td className="px-4 py-2">185.199.108.153</td>
                    <td className="px-4 py-2 text-gray-500">DNS only</td>
                  </tr>
                  <tr className="border-t border-green-100">
                    <td className="px-4 py-2">A</td>
                    <td className="px-4 py-2">@</td>
                    <td className="px-4 py-2">185.199.109.153</td>
                    <td className="px-4 py-2 text-gray-500">DNS only</td>
                  </tr>
                  <tr className="border-t border-green-100">
                    <td className="px-4 py-2">A</td>
                    <td className="px-4 py-2">@</td>
                    <td className="px-4 py-2">185.199.110.153</td>
                    <td className="px-4 py-2 text-gray-500">DNS only</td>
                  </tr>
                  <tr className="border-t border-green-100">
                    <td className="px-4 py-2">A</td>
                    <td className="px-4 py-2">@</td>
                    <td className="px-4 py-2">185.199.111.153</td>
                    <td className="px-4 py-2 text-gray-500">DNS only</td>
                  </tr>
                  <tr className="border-t border-green-100">
                    <td className="px-4 py-2">CNAME</td>
                    <td className="px-4 py-2">www</td>
                    <td className="px-4 py-2">banddude.github.io</td>
                    <td className="px-4 py-2 text-gray-500">DNS only</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-green-700 mt-3 ml-9">
              Note: Turn OFF the orange cloud (Proxy) for all records. Set to &quot;DNS only&quot; (gray cloud).
            </p>
          </div>

          {/* Step 3: GitHub Pages */}
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
              Configure GitHub Pages
            </h3>
            <ol className="text-sm text-purple-800 space-y-2 ml-9 list-decimal">
              <li>Go to <a href="https://github.com/banddude/united-studio-collective/settings/pages" target="_blank" rel="noopener noreferrer" className="underline font-medium">GitHub repo Settings → Pages</a></li>
              <li>Under &quot;Custom domain&quot;, enter <strong>unitedstudiocollective.com</strong></li>
              <li>Click Save</li>
              <li>Wait for DNS check to pass (may take a few minutes)</li>
              <li>Check &quot;Enforce HTTPS&quot; once available</li>
            </ol>
          </div>

          {/* Step 4: Stripe */}
          <div className="bg-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm">4</span>
              Set Up Stripe Payments
            </h3>
            <ol className="text-sm text-orange-800 space-y-2 ml-9 list-decimal">
              <li>Create account at <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener noreferrer" className="underline font-medium">stripe.com</a></li>
              <li>Go to <a href="https://dashboard.stripe.com/payment-links" target="_blank" rel="noopener noreferrer" className="underline font-medium">Products → Payment Links</a></li>
              <li>For each print, create 3 payment links:
                <ul className="list-disc ml-5 mt-1">
                  <li>Frameless ($85)</li>
                  <li>Framed Black ($85)</li>
                  <li>Framed White ($85)</li>
                </ul>
              </li>
              <li>Edit <a href="https://github.com/banddude/united-studio-collective/edit/main/public/config/store.json" target="_blank" rel="noopener noreferrer" className="underline font-medium">public/config/store.json</a></li>
              <li>Set <code className="bg-orange-100 px-1 rounded">&quot;stripeEnabled&quot;: true</code></li>
              <li>Add payment link URLs for each product</li>
            </ol>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-6 text-center text-sm text-gray-500">
        This page is only visible to you. Remove before final launch.
      </footer>
    </div>
  );
}
