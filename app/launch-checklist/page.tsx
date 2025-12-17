"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Circle, ExternalLink, RefreshCw } from "lucide-react";

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

const checklistItems: ChecklistItem[] = [
  // COMPLETED
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
  // PENDING - EVAN
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
  // PENDING - MIKE (after domain)
  {
    id: "13",
    task: "Update base URL in code",
    description: "Change from GitHub Pages URL to unitedstudiocollective.com",
    owner: "Mike",
    blockedBy: "9",
  },
  // OPTIONAL
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

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${basePath}/config/checklist.json?t=${Date.now()}`);
      const data = await res.json();
      setStatus(data);
      setLastFetch(new Date());
    } catch (err) {
      console.error("Failed to fetch checklist status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

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

        {/* How to Update */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <h3 className="font-medium text-yellow-800 mb-2">How to mark items complete:</h3>
          <p className="text-sm text-yellow-700">
            Edit <code className="bg-yellow-100 px-1 rounded">public/config/checklist.json</code> in the repo.
            Change <code className="bg-yellow-100 px-1 rounded">&quot;done&quot;: false</code> to{" "}
            <code className="bg-yellow-100 px-1 rounded">&quot;done&quot;: true</code> for completed items, then commit and push.
          </p>
          <a
            href="https://github.com/banddude/united-studio-collective/edit/main/public/config/checklist.json"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-sm text-yellow-800 hover:text-yellow-900 underline"
          >
            Edit on GitHub <ExternalLink className="w-3 h-3" />
          </a>
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
                  <div className="mt-0.5 flex-shrink-0">
                    {item.done ? (
                      <Check className="w-6 h-6 text-green-500" />
                    ) : item.blocked ? (
                      <Circle className="w-6 h-6 text-orange-300" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
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
                  <div className="mt-0.5 flex-shrink-0">
                    {item.done ? (
                      <Check className="w-6 h-6 text-green-500" />
                    ) : item.blocked ? (
                      <Circle className="w-6 h-6 text-orange-300" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
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
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 line-through">{item.task}</span>
                <span className="text-xs text-gray-400 ml-auto">{item.owner}</span>
              </div>
            ))}
          </div>
        </section>

        {/* DNS Instructions */}
        <section className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">DNS Setup Instructions</h2>
          <p className="text-sm text-blue-800 mb-4">Add these records in Cloudflare DNS:</p>
          <div className="bg-white rounded border border-blue-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="text-left px-4 py-2 text-blue-900">Type</th>
                  <th className="text-left px-4 py-2 text-blue-900">Name</th>
                  <th className="text-left px-4 py-2 text-blue-900">Content</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                <tr className="border-t border-blue-100">
                  <td className="px-4 py-2">A</td>
                  <td className="px-4 py-2">@</td>
                  <td className="px-4 py-2">185.199.108.153</td>
                </tr>
                <tr className="border-t border-blue-100">
                  <td className="px-4 py-2">A</td>
                  <td className="px-4 py-2">@</td>
                  <td className="px-4 py-2">185.199.109.153</td>
                </tr>
                <tr className="border-t border-blue-100">
                  <td className="px-4 py-2">A</td>
                  <td className="px-4 py-2">@</td>
                  <td className="px-4 py-2">185.199.110.153</td>
                </tr>
                <tr className="border-t border-blue-100">
                  <td className="px-4 py-2">A</td>
                  <td className="px-4 py-2">@</td>
                  <td className="px-4 py-2">185.199.111.153</td>
                </tr>
                <tr className="border-t border-blue-100">
                  <td className="px-4 py-2">CNAME</td>
                  <td className="px-4 py-2">www</td>
                  <td className="px-4 py-2">banddude.github.io</td>
                </tr>
              </tbody>
            </table>
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
