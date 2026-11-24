"use client";

import { useState } from "react";
import Image from "next/image";
import { Compass } from "lucide-react";

interface SafeImageProps {
  src?: string | null;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

/**
 * Fills its (relatively positioned) parent. If the remote image fails to load,
 * a navy/ocean gradient placeholder is rendered instead of a broken image.
 */
export default function SafeImage({
  src,
  alt,
  sizes,
  className = "",
  priority = false,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy-800 via-ocean-700 to-ocean-500"
      >
        <Compass className="h-10 w-10 text-white/40" aria-hidden="true" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
