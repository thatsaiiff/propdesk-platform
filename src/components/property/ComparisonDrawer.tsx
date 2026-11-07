"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PublicPropertyDTO } from "@/types";
import { X, Scale, Send } from "lucide-react";
import InquiryModal from "../inquiry/InquiryModal";

interface ComparisonDrawerProps {
  comparedProperties: PublicPropertyDTO[];
  onRemove: (propertyId: string) => void;
  onClear: () => void;
}

export default function ComparisonDrawer({
  comparedProperties,
  onRemove,
  onClear,
}: ComparisonDrawerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activePropertyForInquiry, setActivePropertyForInquiry] = useState<PublicPropertyDTO | undefined>();

  if (comparedProperties.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-3 inset-x-4 sm:inset-x-8 max-w-7xl mx-auto z-40 liquid-glass-elevated rounded-2xl p-4 transition-all duration-500 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#CC785C]" />
            <span className="text-xs sm:text-sm font-semibold text-[#EDE8E1]">
              Property Comparison ({comparedProperties.length} selected)
            </span>
            <span className="text-xs text-[#706D67] hidden sm:inline font-claude-sans">
              Compare floor space, amenities, and layout
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="py-1.5 px-3 liquid-glass-btn-accent text-white text-xs font-semibold rounded-lg shadow-sm active:scale-[0.98]"
            >
              View Side-by-Side Specs
            </button>
            <button
              onClick={onClear}
              className="p-1.5 text-[#706D67] hover:text-[#EDE8E1] rounded-lg hover:bg-white/[0.05]"
              title="Clear comparison"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-3 overflow-x-auto scrollbar-none">
          {comparedProperties.map((p) => {
            const cover = p.media?.[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";
            return (
              <div
                key={p.id}
                className="flex items-center gap-2.5 liquid-glass rounded-xl p-2 pr-3 shrink-0"
              >
                <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#121215]">
                  <Image src={cover} alt={p.title} fill className="object-cover" />
                </div>
                <div className="max-w-[180px]">
                  <div className="text-xs font-bold text-[#EDE8E1] truncate">{p.title}</div>
                  <div className="text-[10px] text-[#A39E96] truncate">
                    {p.city} • {(p.builtUpArea || p.plotArea)?.toLocaleString()} {p.areaUnit}
                  </div>
                </div>
                <button
                  onClick={() => onRemove(p.id)}
                  className="p-1 text-[#706D67] hover:text-[#EDE8E1] rounded-full hover:bg-white/[0.05]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side by Side Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl liquid-glass-elevated rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
              <h3 className="font-claude-serif text-xl font-semibold text-[#EDE8E1] flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#CC785C]" />
                Side-by-Side Specification Comparison
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full text-[#706D67] hover:text-[#EDE8E1] hover:bg-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      <th className="py-3 px-4 text-[10px] font-bold text-[#706D67] uppercase w-48">Feature</th>
                      {comparedProperties.map((p) => (
                        <th key={p.id} className="py-3 px-4 font-claude-serif text-base font-bold text-[#EDE8E1] min-w-[220px]">
                          {p.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    <tr>
                      <td className="py-3 px-4 text-xs font-semibold text-[#A39E96]">Category</td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="py-3 px-4 text-xs text-[#EDE8E1]">
                          {p.category.replace("_", " ")} ({p.subtype})
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-xs font-semibold text-[#A39E96]">Location</td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="py-3 px-4 text-xs text-[#EDE8E1]">
                          {p.locality}, {p.city}, {p.state}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-xs font-semibold text-[#A39E96]">Area</td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="py-3 px-4 text-xs text-[#EDE8E1]">
                          {(p.builtUpArea || p.plotArea)?.toLocaleString()} {p.areaUnit}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-xs font-semibold text-[#A39E96]">Layout</td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="py-3 px-4 text-xs text-[#EDE8E1]">
                          {p.bedrooms ? `${p.bedrooms} BHK (${p.bathrooms || 0} Baths)` : "Commercial / Industrial Plot"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-xs font-semibold text-[#A39E96]">Pricing Policy</td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="py-3 px-4 text-xs font-semibold text-[#CC785C]">
                          Inquiry-Led (Private Schedule)
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-xs font-semibold text-[#A39E96]">Inquiry Action</td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="py-3 px-4">
                          <button
                            onClick={() => {
                              setActivePropertyForInquiry(p);
                              setModalOpen(false);
                            }}
                            className="inline-flex items-center gap-1.5 py-1.5 px-3 liquid-glass-btn-accent text-white text-xs font-semibold rounded-lg shadow-sm"
                          >
                            <Send className="w-3 h-3" /> Get Price
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activePropertyForInquiry && (
        <InquiryModal
          isOpen={!!activePropertyForInquiry}
          onClose={() => setActivePropertyForInquiry(undefined)}
          property={activePropertyForInquiry}
        />
      )}
    </>
  );
}
