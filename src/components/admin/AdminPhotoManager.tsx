"use client";

import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Trash2, Plus, ArrowUp, ArrowDown, Sparkles } from "lucide-react";

export interface PropertyImageItem {
  id: string;
  url: string;
  label?: string;
  sortOrder: number;
}

interface AdminPhotoManagerProps {
  images: PropertyImageItem[];
  onChange: (images: PropertyImageItem[]) => void;
}

export default function AdminPhotoManager({ images, onChange }: AdminPhotoManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);

  // File Upload Handler (multiple files to Base64 Data URL)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingFiles(true);
    const fileList = Array.from(files);
    let completed = 0;
    const newItems: PropertyImageItem[] = [];

    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          const cleanName = file.name.replace(/\.[^/.]+$/, "");
          newItems.push({
            id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            url: result,
            label: cleanName || "Property View",
            sortOrder: images.length + newItems.length + 1,
          });
        }
        completed++;
        if (completed === fileList.length) {
          onChange([...images, ...newItems]);
          setIsProcessingFiles(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };
      reader.onerror = () => {
        completed++;
        if (completed === fileList.length) {
          onChange([...images, ...newItems]);
          setIsProcessingFiles(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add by Direct Web URL
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const newItem: PropertyImageItem = {
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      url: urlInput.trim(),
      label: labelInput.trim() || "Exterior View",
      sortOrder: images.length + 1,
    };

    onChange([...images, newItem]);
    setUrlInput("");
    setLabelInput("");
  };

  // Remove Photo
  const handleRemove = (id: string) => {
    const updated = images
      .filter((img) => img.id !== id)
      .map((img, idx) => ({ ...img, sortOrder: idx + 1 }));
    onChange(updated);
  };

  // Move Photo Up / Down (Change Cover)
  const handleMove = (index: number, direction: "UP" | "DOWN") => {
    const targetIdx = direction === "UP" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    const reordered = updated.map((img, idx) => ({ ...img, sortOrder: idx + 1 }));
    onChange(reordered);
  };

  // Update Photo Caption / Label
  const handleUpdateLabel = (id: string, nextLabel: string) => {
    onChange(
      images.map((img) => (img.id === id ? { ...img, label: nextLabel } : img))
    );
  };

  // Sample Curated Photos
  const handleAddSamplePhotos = () => {
    const samples: PropertyImageItem[] = [
      {
        id: `sample-1-${Date.now()}`,
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
        label: "Front Facade & Architecture",
        sortOrder: images.length + 1,
      },
      {
        id: `sample-2-${Date.now()}`,
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
        label: "Grand Living Lounge",
        sortOrder: images.length + 2,
      },
      {
        id: `sample-3-${Date.now()}`,
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
        label: "Master Suite & View",
        sortOrder: images.length + 3,
      },
    ];
    onChange([...images, ...samples]);
  };

  return (
    <div className="space-y-4 pt-2 border-t border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-[11px] uppercase font-bold text-amber-300 tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Property Photographs & Media ({images.length})</span>
          </label>
          <p className="text-[11px] text-slate-400 mt-0.5">
            First photo serves as the primary discovery deck cover.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddSamplePhotos}
          className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 font-semibold"
        >
          <Sparkles className="w-3 h-3" />
          <span>Load Curated Samples</span>
        </button>
      </div>

      {/* Upload Zone & URL Adder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Device File Upload */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-4 rounded-2xl liquid-glass border border-dashed border-amber-400/30 hover:border-amber-400/60 bg-amber-500/[0.03] hover:bg-amber-500/[0.08] transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-1.5"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              {isProcessingFiles ? "Processing Images..." : "Upload from Device"}
            </span>
            <span className="text-[10px] text-slate-400">Select multiple JPG, PNG, WEBP</span>
          </div>
        </div>

        {/* Add by Web URL */}
        <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Or Add Image by URL</span>
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image URL (https://...)"
            className="w-full p-2 rounded-lg liquid-glass-input text-xs text-white focus:outline-none"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              placeholder="Caption (e.g. Master Bedroom)"
              className="flex-1 p-2 rounded-lg liquid-glass-input text-xs text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              disabled={!urlInput.trim()}
              className="px-3 py-2 rounded-lg liquid-glass-btn-royal text-xs font-bold text-white disabled:opacity-40 shrink-0"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Photo Gallery Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-h-[360px] overflow-y-auto pr-1">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="group relative liquid-glass rounded-xl overflow-hidden border border-white/15 bg-slate-900/40 p-1.5 space-y-1.5"
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.label || `Photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badge for Cover or Index */}
                <div className="absolute top-1.5 left-1.5">
                  {idx === 0 ? (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-md">
                      Cover Photo
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-bold backdrop-blur-sm">
                      #{idx + 1}
                    </span>
                  )}
                </div>

                {/* Top Right Actions */}
                <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMove(idx, "UP")}
                      title="Move earlier (Make cover)"
                      className="p-1 rounded bg-black/70 hover:bg-black text-white hover:text-amber-400 transition-all"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                  )}
                  {idx < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleMove(idx, "DOWN")}
                      title="Move later"
                      className="p-1 rounded bg-black/70 hover:bg-black text-white hover:text-amber-400 transition-all"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(img.id)}
                    title="Delete photo"
                    className="p-1 rounded bg-red-600/80 hover:bg-red-600 text-white transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Caption editor */}
              <input
                type="text"
                value={img.label || ""}
                onChange={(e) => handleUpdateLabel(img.id, e.target.value)}
                placeholder="Caption label..."
                className="w-full px-2 py-1 text-[11px] rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400/50"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 rounded-2xl liquid-glass border border-white/10 text-center space-y-1">
          <ImageIcon className="w-6 h-6 text-slate-500 mx-auto" />
          <p className="text-xs text-slate-400 font-medium">No photos attached to this listing yet.</p>
          <p className="text-[10px] text-slate-500">Upload photos from device or paste image URLs above.</p>
        </div>
      )}
    </div>
  );
}
