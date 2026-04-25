import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ServicesBannerProps {
  /**
   * Visual variant. "light" sits on white pages; "dark" sits on dark sections.
   */
  variant?: "light" | "dark";
  /**
   * Optional override for the headline copy.
   */
  title?: string;
  /**
   * Optional override for the subhead copy.
   */
  description?: string;
}

/**
 * Sitewide nudge that quietly funnels visitors toward the Services page.
 * Drop this in near the bottom of any content page.
 */
export default function ServicesBanner({
  variant = "light",
  title = "Curious what we can do for you?",
  description = "See the full range of production services United Studio Collective offers.",
}: ServicesBannerProps) {
  const isDark = variant === "dark";
  return (
    <section
      className={
        isDark
          ? "bg-black text-white py-10 md:py-12 px-4 md:px-8 border-y border-white/10"
          : "bg-gray-50 text-black py-10 md:py-12 px-4 md:px-8 border-y border-gray-200"
      }
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 text-center md:text-left">
        <div>
          <h2
            className={
              "text-xl md:text-2xl font-light mb-1 " +
              (isDark ? "text-white" : "text-black")
            }
          >
            {title}
          </h2>
          <p className={isDark ? "text-gray-300" : "text-gray-600"}>
            {description}
          </p>
        </div>
        <Link
          href="/services"
          className={
            "inline-flex items-center gap-2 px-5 py-3 font-medium transition-colors flex-shrink-0 " +
            (isDark
              ? "bg-white text-black hover:bg-gray-100"
              : "bg-black text-white hover:bg-gray-800")
          }
        >
          View Services
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
