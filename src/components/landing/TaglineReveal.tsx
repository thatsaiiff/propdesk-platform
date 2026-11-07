"use client";

import React, { useEffect, useRef, useState } from "react";

interface TaglineRevealProps {
  phrase?: string;
  subtext?: string;
}

export default function TaglineReveal({
  phrase = "Curated Indian real estate discovery with zero public prices, certified mandate verification, and direct advisory response.",
  subtext = "Built for buyers, investors, and builders who demand confidentiality and verified title facts instead of portal spam.",
}: TaglineRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const words = phrase.split(" ");

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setRevealedCount(words.length);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger word-by-word reveal staggered smoothly on the base curve
            words.forEach((_, index) => {
              setTimeout(() => {
                setRevealedCount((prev) => Math.max(prev, index + 1));
              }, index * 45); // 45ms step
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [words.length]);

  return (
    <section ref={containerRef} className="py-24 px-4 sm:px-6 lg:px-8 border-y border-[#1F1F1F] bg-[#131209]">
      <div className="max-w-[680px] mx-auto text-center space-y-6">
        <span className="caption-3 uppercase tracking-wider text-[#9B9B9B] px-3 py-1 rounded-full border border-[#272727] bg-[#181818] inline-block">
          Core Operating Standard
        </span>

        <h2 className="heading-3 sm:heading-2 leading-tight tracking-tight text-balance">
          {words.map((word, index) => {
            const isRevealed = index < revealedCount;
            return (
              <span
                key={index}
                className={`inline-block mr-[0.28em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isRevealed ? "text-white opacity-100" : "text-[#9B9B9B] opacity-25"
                }`}
              >
                {word}
              </span>
            );
          })}
        </h2>

        <p className="body-4 sm:body-2 text-[#9B9B9B] max-w-[560px] mx-auto text-pretty">
          {subtext}
        </p>
      </div>
    </section>
  );
}
