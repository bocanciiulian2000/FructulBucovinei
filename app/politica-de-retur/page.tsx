import type { Metadata } from 'next'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

const operatorDetails = [
  'Operator: FRUCTUL BUCOVINEI SRL',
  'CUI: 38785393',
  'Reg. Comerțului: J2018000165333',
  'Adresă sediu social: Sat Rădășeni, Str. Părului 1, județul Suceava, cod 727460',
  'Contact: contact@fructulbucovinei.ro • +40 764 417 635',
  'Retururi: retur@fructulbucovinei.ro',
]

const deliverySections = [
  {
    title: '1. Metode de livrare',
    content: [
      'Pachetele și componentele fizice incluse în programul „Adoptă un pom” sunt livrate prin FAN Courier, la adresa indicată de client în formularul de comandă.',
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
      'La primire, te rugăm să verifici ambalajul. Dacă observi deteriorări vizibile, solicită curierului un proces-verbal de constatare și anunță-ne, de preferat în 24 de ore, cu fotografii ale coletului și produselor, la retur@fructulbucovinei.ro.',
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
    title: '7. Natura pachetelor de adopție',
    content: [
      'Pe site se comercializează pachete de adopție a unui pom pentru o perioadă de un an. Pachetul este o experiență/serviciu de adopție care poate include, în funcție de oferta aleasă, plăcuță personalizată, certificat digital, actualizări, poveste personalizată și produse rezultate la recoltare.',
      'Produsele fizice și beneficiile care fac parte din pachet sunt livrate ulterior, conform descrierii pachetului, sezonului agricol și condițiilor comunicate clientului.',
    ],
  },
  {
    title: '8. Dreptul de retragere',
    content: [
      'Consumatorii, persoane fizice, beneficiază, acolo unde legea nu prevede o excepție, de dreptul de retragere în termen de 14 zile calendaristice pentru contractele încheiate la distanță.',
      'Dacă clientul solicită în mod expres începerea serviciului de adopție înainte de expirarea termenului de 14 zile, acesta va confirma solicitarea și faptul că a luat cunoștință de efectele legale ale începerii executării serviciului, conform legislației aplicabile.',
      'Exercitarea dreptului de retragere nu afectează drepturile clientului în cazul produselor neconforme, deteriorate, livrate greșit sau lipsă din comandă.',
    ],
  },
  {
    title: '9. Anularea comenzii înainte de expediere',
    content: [
      'Clientul poate solicita anularea comenzii înainte ca pachetul să fie pregătit pentru livrare sau predat către FAN Courier, prin email la retur@fructulbucovinei.ro sau la +40 764 417 635. Solicitarea trebuie să includă numărul comenzii și datele folosite la plasarea acesteia.',
      'Vom confirma dacă anularea mai poate fi procesată, în funcție de stadiul comenzii, de începerea serviciului de adopție și de realizarea componentelor personalizate.',
      'Pentru comenzile achitate cu cardul și acceptate pentru anulare, rambursarea se face prin același mijloc de plată, conform termenelor legale aplicabile. Pentru comenzile cu plata la livrare, nu se percepe o sumă pentru o comandă anulată înainte de expediere.',
      'După predarea coletului către FAN Courier, solicitarea nu mai este tratată ca anulare administrativă, ci, dacă este cazul, potrivit regulilor privind dreptul de retragere și excepțiile aplicabile componentelor pachetului.',
    ],
  },
  {
    title: '10. Excepții aplicabile componentelor pachetului',
    content: [
      'Dreptul de retragere nu se aplică produselor realizate sau personalizate clar după solicitările clientului, precum plăcuțele, poveștile sau alte materiale personalizate incluse în pachet.',
      'Produsele de la recoltare care se pot deteriora sau expira rapid, precum merele proaspete, nu pot fi returnate în baza dreptului de retragere de 14 zile.',
      'Produsele alimentare sigilate care nu pot fi returnate din motive de protecție a sănătății sau igienă nu pot fi returnate după desigilare. Aceste excepții nu înlătură drepturile legale privind neconformitatea produselor.',
    ],
  },
  {
    title: '11. Cum soliciți retragerea sau o soluție pentru o comandă',
    content: [
      'Pentru o solicitare de retragere sau pentru sesizarea unei probleme privind comanda, contactează-ne la retur@fructulbucovinei.ro sau la +40 764 417 635, menționând numărul comenzii.',
      'Pentru componentele eligibile, produsele trebuie returnate complet și în siguranță, împreună cu accesoriile și materialele primite, dacă este cazul.',
      'Costul returului este suportat de consumator pentru retragerea eligibilă, cu excepția cazurilor de neconformitate sau livrare eronată.',
    ],
  },
  {
    title: '12. Rambursarea',
    content: [
      'Pentru retragerile eligibile, rambursăm sumele plătite în maximum 14 zile de la data la care primim notificarea, cu respectarea condițiilor legale aplicabile și a dreptului de a amâna rambursarea până la primirea produselor sau a dovezii de expediere, după caz.',
      'Rambursarea se face prin același mijloc de plată folosit la comandă, dacă nu agreăm altfel în scris.',
    ],
  },
  {
    title: '13. Produse neconforme sau deteriorate la primire',
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
