import SafeImage from "@/components/ui/SafeImage";
import SectionHeading from "@/components/ui/SectionHeading";

export interface GalleryPhoto {
  src: string;
  alt: string;
  caption?: string;
}

interface GalleryProps {
  photos: GalleryPhoto[];
}

export default function Gallery({ photos }: GalleryProps) {
  if (photos.length === 0) return null;

  const [featured, ...rest] = photos;
  const small = rest.slice(0, 4);

  return (
    <section id="galeri" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Galeri Dokumentasi Wisata"
          subtitle="Potret layanan dan destinasi dari berbagai perjalanan bersama kami."
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <figure className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 lg:aspect-auto lg:min-h-[480px]">
            <SafeImage
              src={featured.src}
              alt={featured.alt}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="transition-transform duration-500 group-hover:scale-105"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent"
            />
            {featured.caption && (
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-sm font-semibold text-white sm:p-6 sm:text-base">
                {featured.caption}
              </figcaption>
            )}
          </figure>

          {small.length > 0 && (
            <ul className="grid grid-cols-2 gap-4">
              {small.map((photo) => (
                <li
                  key={photo.src}
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100"
                >
                  <SafeImage
                    src={photo.src}
                    alt={photo.alt}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
