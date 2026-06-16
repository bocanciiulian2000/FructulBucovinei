import type { Metadata } from 'next'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

const operatorDetails = [
  'Operator: FRUCTUL BUCOVINEI SRL',
  'CUI: 38785393',
  'Reg. Comerțului: J2018000165333',
  'Adresă sediu social: Sat Rădășeni, Str. Părului 1, județul Suceava, cod 727460',
  'Contact: contact@fructulbucovinei.ro • +40 767 208 881',
]

const deliverySections = [
  {
    title: '1. Metode de livrare',
    content: [
      'Livrarea comenzilor se face prin curier, la adresa indicată de client în formularul de comandă. În funcție de disponibilitate și zonă, curierul folosit poate fi Cargus sau un alt partener de livrare comunicat înainte de expediere.',
    ],
  },
  {
    title: '2. Aria de livrare',
    content: [
      'Livrăm pe teritoriul României, în localitățile acoperite de partenerii noștri de curierat.',
    ],
  },
  {
    title: '3. Termene de livrare',
    content: [
      'Tranzitul standard este de până la 3 zile lucrătoare, maximum 72 de ore, din momentul preluării coletului de către curier.',
      'Vei primi număr de urmărire, dacă acesta este disponibil, imediat ce coletul este preluat de curier.',
      'În perioade aglomerate, precum sărbători, campanii promoționale sau condiții meteo severe, pot apărea întârzieri independente de voința noastră.',
    ],
  },
  {
    title: '4. Costuri de transport',
    content: [
      'Transportul este inclus în pachetele pentru care acest lucru este menționat explicit pe site. Pentru produsele individuale sau pentru comenzile care depășesc limitele standard de colet, costul transportului este afișat în pagina de finalizare a comenzii înainte de trimiterea acesteia.',
      'Pentru colete standard, tariful de transport poate fi calculat în funcție de greutate, volum, numărul coletelor și zona de livrare.',
      'Dacă o comandă trebuie împărțită în mai multe colete din motive de siguranță sau pentru respectarea limitelor de greutate ale curierului, fiecare colet suplimentar poate genera un cost de transport separat, comunicat înainte de finalizarea comenzii.',
      'Din motive de siguranță, produsele sunt ambalate astfel încât să fie protejate la transport, chiar dacă acest lucru poate influența greutatea finală a coletului.',
    ],
  },
  {
    title: '5. Ambalare și recepție',
    content: [
      'Merele proaspete sunt ambalate în cutii sau lădițe rezistente, potrivite pentru protecția produselor la șocuri.',
      'Sucurile și produsele fragile beneficiază de protecție suplimentară, precum separatoare, carton ondulat sau alte materiale de ambalare.',
      'La primire, te rugăm să verifici ambalajul. Dacă observi deteriorări vizibile, solicită curierului un proces-verbal de constatare și anunță-ne, de preferat în 24 de ore, cu fotografii ale coletului și produselor, la contact@fructulbucovinei.ro.',
    ],
  },
  {
    title: '6. Livrare eșuată sau adresă greșită',
    content: [
      'Dacă adresa, numărul de telefon sau datele de contact sunt incorecte ori destinatarul este indisponibil, coletul poate fi reprogramat sau returnat. În aceste situații, vom reveni cu opțiunile disponibile și, dacă este cazul, cu eventualele costuri de reexpediere.',
    ],
  },
]

const returnSections = [
  {
    title: '7. Dreptul de retragere',
    content: [
      'Consumatorii, persoane fizice, pot renunța la cumpărare în termen de 14 zile calendaristice de la primirea produselor, fără a invoca un motiv, cu respectarea condițiilor și excepțiilor prevăzute de legislația aplicabilă.',
    ],
  },
  {
    title: '8. Excepții importante pentru produse perisabile și sigilate',
    content: [
      'Produsele care se pot deteriora sau expira rapid, precum merele proaspete, nu pot fi returnate în baza dreptului de retragere de 14 zile.',
      'Produsele sigilate din motive de protecție a sănătății sau igienă, precum sucurile, nu pot fi returnate dacă au fost desigilate după livrare.',
      'Sucurile nedesigilate se pot returna în termen de 14 zile, conform procedurii de retur de mai jos.',
      'Aceste reguli se aplică și livrărilor aferente programului „Adoptă un pom”.',
    ],
  },
  {
    title: '9. Cum faci un retur pentru produsele eligibile',
    content: [
      'Notifică-ne în termen de 14 zile de la primirea produselor, la contact@fructulbucovinei.ro sau la +40 767 208 881.',
      'Ambalează produsele complet și în siguranță, ideal în ambalajul original, pentru a evita deteriorarea la transport.',
      'Expediază returul către FRUCTUL BUCOVINEI SRL, Sat Rădășeni, Str. Părului 1, județul Suceava, cod 727460.',
      'Costul returului este suportat de consumator, cu excepția cazurilor de neconformitate sau livrare eronată.',
      'Te rugăm să păstrezi dovada de expediere până la finalizarea returului.',
    ],
  },
  {
    title: '10. Condiții pentru returul sucurilor nedesigilate',
    content: [
      'Produsul trebuie să fie nedesigilat, neutilizat, cu eticheta intactă și fără urme de uzură.',
      'Produsul trebuie returnat împreună cu toate accesoriile, bonusurile sau materialele primite, dacă acestea au fost incluse în comandă.',
    ],
  },
  {
    title: '11. Rambursarea banilor',
    content: [
      'Rambursăm sumele plătite pentru produsele eligibile returnate în maximum 14 zile de la primirea produselor returnate sau de la primirea dovezii de expediere, după caz.',
      'Rambursarea se face prin același mijloc de plată folosit la comandă, dacă nu agreăm altfel în scris.',
    ],
  },
  {
    title: '12. Produse neconforme sau deteriorate la primire',
    content: [
      'Dacă primești produse neconforme, deteriorate sau lipsă din comandă, anunță-ne de preferat în 24 de ore de la livrare, cu fotografii clare ale produselor și ambalajului.',
      'În funcție de situație, poți opta pentru înlocuire, completarea produselor lipsă sau rambursare. În aceste cazuri, costurile de transport sunt suportate de Fructul Bucovinei.',
    ],
  },
]

export const metadata: Metadata = {
  title: 'Livrare și retur | Fructul Bucovinei',
  description: 'Informații despre livrarea comenzilor, dreptul de retur și produsele eligibile pentru returnare la Fructul Bucovinei.',
}

export default function PoliticaDeReturPage() {
  return (
    <main className="min-h-screen bg-cream text-forest">
      <Navbar />

      <section className="px-4 pb-14 pt-32 md:px-6 md:pb-20 md:pt-40 lg:px-12">
        <div className="container mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-wide text-brown">
            Comenzi, curier și retur
          </p>
          <h1 className="mt-3 font-serif text-5xl font-bold leading-[0.95] tracking-tight text-forest md:text-7xl lg:text-8xl">
            Livrare <span className="text-burgundy">și retur</span>
          </h1>
          <div className="mt-6 max-w-3xl space-y-1 text-base leading-relaxed text-forest/75 md:text-lg">
            {operatorDetails.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
          </div>

          <div className="mt-12 space-y-6 md:mt-16">
            {deliverySections.map((section) => (
              <article
                key={section.title}
                className="rounded-3xl bg-[#fbf7ee] p-5 shadow-sm ring-1 ring-forest/10 md:p-7"
              >
                <h2 className="font-serif text-3xl font-bold leading-none tracking-tight text-brown md:text-4xl">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3 text-base leading-relaxed text-forest/80 md:text-lg">
                  {section.content.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 border-t border-forest/15 pt-12 md:mt-20">
            <h2 className="font-serif text-4xl font-bold leading-[0.98] tracking-tight text-forest md:text-6xl">
              Retur și dreptul de <span className="text-burgundy">retragere</span>
            </h2>

            <div className="mt-8 space-y-6">
              {returnSections.map((section) => (
                <article
                  key={section.title}
                  className="rounded-3xl bg-[#fbf7ee] p-5 shadow-sm ring-1 ring-forest/10 md:p-7"
                >
                  <h3 className="font-serif text-3xl font-bold leading-none tracking-tight text-brown md:text-4xl">
                    {section.title}
                  </h3>
                  <div className="mt-4 space-y-3 text-base leading-relaxed text-forest/80 md:text-lg">
                    {section.content.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
