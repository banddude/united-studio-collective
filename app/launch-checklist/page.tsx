"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Circle, ExternalLink, RefreshCw, Loader2, ChevronDown, ChevronUp } from "lucide-react";

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
  {
    id: "15",
    task: "Make logo bolder/bigger",
    description: "Evan will provide the actual font used on Wix so we can match it exactly",
    owner: "Both",
  },
  {
    id: "16",
    task: "Update copyright to 2026",
    description: "Change footer copyright year from 2024 to 2026",
    owner: "Mike",
  },
  {
    id: "17",
    task: "Video auto-play decision",
    description: "Decide if main filmmaking video should auto-play on page load",
    owner: "Evan",
  },
  {
    id: "18",
    task: "Fix video scroll arrow visibility",
    description: "The black arrow to scroll through videos is hard to see, make it more visible",
    owner: "Mike",
  },
  {
    id: "19",
    task: "Fix store frame options",
    description: "Remove 'natural and dark wood' options, only offer what Evan actually sells",
    owner: "Mike",
  },
];

export default function LaunchChecklist() {
  const [status, setStatus] = useState<ChecklistStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

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
          setError("Invalid token");
          setUpdating(null);
          return;
        }
        throw new Error(`Failed to get file: ${getRes.status}`);
      }

      const fileData = await getRes.json();
      const sha = fileData.sha;

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

      setStatus(newStatus);
    } catch (err) {
      console.error("Failed to update checklist:", err);
      setError("Failed to save");
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
  const bothTasks = items.filter(i => i.owner === "Both" && !i.done);
  const completedTasks = items.filter(i => i.done);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-900/50 via-transparent to-zinc-900/30 pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <header className="border-b border-white/5 backdrop-blur-sm bg-black/20">
          <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-1">Launch</p>
              <h1 className="text-2xl font-light tracking-tight">Checklist</h1>
              <p className="text-sm text-zinc-500 mt-1">United Studio Collective</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchStatus}
                className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              </button>
              <Link
                href="/meeting-prep"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Meeting Prep
              </Link>
              <Link
                href="/"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Site
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Progress */}
          <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-4xl font-light">{progress}%</p>
                <p className="text-sm text-zinc-500 mt-1">{doneCount} of {totalCount} complete</p>
              </div>
              {lastFetch && (
                <p className="text-xs text-zinc-600">
                  Updated {status?.lastUpdated}
                </p>
              )}
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Evan's Tasks */}
          {evanTasks.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-400 font-medium">E</span>
                </div>
                <div>
                  <h2 className="text-lg font-light">Evan</h2>
                  <p className="text-sm text-zinc-500">{evanTasks.length} remaining</p>
                </div>
              </div>
              <div className="space-y-2">
                {evanTasks.map(item => (
                  <div
                    key={item.id}
                    className={`bg-zinc-900/50 rounded-xl border border-white/5 p-4 flex items-center gap-4 transition-opacity ${item.blocked ? "opacity-40" : ""}`}
                  >
                    <button
                      onClick={() => !item.blocked && toggleItem(item.id)}
                      disabled={item.blocked || updating === item.id}
                      className="flex-shrink-0 disabled:cursor-not-allowed"
                    >
                      {updating === item.id ? (
                        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                      ) : (
                        <Circle className={`w-5 h-5 ${item.blocked ? "text-zinc-700" : "text-zinc-600 hover:text-emerald-400"} transition-colors`} />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white text-sm">{item.task}</p>
                        <span className="text-[10px] text-zinc-600 font-mono">#{item.id}</span>
                        {item.blocked && (
                          <span className="text-[10px] text-amber-500/60">blocked</span>
                        )}
                      </div>
                      <p className="text-zinc-500 text-xs mt-0.5 truncate">{item.description}</p>
                    </div>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-600 hover:text-white transition-colors flex-shrink-0"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Mike's Tasks */}
          {mikeTasks.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <span className="text-purple-400 font-medium">M</span>
                </div>
                <div>
                  <h2 className="text-lg font-light">Mike</h2>
                  <p className="text-sm text-zinc-500">{mikeTasks.length} remaining</p>
                </div>
              </div>
              <div className="space-y-2">
                {mikeTasks.map(item => (
                  <div
                    key={item.id}
                    className={`bg-zinc-900/50 rounded-xl border border-white/5 p-4 flex items-center gap-4 transition-opacity ${item.blocked ? "opacity-40" : ""}`}
                  >
                    <button
                      onClick={() => !item.blocked && toggleItem(item.id)}
                      disabled={item.blocked || updating === item.id}
                      className="flex-shrink-0 disabled:cursor-not-allowed"
                    >
                      {updating === item.id ? (
                        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                      ) : (
                        <Circle className={`w-5 h-5 ${item.blocked ? "text-zinc-700" : "text-zinc-600 hover:text-emerald-400"} transition-colors`} />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white text-sm">{item.task}</p>
                        <span className="text-[10px] text-zinc-600 font-mono">#{item.id}</span>
                        {item.blocked && (
                          <span className="text-[10px] text-amber-500/60">blocked</span>
                        )}
                      </div>
                      <p className="text-zinc-500 text-xs mt-0.5 truncate">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Both Tasks */}
          {bothTasks.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <span className="text-amber-400 font-medium text-xs">E+M</span>
                </div>
                <div>
                  <h2 className="text-lg font-light">Both</h2>
                  <p className="text-sm text-zinc-500">{bothTasks.length} remaining</p>
                </div>
              </div>
              <div className="space-y-2">
                {bothTasks.map(item => (
                  <div
                    key={item.id}
                    className="bg-zinc-900/50 rounded-xl border border-white/5 p-4 flex items-center gap-4"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      disabled={updating === item.id}
                      className="flex-shrink-0"
                    >
                      {updating === item.id ? (
                        <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                      ) : (
                        <Circle className="w-5 h-5 text-zinc-600 hover:text-emerald-400 transition-colors" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white text-sm">{item.task}</p>
                        <span className="text-[10px] text-zinc-600 font-mono">#{item.id}</span>
                      </div>
                      <p className="text-zinc-500 text-xs mt-0.5 truncate">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Completed */}
          {completedTasks.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-light">Completed</h2>
                  <p className="text-sm text-zinc-500">{completedTasks.length} tasks</p>
                </div>
              </div>
              <div className="space-y-1">
                {completedTasks.map(item => (
                  <div
                    key={item.id}
                    className="bg-zinc-900/30 rounded-lg p-3 flex items-center gap-3"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      disabled={updating === item.id}
                      className="flex-shrink-0"
                    >
                      {updating === item.id ? (
                        <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 text-emerald-500/50 hover:text-amber-400 transition-colors" />
                      )}
                    </button>
                    <span className="text-zinc-500 text-sm line-through">{item.task}</span>
                    <span className="text-[10px] text-zinc-700 ml-auto">{item.owner}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Instructions Toggle */}
          <section>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full bg-zinc-900/50 rounded-xl border border-white/5 p-4 flex items-center justify-between hover:bg-zinc-900/70 transition-colors"
            >
              <span className="text-sm text-zinc-400">Setup Instructions</span>
              {showInstructions ? (
                <ChevronUp className="w-4 h-4 text-zinc-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-500" />
              )}
            </button>

            {showInstructions && (
              <div className="mt-4 space-y-4">
                {/* Domain Transfer */}
                <div className="bg-zinc-900/50 rounded-xl border border-white/5 p-6">
                  <h3 className="text-xs uppercase tracking-[0.15em] text-blue-400/60 mb-4">1. Transfer Domain to Cloudflare</h3>
                  <ol className="text-sm text-zinc-400 space-y-2 list-decimal list-inside">
                    <li>Go to <a href="https://dash.cloudflare.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">dash.cloudflare.com</a></li>
                    <li>Click &quot;Add a Site&quot; and enter unitedstudiocollective.com</li>
                    <li>Select the Free plan</li>
                    <li>Copy the 2 nameservers Cloudflare gives you</li>
                    <li>Go to Wix and update nameservers</li>
                    <li>Wait for propagation (up to 24h)</li>
                  </ol>
                </div>

                {/* DNS Records */}
                <div className="bg-zinc-900/50 rounded-xl border border-white/5 p-6">
                  <h3 className="text-xs uppercase tracking-[0.15em] text-emerald-400/60 mb-4">2. Add DNS Records</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-zinc-500 text-xs uppercase tracking-wider">
                          <th className="text-left py-2">Type</th>
                          <th className="text-left py-2">Name</th>
                          <th className="text-left py-2">Content</th>
                        </tr>
                      </thead>
                      <tbody className="text-zinc-400 font-mono text-xs">
                        <tr className="border-t border-white/5"><td className="py-2">A</td><td>@</td><td>185.199.108.153</td></tr>
                        <tr className="border-t border-white/5"><td className="py-2">A</td><td>@</td><td>185.199.109.153</td></tr>
                        <tr className="border-t border-white/5"><td className="py-2">A</td><td>@</td><td>185.199.110.153</td></tr>
                        <tr className="border-t border-white/5"><td className="py-2">A</td><td>@</td><td>185.199.111.153</td></tr>
                        <tr className="border-t border-white/5"><td className="py-2">CNAME</td><td>www</td><td>banddude.github.io</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-zinc-600 mt-3">Turn OFF proxy (gray cloud) for all records</p>
                </div>

                {/* GitHub Pages */}
                <div className="bg-zinc-900/50 rounded-xl border border-white/5 p-6">
                  <h3 className="text-xs uppercase tracking-[0.15em] text-purple-400/60 mb-4">3. Configure GitHub Pages</h3>
                  <ol className="text-sm text-zinc-400 space-y-2 list-decimal list-inside">
                    <li>Go to <a href="https://github.com/banddude/united-studio-collective/settings/pages" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">repo Settings → Pages</a></li>
                    <li>Enter unitedstudiocollective.com under Custom domain</li>
                    <li>Click Save</li>
                    <li>Enable &quot;Enforce HTTPS&quot; once available</li>
                  </ol>
                </div>

                {/* Stripe */}
                <div className="bg-zinc-900/50 rounded-xl border border-white/5 p-6">
                  <h3 className="text-xs uppercase tracking-[0.15em] text-amber-400/60 mb-4">4. Set Up Stripe</h3>
                  <ol className="text-sm text-zinc-400 space-y-2 list-decimal list-inside">
                    <li>Create account at <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">stripe.com</a></li>
                    <li>Go to Products → Payment Links</li>
                    <li>Create links for each variant (Frameless $85, Black Frame $85, White Frame $85)</li>
                    <li>Edit <a href="https://github.com/banddude/united-studio-collective/edit/main/public/config/store.json" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">store.json</a></li>
                    <li>Set stripeEnabled: true and add URLs</li>
                  </ol>
                </div>
              </div>
            )}
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 text-center">
          <p className="text-xs text-zinc-600">Internal use only</p>
        </footer>
      </div>
    </div>
  );
}
