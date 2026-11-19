"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { NeoBadge } from "@/components/ui/NeoBadge";
import { ASSETS } from "@/constants/assets";
import { soundFx } from "@/lib/audio";

const FILTERS = [
  { id: "all", label: "All Chaos" },
  { id: "giggles", label: "Giggles" },
  { id: "trouble", label: "Trouble" },
  { id: "action-mask", label: "Action Mask" },
];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedMoment, setSelectedMoment] = useState<(typeof ASSETS.gallery)[number] | null>(
    null
  );

  const filteredMoments = ASSETS.gallery.filter((m) => {
    if (activeFilter === "all") return true;
    return m.category === activeFilter;
  });

  const handleFilterClick = (id: string) => {
    soundFx.playClickPop();
    setActiveFilter(id);
  };

  const handleOpenModal = (moment: (typeof ASSETS.gallery)[number]) => {
    soundFx.playSparkleChime();
    setSelectedMoment(moment);
  };

  const handleCloseModal = () => {
    soundFx.playClickPop();
    setSelectedMoment(null);
  };

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-secondary-container selection:text-on-secondary-container flex flex-col justify-between">
      <TopNavBar />

      <main className="px-margin-mobile md:px-margin-desktop py-12 max-w-7xl mx-auto w-full flex-grow space-y-12">
        {/* Header & Filter Controls */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b-[3px] border-on-background/20">
          <div className="max-w-2xl space-y-3">
            <NeoBadge variant="tertiary" rotate={-2} className="px-3.5 py-1 text-xs">
              Iconic Anime Cels
            </NeoBadge>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg uppercase italic text-on-background drop-shadow-[2px_2px_0px_#b7000c] leading-none">
              Moments Gallery
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              A vibrant collection of the silliest, cheekiest, and most iconic moments from the
              Kasukabe Defense Group. Explore the chaos!
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-3">
            {FILTERS.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => handleFilterClick(f.id)}
                  className={`px-5 py-2.5 rounded-full neo-brutalist-border font-label-bold text-xs uppercase cursor-pointer select-none transition-all ${
                    isActive
                      ? "bg-secondary-container text-on-secondary-container hard-shadow -translate-x-[2px] -translate-y-[2px]"
                      : "bg-surface text-on-surface hover:bg-tertiary-fixed hover:-translate-y-0.5"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* Masonry Moments Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredMoments.map((moment) => (
            <div
              key={moment.id}
              onClick={() => handleOpenModal(moment)}
              className="break-inside-avoid bg-surface neo-brutalist-border hard-shadow hover:-translate-y-1.5 hover:shadow-[8px_8px_0px_0px_#1e1b18] transition-all cursor-pointer overflow-hidden group select-none"
            >
              <div className="relative aspect-[4/3] w-full border-b-[3px] border-on-background overflow-hidden bg-surface-container">
                <Image
                  src={moment.src}
                  alt={moment.alt}
                  fill
                  unoptimized={moment.src.endsWith(".gif")}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span className="absolute top-3 left-3 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 neo-brutalist-border rounded-full font-label-bold text-[11px] uppercase select-none">
                  {moment.tag}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-headline-sm text-lg uppercase text-on-background group-hover:text-primary transition-colors">
                  {moment.title}
                </h3>
                <p className="font-caption text-xs text-on-surface-variant line-clamp-3">
                  {moment.alt}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedMoment && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <div
              className="bg-surface neo-brutalist-border hard-shadow max-w-2xl w-full p-6 sm:p-8 space-y-6 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start">
                <div>
                  <NeoBadge variant="tertiary" rotate={-2} className="mb-2">
                    {selectedMoment.tag}
                  </NeoBadge>
                  <h3 className="font-headline-md text-2xl uppercase text-primary">
                    {selectedMoment.title}
                  </h3>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-10 h-10 bg-white neo-brutalist-border hard-shadow flex items-center justify-center font-label-bold text-lg cursor-pointer hover:bg-error hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="relative aspect-video w-full neo-brutalist-border overflow-hidden bg-black flex items-center justify-center">
                <Image
                  src={selectedMoment.src}
                  alt={selectedMoment.alt}
                  fill
                  unoptimized={selectedMoment.src.endsWith(".gif")}
                  className={selectedMoment.src.endsWith(".gif") ? "object-contain" : "object-cover"}
                />
              </div>

              <p className="font-body-md text-sm text-on-surface-variant">
                {selectedMoment.alt}
              </p>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 bg-on-background text-white neo-brutalist-border hard-shadow hover:-translate-y-0.5 font-label-bold text-xs uppercase cursor-pointer"
                >
                  Đóng (Close)
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
