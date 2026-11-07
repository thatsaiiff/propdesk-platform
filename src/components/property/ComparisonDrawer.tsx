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
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl p-4 transition-all">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-brand-600" />
              <span className="font-bold text-sm text-slate-900">
                Property Comparison ({comparedProperties.length} selected)
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Compare floor space, amenities, and layout
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModalOpen(true)}
                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                View Side-by-Side Specs
              </button>
              <button
                onClick={onClear}
                className="p-1.5 text-slate-400 hover:text-slate-600 text-xs"
                title="Clear comparison"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 overflow-x-auto">
            {comparedProperties.map((p) => {
              const cover = p.media?.[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl p-2 pr-3 shrink-0"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <Image src={cover} alt={p.title} fill className="object-cover" />
                  </div>
                  <div className="text-xs max-w-[180px]">
                    <div className="font-bold text-slate-900 truncate">{p.title}</div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {p.city} • {(p.builtUpArea || p.plotArea)?.toLocaleString()} {p.areaUnit}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(p.id)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Side-by-Side Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-brand-600" />
                Side-by-Side Specification Comparison
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-3 px-4 font-bold text-slate-400 uppercase w-48">Feature</th>
                      {comparedProperties.map((p) => (
                        <th key={p.id} className="py-3 px-4 font-bold text-slate-900 min-w-[220px]">
                          {p.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-500">Category</td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="py-3 px-4 font-medium text-slate-800">
                          {p.category.replace("_", " ")} ({p.subtype})
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-500">Location</td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="py-3 px-4 text-slate-700">
                          {p.locality}, {p.city}, {p.state}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-500">Area</td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="py-3 px-4 text-slate-700">
                          {(p.builtUpArea || p.plotArea)?.toLocaleString()} {p.areaUnit}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-500">Layout</td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="py-3 px-4 text-slate-700">
                          {p.bedrooms ? `${p.bedrooms} BHK (${p.bathrooms || 0} Baths)` : "Commercial / Industrial Plot"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-500">Pricing Policy</td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="py-3 px-4 font-semibold text-brand-700">
                          Inquiry-Led (Private Schedule)
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-500">Inquiry Action</td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="py-3 px-4">
                          <button
                            onClick={() => {
                              setActivePropertyForInquiry(p);
                              setModalOpen(false);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-xs"
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
