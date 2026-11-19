import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ASSETS } from "@/constants/assets";

export default function AssetsGalleryPage() {
  const allCharacters = Object.entries(ASSETS.characters).map(([key, val]) => ({
    id: key,
    ...val,
  }));

  const allHomeAssets = Object.entries(ASSETS.home).map(([key, val]) => ({
    id: key,
    ...val,
  }));

  const allLocationAssets = Object.entries(ASSETS.locations).map(([key, val]) => ({
    id: key,
    ...val,
  }));

  return (
    <div className="min-h-screen bg-background text-on-background p-6 md:p-12 space-y-12 max-w-7xl mx-auto">
      {/* Top Banner */}
      <header className="bg-secondary text-on-secondary neo-brutalist-border hard-shadow p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-block px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed neo-brutalist-border rounded-full font-label-bold text-xs uppercase mb-3 -rotate-2">
            Phase 2 Outcome Verification
          </div>
          <h1 className="font-display-lg text-display-lg leading-none tracking-tight">
            DOWNLOADED ASSETS GALLERY
          </h1>
          <p className="font-body-md mt-2 text-secondary-fixed">
            Đã tải về thành công 22/22 ảnh chất lượng cao cel anime thập niên 90 độc quyền từ Google Stitch vào thư mục <code>public/images/</code>.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/tokens"
            className="px-5 py-3 bg-white text-on-background neo-brutalist-border hard-shadow hard-shadow-hover hard-shadow-active font-label-bold uppercase text-xs"
          >
            ← Design Tokens
          </Link>
          <Link
            href="/"
            className="px-5 py-3 bg-tertiary-fixed text-on-tertiary-fixed neo-brutalist-border hard-shadow hard-shadow-hover hard-shadow-active font-label-bold uppercase text-xs"
          >
            Trang Chủ
          </Link>
        </div>
      </header>

      {/* 1. Kasukabe Squad & Nohara Family Characters */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="w-8 h-8 bg-primary text-on-primary neo-brutalist-border flex items-center justify-center font-label-bold">1</span>
          <h2 className="font-headline-md text-headline-md uppercase">
            Characters & Clan ({allCharacters.length} ảnh)
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {allCharacters.map((c) => (
            <div
              key={c.id}
              className="bg-white neo-brutalist-border hard-shadow flex flex-col overflow-hidden group hover:-translate-y-1 transition-transform"
            >
              <div className="w-full aspect-square relative border-b-[3px] border-on-background bg-surface-container overflow-hidden">
                <Image
                  src={c.src}
                  alt={c.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute top-3 left-3 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 neo-brutalist-border rounded-full font-label-bold text-xs uppercase">
                  {c.id}
                </span>
              </div>
              <div className="p-4 flex flex-col justify-between flex-grow space-y-2">
                <p className="font-caption text-xs text-on-surface-variant line-clamp-3">
                  {c.alt}
                </p>
                <div className="text-[11px] font-mono text-outline truncate bg-surface-container-low p-1.5 border border-outline">
                  {c.src}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Gallery Moments */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="w-8 h-8 bg-tertiary-fixed text-on-tertiary-fixed neo-brutalist-border flex items-center justify-center font-label-bold">2</span>
          <h2 className="font-headline-md text-headline-md uppercase">
            Epic Giggles Moments ({ASSETS.gallery.length} ảnh)
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ASSETS.gallery.map((m) => (
            <div
              key={m.id}
              className="bg-white neo-brutalist-border hard-shadow flex flex-col overflow-hidden group hover:-translate-y-1 transition-transform"
            >
              <div className="w-full aspect-video relative border-b-[3px] border-on-background bg-surface-container overflow-hidden">
                <Image
                  src={m.src}
                  alt={m.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute top-3 right-3 bg-secondary-container text-on-secondary-container px-3 py-1 neo-brutalist-border rounded-full font-label-bold text-xs uppercase">
                  {m.tag}
                </span>
              </div>
              <div className="p-4 flex flex-col justify-between flex-grow space-y-2">
                <h3 className="font-headline-sm text-base text-primary uppercase">{m.title}</h3>
                <p className="font-caption text-xs text-on-surface-variant line-clamp-3">
                  {m.alt}
                </p>
                <div className="text-[11px] font-mono text-outline truncate bg-surface-container-low p-1.5 border border-outline">
                  {m.src}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Home & Landmarks */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="w-8 h-8 bg-secondary-container text-on-secondary-container neo-brutalist-border flex items-center justify-center font-label-bold">3</span>
          <h2 className="font-headline-md text-headline-md uppercase">
            Landmarks & News ({allLocationAssets.length + allHomeAssets.length} ảnh)
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...allHomeAssets, ...allLocationAssets].map((l) => (
            <div
              key={l.id}
              className="bg-white neo-brutalist-border hard-shadow flex flex-col overflow-hidden group hover:-translate-y-1 transition-transform"
            >
              <div className="w-full aspect-video relative border-b-[3px] border-on-background bg-surface-container overflow-hidden">
                <Image
                  src={l.src}
                  alt={l.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute top-3 left-3 bg-surface-container-high text-on-surface px-3 py-1 neo-brutalist-border rounded-full font-label-bold text-xs uppercase">
                  {l.category}
                </span>
              </div>
              <div className="p-4 flex flex-col justify-between flex-grow space-y-2">
                <p className="font-caption text-xs text-on-surface-variant line-clamp-3">
                  {l.alt}
                </p>
                <div className="text-[11px] font-mono text-outline truncate bg-surface-container-low p-1.5 border border-outline">
                  {l.src}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

