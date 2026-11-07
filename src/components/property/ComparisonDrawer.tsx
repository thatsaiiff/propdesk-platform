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
      <div className="fixed bottom-3 inset-x-4 sm:inset-x-8 max-w-7xl mx-auto z-40 bg-[#181818]/95 backdrop-blur-xl border border-[#272727] shadow-2xl rounded-2xl p-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
        <div className="flex items-center justify-between pb-3 border-b border-[#272727]">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-400" />
            <span className="title-4 text-white">
              Property Comparison ({comparedProperties.length} selected)
            </span>
            <span className="caption-4 text-[#666666] hidden sm:inline">
              Compare floor space, amenities, and layout
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="py-1.5 px-3 bg-white text-black button-sm rounded-lg font-semibold shadow-sm active:scale-[0.98]"
            >
              View Side by Side Specs
            </button>
            <button
              onClick={onClear}
              className="p-1.5 text-[#666666] hover:text-white rounded-lg hover:bg-[#272727]"
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
                className="flex items-center gap-2.5 bg-[#1F1F1F] border border-[#272727] rounded-xl p-2 pr-3 shrink-0"
              >
                <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#272727]">
                  <Image src={cover} alt={p.title} fill className="object-cover" />
                </div>
                <div className="max-w-[180px]">
                  <div className="caption-3 font-bold text-white truncate">{p.title}</div>
                  <div className="caption-5 text-[#9B9B9B] truncate">
                    {p.city} • {(p.builtUpArea || p.plotArea)?.toLocaleString()} {p.areaUnit}
                  </div>
                </div>
                <button
                  onClick={() => onRemove(p.id)}
                  className="p-1 text-[#666666] hover:text-white rounded-full hover:bg-[#272727]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-[#181818] rounded-3xl shadow-2xl border border-[#272727] overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[#272727]">
              <h3 className="title-2 text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-400" />
                Side by Side Specification Comparison
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full text-[#666666] hover:text-white hover:bg-[#272727]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-left body-5">
                  <thead>
                    <tr className="border-b border-[#272727]">
                      <th className="py-3 px-4 caption-3 font-bold text-[#666666] uppercase w-48">Feature</th>
                      {comparedProperties.map((p) => (
                        <th key={p.id} className="py-3 px-4 title-4 font-bold text-white min-w-[220px]">
                          {p.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#272727]">
                    <tr>
                      <td className="py-3 px-4 caption-3 font-semibold text-[#9B9B9B]">Category</td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="py-3 px-4 caption-3 text-white">
                          {p.category.replace("_", " ")} ({p.subtype})
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 caption-3 font-semibold text-[#9B9B9B]">Location</td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="py-3 px-4 caption-3 text-white">
                          {p.locality}, {p.city}, {p.state}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 caption-3 font-semibold text-[#9B9B9B]">Area</td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="py-3 px-4 caption-3 text-white">
                          {(p.builtUpArea || p.plotArea)?.toLocaleString()} {p.areaUnit}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 caption-3 font-semibold text-[#9B9B9B]">Layout</td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="py-3 px-4 caption-3 text-white">
                          {p.bedrooms ? `${p.bedrooms} BHK (${p.bathrooms || 0} Baths)` : "Commercial / Industrial Plot"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 caption-3 font-semibold text-[#9B9B9B]">Pricing Policy</td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="py-3 px-4 caption-3 font-semibold text-blue-400">
                          Inquiry Led (Private Schedule)
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 caption-3 font-semibold text-[#9B9B9B]">Inquiry Action</td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="py-3 px-4">
                          <button
                            onClick={() => {
                              setActivePropertyForInquiry(p);
                              setModalOpen(false);
                            }}
                            className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-white text-black button-xsm rounded-lg font-bold shadow-sm"
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
