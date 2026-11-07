"use client";

import React, { useEffect, useRef, useState } from "react";

interface TaglineRevealProps {
  phrase?: string;
  subtext?: string;
}

export default function TaglineReveal({
  phrase = "Curated Indian real estate discovery with zero public prices, verified mandate records, and confidential advisory response.",
  subtext = "Engineered for discerning buyers, institutional investors, and premier developers who require factual architectural precision rather than portal noise.",
}: TaglineRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const words = phrase.split(" ");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setRevealedCount(words.length);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            words.forEach((_, index) => {
              setTimeout(() => {
                setRevealedCount((prev) => Math.max(prev, index + 1));
              }, index * 40);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [words.length]);

  return (
    <section ref={containerRef} className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="liquid-glass-elevated rounded-3xl p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
          {/* Subtle top specular sheen */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          
          <div className="inline-flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest text-[#CC785C] px-3.5 py-1 rounded-full liquid-glass-pill font-semibold border-[#CC785C]/30">
              Platform Mandate & Discretion
            </span>
          </div>

          <h2 className="font-claude-serif text-2xl sm:text-4xl md:text-5xl leading-[1.2] tracking-tight text-balance text-[#EDE8E1]">
            {words.map((word, index) => {
              const isRevealed = index < revealedCount;
              return (
                <span
                  key={index}
                  className={`inline-block mr-[0.25em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isRevealed ? "text-[#EDE8E1] opacity-100" : "text-[#706D67] opacity-25"
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </h2>

          <p className="font-claude-sans text-sm sm:text-base text-[#A39E96] max-w-2xl mx-auto leading-relaxed text-pretty">
            {subtext}
          </p>
        </div>
      </div>
    </section>
  );
}
