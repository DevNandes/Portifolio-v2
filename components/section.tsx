"use client";

/**
 * Reusable section wrapper: optional eyebrow / title / subtitle header with a
 * scroll-into-view fade-in, then the section body. Used by every page section.
 */

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: {
  id: string;
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative py-24 px-6 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {(eyebrow || title) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            {eyebrow && (
              <div className="flex items-center gap-3 mb-3 font-mono text-xs text-cyan uppercase tracking-widest">
                <span className="h-px w-8 bg-gradient-to-r from-cyan to-transparent" />
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">
                {title}
              </h2>
            )}
            {subtitle && <p className="text-muted text-base sm:text-lg max-w-2xl">{subtitle}</p>}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}
