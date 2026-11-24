import Link from "next/link";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  variant?: "default" | "footer";
}

export default function BrandLogo({ className = "", variant = "default" }: BrandLogoProps) {
  const sizeClasses =
    variant === "footer"
      ? "h-12 w-36 sm:h-14 sm:w-44"
      : "h-10 w-32 sm:h-12 sm:w-36";

  return (
    <Link
      href="/"
      aria-label="AS.TOUR TRAVEL - Beranda"
      className={`group inline-flex items-center ${className}`}
    >
      <div className={`relative ${sizeClasses} transition-transform duration-200 group-hover:scale-105`}>
        <Image
          src="/logo.png"
          alt="AS.TOUR TRAVEL Logo"
          fill
          priority
          sizes="(max-width: 640px) 140px, 180px"
          className="object-contain object-left"
        />
      </div>
    </Link>
  );
}
