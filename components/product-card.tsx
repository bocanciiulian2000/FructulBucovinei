import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { AdoptPackage } from '@/lib/adopt-packages'

export function ProductCard({ pkg, index }: { pkg: AdoptPackage; index: number }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-forest/10 bg-[#fbf7ee] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-cream">
        <Image
          src={pkg.image}
          alt={pkg.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brown/80">
              Pachet {index + 1}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold leading-none text-forest">
              {pkg.name}
            </h2>
          </div>

          <p className="shrink-0 font-serif text-2xl font-bold leading-none text-burgundy">
            {pkg.price}
          </p>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-forest/70">
          {pkg.description}
        </p>

        <div className="mt-auto border-t border-forest/10 pt-5">
          <Link
            href={`/adopta-un-pom/${pkg.slug}`}
            className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-sm border border-forest/25 px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-forest transition-all duration-300 hover:gap-3 hover:border-burgundy hover:bg-burgundy hover:text-cream"
          >
            <span>Vezi produsul</span>
            <ArrowRight size={15} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  )
}
