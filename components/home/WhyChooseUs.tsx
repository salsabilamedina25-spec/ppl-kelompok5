import SectionHeading from "@/components/ui/SectionHeading";
import { whyChooseUs } from "@/lib/landingData";

export default function WhyChooseUs() {
  return (
    <section id="tentang" className="bg-white pb-16 pt-16 sm:pb-20 sm:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Mengapa Memilih AS. TOUR TRAVEL?"
          subtitle="Kami menyiapkan setiap detail perjalanan agar Anda bisa fokus menikmati momen bersama orang tersayang."
        />

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 transition hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-lg hover:shadow-ocean-700/5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ocean-600 text-white shadow-md shadow-ocean-600/25">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
