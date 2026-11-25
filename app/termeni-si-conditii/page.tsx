import type { Metadata } from 'next'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

const companyDetails = [
  'FRUCTUL BUCOVINEI SRL',
  'Adresă sediu social: Sat Rădășeni, Str. Părului 1, județul Suceava, cod 727460',
  'Înregistrată la Registrul Comerțului sub nr. J2018000165333',
  'CUI: 38785393',
  'E-mail: contact@fructulbucovinei.ro',
  'Telefon: +40 764 417 635',
]

const sections = [
  {
    title: '1. Introducere',
    content: [
      'Această pagină stabilește termenii și condițiile de utilizare a site-ului Fructul Bucovinei și de achiziționare a produselor oferite de FRUCTUL BUCOVINEI SRL. Prin accesarea și utilizarea site-ului, precum și prin plasarea unei comenzi, confirmi că ai citit, înțeles și ești de acord cu acești termeni.',
    ],
  },
  {
    title: '2. Operatorul magazinului online',
    content: companyDetails,
  },
  {
    title: '3. Utilizarea site-ului',
    content: [
      'Utilizatorul se angajează să folosească site-ul doar în scopuri legale, fără a afecta funcționarea acestuia sau drepturile altor persoane. Fructul Bucovinei își rezervă dreptul de a modifica structura, conținutul, produsele și funcționalitățile site-ului fără notificare prealabilă.',
    ],
  },
  {
    title: '4. Produse și prețuri',
    content: [
      'Produsele afișate pe site sunt prezentate cu imagini, descrieri și informații orientative. Prețurile sunt exprimate în lei (RON) și includ TVA, dacă legea aplicabilă prevede acest lucru. Ne rezervăm dreptul de a actualiza prețurile, stocurile, descrierile și ofertele fără notificare prealabilă.',
      'Prețul final al comenzii este cel afișat în pagina de finalizare a comenzii, înainte de trimiterea acesteia.',
    ],
  },
  {
    title: '5. Comenzi și plată',
    content: [
      'Pentru plasarea unei comenzi, clientul trebuie să completeze formularul de comandă cu date reale, corecte și complete. După trimiterea comenzii, clientul poate primi o confirmare automată pe e-mail sau poate fi contactat pentru confirmarea detaliilor.',
      'Momentan, plata comenzilor se face ramburs, la livrare.',
    ],
  },
  {
    title: '6. Livrare',
    content: [
      'Pachetele și componentele fizice incluse în programul „Adoptă un pom” se livrează prin FAN Courier, la adresa indicată de client, pe teritoriul României. Timpul estimat de livrare este comunicat în procesul de comandă și poate varia în funcție de sezon, condiții agricole, disponibilitatea recoltei, condiții logistice sau perioade aglomerate.',
      'Costul transportului este afișat în pagina de finalizare a comenzii înainte de trimiterea acesteia.',
    ],
  },
  {
    title: '7. Politica de retur',
    content: [
      'Pe site se comercializează pachete de adopție a unui pom pentru o perioadă de un an, care pot include componente personalizate și produse rezultate la recoltare. Dreptul de retragere se aplică în condițiile și cu excepțiile prevăzute de legislația în vigoare, în funcție de natura componentei și de modul de executare a contractului.',
      'Pentru produse personalizate, produse care se pot deteriora sau expira rapid și produse alimentare sigilate desigilate după livrare se aplică excepțiile legale de la dreptul de retragere. Aceste excepții nu afectează drepturile consumatorului în cazul produselor neconforme, deteriorate sau livrate greșit.',
      'Pentru solicitări privind retragerea, neconformitatea sau livrarea, contactează retur@fructulbucovinei.ro și menționează numărul comenzii.',
    ],
  },
  {
    title: '8. Garanții și conformitate',
    content: [
      'Produsele comercializate respectă standardele de calitate și siguranță alimentară prevăzute de legislația în vigoare. În cazul în care un produs prezintă neconformități, te rugăm să ne contactezi cât mai rapid pentru analizarea situației și pentru stabilirea unei soluții potrivite: înlocuire, remediere sau rambursare, după caz.',
    ],
  },
  {
    title: '9. Limitarea răspunderii',
    content: [
      'Fructul Bucovinei nu este responsabil pentru erori de afișare, disfuncționalități tehnice temporare ale site-ului sau pentru întârzieri cauzate de furnizori, transportatori, procesatori de plăți ori alte terțe părți.',
      'Depunem eforturi pentru ca informațiile publicate să fie corecte și actualizate, însă pot exista diferențe minore între imaginile de prezentare și produsul final, în special în cazul produselor agricole, sezoniere sau naturale.',
    ],
  },
  {
    title: '10. Drepturi de proprietate intelectuală',
    content: [
      'Textele, imaginile, logo-urile, grafica, elementele vizuale și conținutul publicat pe site aparțin FRUCTUL BUCOVINEI SRL sau partenerilor săi și nu pot fi copiate, distribuite, modificate sau utilizate în scop comercial fără acordul scris al proprietarului.',
    ],
  },
  {
    title: '11. Protecția datelor personale',
    content: [
      'Prelucrarea datelor personale se face conform Regulamentului (UE) 679/2016 și conform Politicii de confidențialitate disponibile pe site. Prin utilizarea site-ului și plasarea unei comenzi, confirmi că ai luat la cunoștință modul în care datele tale sunt prelucrate.',
    ],
  },
  {
    title: '12. Legea aplicabilă și jurisdicția',
    content: [
      'Acești termeni și condiții sunt guvernați de legislația română. Orice dispută apărută între Fructul Bucovinei și clienți se va soluționa cu prioritate pe cale amiabilă, iar în caz contrar litigiile vor fi înaintate instanțelor competente din România.',
    ],
  },
]

export const metadata: Metadata = {
  title: 'Termeni și condiții | Fructul Bucovinei',
  description: 'Termenii și condițiile de utilizare a site-ului și de achiziționare a produselor Fructul Bucovinei.',
}

export default function TermeniSiConditiiPage() {
  return (
    <main className="min-h-screen bg-cream text-forest">
      <Navbar />

      <section className="px-4 pb-14 pt-32 md:px-6 md:pb-20 md:pt-40 lg:px-12">
        <div className="container mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-wide text-brown">
            Document legal
          </p>
          <h1 className="mt-3 font-serif text-5xl font-bold leading-[0.95] tracking-tight text-forest md:text-7xl lg:text-8xl">
            Termeni și <span className="text-burgundy">condiții</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-forest/75 md:text-xl">
            Te rugăm să citești cu atenție informațiile de mai jos înainte de a
            utiliza site-ul sau de a plasa o comandă.
          </p>

          <div className="mt-12 space-y-6 md:mt-16">
            {sections.map((section) => (
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
        </div>
      </section>

      <Footer />
    </main>
  )
}
