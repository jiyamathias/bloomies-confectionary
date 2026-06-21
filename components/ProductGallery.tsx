'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  images: string[];
  alt: string;
  /** padding-bottom percentage controlling the aspect ratio of the main image */
  aspect?: string;
  rounded?: string;
}

export default function ProductGallery({ images, alt, aspect = '72%', rounded = 'rounded-2xl' }: Props) {
  const list = images.length ? images : ['/images/cake-vanilla.jpg'];
  const [active, setActive] = useState(0);
  const hasMultiple = list.length > 1;
  const safeActive = active < list.length ? active : 0;

  function prev(e?: React.MouseEvent) {
    e?.stopPropagation();
    setActive(a => (a - 1 + list.length) % list.length);
  }
  function next(e?: React.MouseEvent) {
    e?.stopPropagation();
    setActive(a => (a + 1) % list.length);
  }

  return (
    <div>
      <div className={`relative overflow-hidden bg-[#F3F0FA] ${rounded}`} style={{ paddingBottom: aspect }}>
        <Image src={list[safeActive]} alt={alt} fill
          sizes="(max-width:640px) 100vw, 560px"
          className="object-cover transition-opacity duration-300"/>

        {hasMultiple && (
          <>
            <button type="button" onClick={prev} aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
                bg-white/85 backdrop-blur-sm flex items-center justify-center text-[#433075]
                hover:bg-white transition-colors shadow-md">
              <ChevronLeft size={16}/>
            </button>
            <button type="button" onClick={next} aria-label="Next photo"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
                bg-white/85 backdrop-blur-sm flex items-center justify-center text-[#433075]
                hover:bg-white transition-colors shadow-md">
              <ChevronRight size={16}/>
            </button>
            <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5">
              {list.map((_, i) => (
                <span key={i}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    i === safeActive ? 'w-5 bg-white' : 'w-1.5 bg-white/55'}`}/>
              ))}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex gap-2 mt-2.5 overflow-x-auto pb-0.5">
          {list.map((src, i) => (
            <button type="button" key={src + i} onClick={(e) => { e.stopPropagation(); setActive(i); }}
              aria-label={`Show photo ${i + 1}`}
              className={`relative w-14 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all
                ${i === safeActive ? 'border-[#433075]' : 'border-transparent opacity-60 hover:opacity-100'}`}>
              <Image src={src} alt="" fill className="object-cover" sizes="56px"/>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
