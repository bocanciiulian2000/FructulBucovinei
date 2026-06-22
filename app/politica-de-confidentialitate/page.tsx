import type { Metadata } from 'next'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

const companyDetails = [
  'FRUCTUL BUCOVINEI SRL',
  'Adresă sediu social: Sat Rădășeni, Str. Părului 1, județul Suceava, cod 727460',
  'Înregistrată la Registrul Comerțului sub nr. J2018000165333',
  'Cod unic de înregistrare: 38785393',
  'E-mail: contact@fructulbucovinei.ro',
  'Telefon: +40 764 417 635',
]

const privacySections = [
  {
    title: '1. Operatorul de date',
    content: [
      'Operatorul responsabil pentru prelucrarea datelor cu caracter personal este:',
      ...companyDetails,
    ],
  },
  {
    title: '2. Ce date colectăm',
    content: [
      'Colectăm doar datele necesare pentru funcționarea corectă a magazinului online, pentru procesarea comenzilor și pentru a-ți putea răspunde la solicitări.',
      'Prin formularele de contact putem colecta: nume, e-mail, telefon și mesaj.',
      'Prin formularul de comandă putem colecta: nume și prenume, adresă de livrare, telefon, e-mail, date de facturare și detalii despre produsele comandate.',
      'Pentru plățile online, anumite date sunt procesate direct de procesatorul de plăți, fără ca Fructul Bucovinei să stocheze datele cardului.',
      'Prin cookie-uri și instrumente de analiză putem colecta date tehnice precum adresa IP, comportamentul de navigare, preferințe și informații despre dispozitiv/browser.',
    ],
  },
  {
    title: '3. Scopurile prelucrării datelor',
    content: [
      'Datele tale sunt utilizate pentru procesarea comenzilor și livrarea produselor comandate.',
      'Folosim datele pentru emiterea documentelor fiscale, oferirea de suport prin e-mail sau telefon, comunicări comerciale doar cu acordul tău explicit și îmbunătățirea experienței de utilizare a site-ului.',
    ],
  },
  {
    title: '4. Temeiul legal al prelucrării',
    content: [
      'Prelucrarea datelor se bazează pe executarea unui contract în cazul comenzilor, consimțământul tău pentru newsletter sau formulare, interesul legitim al operatorului pentru securitatea site-ului și obligațiile legale privind evidențele fiscale și contabile.',
    ],
  },
  {
    title: '5. Durata de stocare a datelor',
    content: [
      'Datele aferente comenzilor sunt păstrate atât timp cât este necesar pentru procesarea comenzii și conform obligațiilor legale aplicabile.',
      'Datele din formularele de contact pot fi păstrate până la 6 luni de la finalizarea solicitării.',
      'Datele pentru newsletter sunt păstrate până la retragerea consimțământului.',
      'Datele de facturare sunt păstrate conform legislației fiscale aplicabile.',
    ],
  },
  {
    title: '6. Destinatarii datelor',
    content: [
      'Datele pot fi transmise, atunci când este necesar, către firme de curierat, procesatori de plăți, furnizori IT/hosting, furnizori de servicii contabile sau autorități publice, atunci când legea impune acest lucru.',
      'Partenerii care prelucrează date în numele nostru au obligația de a respecta cerințele Regulamentului (UE) 679/2016 privind protecția datelor.',
    ],
  },
  {
    title: '7. Securitatea datelor',
    content: [
      'Fructul Bucovinei utilizează măsuri tehnice și organizatorice adecvate pentru protejarea datelor împotriva pierderii, distrugerii, accesului neautorizat sau divulgării neintenționate.',
      'Informațiile transmise prin site sunt protejate prin conexiuni securizate, iar accesul la date este limitat la persoanele și furnizorii care au nevoie de acestea pentru îndeplinirea scopurilor menționate.',
    ],
  },
  {
    title: '8. Drepturile tale conform GDPR',
    content: [
      'Ai dreptul de acces la datele tale, dreptul la rectificare, ștergere, restricționarea prelucrării, portabilitatea datelor și dreptul de opoziție.',
      'Ai dreptul de a-ți retrage consimțământul atunci când prelucrarea se bazează pe consimțământ și dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal.',
      'Pentru exercitarea acestor drepturi, ne poți contacta la contact@fructulbucovinei.ro.',
    ],
  },
  {
    title: '9. Actualizări ale politicii',
    content: [
      'Ne rezervăm dreptul de a actualiza periodic această politică pentru a reflecta modificări legislative, tehnice sau operaționale. Versiunea actualizată va fi publicată pe site și va fi valabilă din momentul afișării.',
    ],
  },
]

const cookieSections = [
  {
    title: '1. Ce sunt cookie-urile',
    content: [
      'Cookie-urile sunt fișiere de mici dimensiuni stocate pe dispozitivul utilizatorului atunci când acesta accesează un website. Acestea permit funcționarea corectă a site-ului și pot ajuta la analizarea modului în care este utilizat website-ul.',
    ],
  },
  {
    title: '2. Ce tipuri de cookie-uri putem folosi',
    content: [
      'Website-ul poate utiliza cookie-uri strict necesare pentru funcționarea site-ului, cookie-uri de analiză, cookie-uri de funcționalitate și cookie-uri de marketing, dacă sunt implementate instrumente de promovare sau remarketing.',
    ],
  },
  {
    title: '3. Exemple de instrumente utilizate',
    content: [
      'Website-ul utilizează Google Analytics prin Google tag G-RYDSYCNL3F, doar după exprimarea consimțământului pentru cookie-uri de analiză. Nu activăm cookie-uri de marketing sau remarketing fără acord explicit.',
    ],
  },
  {
    title: '4. Consimțământul utilizatorului',
    content: [
      'Cookie-urile care nu sunt strict necesare vor fi utilizate doar după exprimarea consimțământului prin bannerul de cookie afișat la accesarea website-ului. Cookie-urile strict necesare pot fi folosite fără consimțământ prealabil, în măsura în care sunt necesare pentru funcționarea corectă a site-ului.',
    ],
  },
  {
    title: '5. Gestionarea cookie-urilor',
    content: [
      'Îți poți modifica sau retrage consimțământul privind cookie-urile în orice moment, utilizând butonul "Cookie-uri" afișat pe site sau setările browserului. Dezactivarea cookie-urilor de analiză nu afectează funcționarea magazinului.',
    ],
  },
  {
    title: '6. Contact',
    content: [
      'Pentru întrebări privind utilizarea cookie-urilor sau prelucrarea datelor personale, ne poți contacta la contact@fructulbucovinei.ro sau la +40 764 417 635.',
    ],
  },
]

export const metadata: Metadata = {
  title: 'Politica de confidențialitate | Fructul Bucovinei',
  description: 'Politica de confidențialitate, GDPR și cookie-uri pentru site-ul Fructul Bucovinei.',
}

export default function PoliticaDeConfidentialitatePage() {
  return (
    <main className="min-h-screen bg-cream text-forest">
      <Navbar />

      <section className="px-4 pb-14 pt-32 md:px-6 md:pb-20 md:pt-40 lg:px-12">
        <div className="container mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-wide text-brown">
            GDPR și cookie-uri
          </p>
          <h1 className="mt-3 font-serif text-5xl font-bold leading-[0.95] tracking-tight text-forest md:text-7xl lg:text-8xl">
            Politica de <span className="text-burgundy">confidențialitate</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-forest/75 md:text-xl">
            Această pagină explică modul în care Fructul Bucovinei prelucrează
            și protejează datele tale cu caracter personal atunci când utilizezi
            site-ul sau plasezi o comandă online.
          </p>

          <div className="mt-12 space-y-6 md:mt-16">
            {privacySections.map((section) => (
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
              Politica de <span className="text-burgundy">cookie-uri</span>
            </h2>

            <div className="mt-8 space-y-6">
              {cookieSections.map((section) => (
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
