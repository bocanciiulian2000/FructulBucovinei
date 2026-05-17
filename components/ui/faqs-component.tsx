'use client'

import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqItems = [
  {
    id: 'item-1',
    question: 'Cum pot comanda produse de la Fructul Bucovinei?',
    answer:
      'Ne poți contacta telefonic, pe email sau prin pagina de contact. Îți oferim detalii despre produsele disponibile, cantități și modul în care putem pregăti comanda.',
  },
  {
    id: 'item-2',
    question: 'Pot veni să vizitez livada?',
    answer:
      'Da, vizitele în livadă se organizează în funcție de sezon și disponibilitate. Cel mai bine este să ne scrii înainte, ca să stabilim împreună ziua și detaliile vizitei.',
  },
  {
    id: 'item-3',
    question: 'Cum funcționează programul Adoptă un pom?',
    answer:
      'Alegi un pom din livadă, iar noi îți spunem toate detaliile despre îngrijirea și roadele lui. În perioada recoltei poți veni să culegi fructele sau poți alege să le primești acasă.',
  },
  {
    id: 'item-4',
    question: 'Organizați activități pentru familii sau grupuri?',
    answer:
      'Da, organizăm experiențe în livadă pentru familii, copii, prieteni sau grupuri. În funcție de sezon, pot fi cules de mere, picnicuri, ateliere sau activități educative.',
  },
  {
    id: 'item-5',
    question: 'Pot primi fructele acasă?',
    answer:
      'Da, în funcție de comandă și disponibilitate, putem pregăti pachete cu fructe proaspete pentru livrare. Pentru detalii exacte, te rugăm să ne contactezi direct.',
  },
]

export default function FAQs() {
  return (
    <section className="bg-cream px-6 py-14 md:py-20 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div>
          <h2 className="font-serif text-5xl font-bold leading-[0.98] text-forest text-balance md:text-7xl lg:text-8xl">
            Întrebări{' '}
            <span className="text-burgundy">frecvente</span>
          </h2>
        </div>

        <div className="mt-10 md:mt-12">
          <Accordion
            type="single"
            collapsible
            className="w-full rounded-3xl bg-[#fbf7ee] px-5 py-2 shadow-sm ring-1 ring-forest/10 md:px-8 md:py-3"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-brown/25 last:border-b-0"
              >
                <AccordionTrigger className="cursor-pointer py-5 text-left font-serif text-2xl font-bold leading-none text-forest hover:no-underline md:text-3xl">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="pb-3 text-base leading-relaxed text-forest/75 md:text-lg">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="mt-6 text-base leading-relaxed text-forest/70 md:text-lg">
            Nu ai găsit răspunsul potrivit?{' '}
            <Link href="/contact" className="font-semibold text-burgundy hover:underline">
              Contactează-ne.
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
