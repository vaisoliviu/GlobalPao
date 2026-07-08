// ============================================================
// i18n — Romanian (default) / English
// Elements opt in with data-i18n="key" (text) or data-i18n-html="key" (HTML).
// Placeholders use data-i18n-placeholder="key".
// ============================================================
(() => {
  const DICT = {
    ro: {
      "meta.title": "Global Pao — Terasamente, Demolări și Lucrări Rutiere",
      "meta.description": "Global Pao — antreprenor cu experiență în lucrări de terasamente: excavații, transport de pământ, demolări, amenajarea terenului și lucrări rutiere. Flotă proprie de utilaje grele.",

      "nav.services": "Servicii",
      "nav.fleet": "Utilaje",
      "nav.about": "Despre noi",
      "nav.play": "Joacă",
      "nav.quote": "Cere ofertă",

      "hero.kicker": "Terasamente · Demolări · Lucrări rutiere",
      "hero.title": "Noi mutăm pământul.<br /><span>Tu construiești pe el.</span>",
      "hero.sub": "Global Pao este un antreprenor cu experiență în lucrări grele. De la prima cupă de pământ până la ultimul strat de drum compactat — dacă se poate face cu un excavator, un buldozer, o basculantă sau un cilindru compactor, noi o facem.",
      "hero.cta1": "Cere o ofertă",
      "hero.cta2": "Serviciile noastre",

      "stats.years": "Ani de experiență",
      "stats.projects": "Proiecte finalizate",
      "stats.cubic": "Metri cubi mutați",
      "stats.ontime": "Lucrări predate la timp",

      "services.kicker": "Ce facem",
      "services.title": "Lucrări grele, făcute ca la carte",
      "services.sub": "Un singur partener pentru toată partea grea a proiectului tău — măsurat, executat și curățat, cu utilajele și operatorii noștri.",
      "services.exc.title": "Excavații și săpături",
      "services.exc.text": "Fundații, șanțuri, subsoluri, drenaje și canale pentru utilități — săpate la cotă, la adâncime și la termen.",
      "services.earth.title": "Terasamente și transport",
      "services.earth.text": "Transport de pământ în volume mari cu basculantele noastre: săpătură și umplutură, degajarea terenului, livrare de agregate și evacuare de pământ.",
      "services.demo.title": "Demolări",
      "services.demo.text": "Demolări controlate de clădiri și structuri de beton, inclusiv evacuarea molozului și curățenia șantierului.",
      "services.land.title": "Amenajarea terenului",
      "services.land.text": "Nivelări, pante și modelarea terenului — dăm pământului exact forma de care are nevoie proiectul tău.",
      "services.road.title": "Lucrări rutiere",
      "services.road.text": "Drumuri de acces, platforme și suport pentru asfaltare: pregătirea stratului de bază, compactare cu cilindri, lucrări de finisaj.",
      "services.other.title": "Altceva?",
      "services.other.text": "Dacă implică utilaje grele și mutat pământ, cel mai probabil am mai făcut-o. Spune-ne de ce ai nevoie.",
      "services.other.cta": "Întreabă-ne",

      "fleet.kicker": "Utilajele noastre",
      "fleet.title": "Flota",
      "fleet.sub": "Lucrăm cu utilajele noastre, bine întreținute — adică fără așteptări după închirieri de la terți și fără surprize în calendarul tău.",
      "fleet.exc.title": "Excavatoare",
      "fleet.exc.text": "Săpat, încărcat, spart și șanțuri de precizie — coloana vertebrală a oricărui șantier.",
      "fleet.dozer.title": "Buldozere",
      "fleet.dozer.text": "Împins, nivelat și egalizat volume mari de pământ, rapid și precis.",
      "fleet.truck.title": "Basculante",
      "fleet.truck.text": "Transport de pământ, moloz și agregate, în orice cantitate, în și din șantier.",
      "fleet.roller.title": "Cilindri compactori",
      "fleet.roller.text": "Compactarea straturilor de bază și de asfalt pentru drumuri și platforme durabile.",

      "about.kicker": "Cine suntem",
      "about.title": "Experiență pe care poți construi",
      "about.text": "Global Pao a petrecut ani buni pe șantiere de toate dimensiunile — de la fundații de case până la terasamente mari și proiecte rutiere. Știm că lucrările noastre sunt cele pe care stă tot restul, și exact așa le tratăm.",
      "about.li1": "<strong>Operatori cu experiență.</strong> Oameni pricepuți care își cunosc utilajele și citesc terenul.",
      "about.li2": "<strong>La timp, în buget.</strong> Oferte clare, termene realiste, fără costuri ascunse.",
      "about.li3": "<strong>Siguranța pe primul loc.</strong> Fiecare lucrare planificată și executată la standarde de siguranță.",
      "about.li4": "<strong>Pachet complet.</strong> Utilaje, transport, operatori și curățenie — un singur contract, un singur contact.",
      "about.reg": "Global Pao · Nr. de înregistrare <strong>RO26652709</strong>",
      "about.badge": "ANI PE ȘANTIER",

      "game.kicker": "Ia o pauză",
      "game.title": "Buldozerul Demolator",
      "game.sub": "Vedere de sus pe șantier! Ghidează buldozerul cu mouse-ul — merge singur spre cursor — sau cu săgețile <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd>, iar cu <kbd>Space</kbd> bagi turbo. Dărâmă zidurile, lăzile și pietrele — dar ferește-te de butoaiele toxice!",
      "game.start": "Pornește motorul",
      "game.restart": "Joacă din nou",
      "game.dig": "TURBO",
      "game.score": "Scor",
      "game.time": "Timp",
      "game.barrel": "Toxic!",
      "game.over": "Timpul a expirat!",
      "game.final": "Scor final:",
      "game.rank1": "Stofă de demolator-șef! Te așteptăm cu CV-ul.",
      "game.rank2": "Operator solid. Șantierul e al tău.",
      "game.rank3": "Mai împinge — exercițiul face maestrul.",
      "game.again": "Apasă „Joacă din nou” pentru încă o tură",
      "game.intro1": "Dărâmă lăzi (+20), pietre (+30) și ziduri (+50).",
      "game.intro2": "Butoaiele toxice te costă -40! Cu turbo lovești de două ori mai tare.",
      "game.intro3": "Apasă „Pornește motorul” — ai 60 de secunde pe ceas.",

      "contact.kicker": "Contact",
      "contact.title": "Hai să vorbim despre proiectul tău",
      "contact.text": "Trimite-ne câteva detalii despre teren și despre ce ai nevoie. Revenim cu o ofertă clară și corectă — de obicei într-o zi lucrătoare.",
      "contact.hours": "Lun – Sâm, 07:00 – 18:00",
      "contact.reg": "Nr. înreg. RO26652709",
      "contact.name": "Nume",
      "contact.name.ph": "Numele tău",
      "contact.reach": "Telefon sau email",
      "contact.reach.ph": "Cum te putem contacta?",
      "contact.msg": "De ce ai nevoie?",
      "contact.msg.ph": "ex. Săpătură de fundație pentru o casă, aprox. 200 m², în ...",
      "contact.send": "Trimite cererea",
      "contact.sending": "Se trimite…",
      "contact.success": "Mulțumim! Cererea ta a fost trimisă. Revenim în curând.",
      "contact.error": "Ceva nu a mers bine. Încearcă din nou sau sună-ne direct.",

      "footer.rights": "Nr. înreg. RO26652709 · Toate drepturile rezervate.",
      "footer.up": "Înapoi sus ↑",
    },

    en: {
      "meta.title": "Global Pao — Earthworks, Demolition & Road Works",
      "meta.description": "Global Pao — experienced earthworks contractor: excavation, earthmoving, demolition, landscape adjustments and road works. Full heavy machinery fleet.",

      "nav.services": "Services",
      "nav.fleet": "Fleet",
      "nav.about": "About",
      "nav.play": "Play",
      "nav.quote": "Get a quote",

      "hero.kicker": "Earthworks · Demolition · Road works",
      "hero.title": "We move the earth.<br /><span>You build on it.</span>",
      "hero.sub": "Global Pao is an experienced heavy-works contractor. From the first bucket of soil to the final layer of compacted road — if it can be done with an excavator, a bulldozer, a dump truck or a roller, we do it.",
      "hero.cta1": "Request a quote",
      "hero.cta2": "Our services",

      "stats.years": "Years of experience",
      "stats.projects": "Projects completed",
      "stats.cubic": "Cubic meters moved",
      "stats.ontime": "Jobs finished on time",

      "services.kicker": "What we do",
      "services.title": "Heavy work, done right",
      "services.sub": "One partner for the whole dirty part of your project — surveyed, executed and cleaned up, with our own machines and operators.",
      "services.exc.title": "Excavation & Digging",
      "services.exc.text": "Foundations, trenches, basements, drainage and utility channels — dug to spec, to depth, to schedule.",
      "services.earth.title": "Earthmoving & Hauling",
      "services.earth.text": "Bulk earth transport with our own dump trucks: cut & fill, site clearing, aggregate delivery and soil disposal.",
      "services.demo.title": "Demolition",
      "services.demo.text": "Controlled demolition of buildings and concrete structures, including debris removal and site cleanup.",
      "services.land.title": "Landscape Adjustments",
      "services.land.text": "Grading, leveling, slopes and terrain modelling — we shape the land exactly how your project needs it.",
      "services.road.title": "Road Works",
      "services.road.text": "Access roads, platforms and paving support: sub-base preparation, compaction with rollers, finishing works.",
      "services.other.title": "Something else?",
      "services.other.text": "If it involves heavy machinery and moving earth, chances are we've done it before. Tell us what you need.",
      "services.other.cta": "Ask us",

      "fleet.kicker": "Our machines",
      "fleet.title": "The fleet",
      "fleet.sub": "We work with our own, well-maintained machines — which means no waiting on third-party rentals and no surprises in your schedule.",
      "fleet.exc.title": "Excavators",
      "fleet.exc.text": "Digging, loading, breaking and precise trench work — the backbone of every site.",
      "fleet.dozer.title": "Bulldozers",
      "fleet.dozer.text": "Pushing, grading and leveling large volumes of earth quickly and accurately.",
      "fleet.truck.title": "Dump Trucks",
      "fleet.truck.text": "Hauling soil, rubble and aggregates on and off site, in any quantity.",
      "fleet.roller.title": "Rollers / Compactors",
      "fleet.roller.text": "Compacting sub-base and asphalt layers for durable roads and platforms.",

      "about.kicker": "Who we are",
      "about.title": "Experience you can build on",
      "about.text": "Global Pao has spent years on construction sites of every size — from small residential foundations to large earthmoving and road projects. We know that the works we do are the ones everything else stands on, and we treat them that way.",
      "about.li1": "<strong>Experienced operators.</strong> Skilled people who know their machines and read the terrain.",
      "about.li2": "<strong>On time, on budget.</strong> Clear quotes, realistic schedules, no hidden costs.",
      "about.li3": "<strong>Safety first.</strong> Every job planned and executed to safety standards.",
      "about.li4": "<strong>Full package.</strong> Machines, transport, operators and cleanup — one contract, one contact.",
      "about.reg": "Global Pao · Company registration no. <strong>RO26652709</strong>",
      "about.badge": "YEARS ON SITE",

      "game.kicker": "Take a break",
      "game.title": "The Demolition Dozer",
      "game.sub": "Top-down view of the site! Guide the dozer with the mouse — it drives toward your cursor — or with the <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> keys, and hit <kbd>Space</kbd> for turbo. Smash the walls, crates and rocks — but stay clear of the toxic barrels!",
      "game.start": "Start the engine",
      "game.restart": "Play again",
      "game.dig": "TURBO",
      "game.score": "Score",
      "game.time": "Time",
      "game.barrel": "Toxic!",
      "game.over": "Time's up!",
      "game.final": "Final score:",
      "game.rank1": "Demolition boss material! Apply within.",
      "game.rank2": "Solid operator. The site is yours.",
      "game.rank3": "Keep pushing — practice makes perfect.",
      "game.again": 'Press "Play again" for another round',
      "game.intro1": "Smash crates (+20), rocks (+30) and walls (+50).",
      "game.intro2": "Toxic barrels cost you -40! Turbo hits twice as hard.",
      "game.intro3": 'Press "Start the engine" — 60 seconds on the clock.',

      "contact.kicker": "Get in touch",
      "contact.title": "Let's talk about your project",
      "contact.text": "Send us a few details about your site and what you need done. We'll come back with a clear, honest quote — usually within one working day.",
      "contact.hours": "Mon – Sat, 07:00 – 18:00",
      "contact.reg": "Reg. no. RO26652709",
      "contact.name": "Name",
      "contact.name.ph": "Your name",
      "contact.reach": "Phone or email",
      "contact.reach.ph": "How can we reach you?",
      "contact.msg": "What do you need?",
      "contact.msg.ph": "e.g. Foundation excavation for a house, approx. 200 m², in ...",
      "contact.send": "Send request",
      "contact.sending": "Sending…",
      "contact.success": "Thank you! Your request was sent. We'll get back to you soon.",
      "contact.error": "Something went wrong. Please try again or call us directly.",

      "footer.rights": "Reg. no. RO26652709 · All rights reserved.",
      "footer.up": "Back to top ↑",
    },
  };

  let current = localStorage.getItem("gp-lang") || "ro";
  if (!DICT[current]) current = "ro";
  const listeners = [];

  function t(key) {
    return DICT[current][key] ?? DICT.ro[key] ?? key;
  }

  function apply() {
    document.documentElement.lang = current;
    document.title = t("meta.title");
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("meta.description"));

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(el.dataset.i18nHtml);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll(".lang__btn").forEach((btn) => {
      btn.classList.toggle("lang__btn--active", btn.dataset.lang === current);
    });
    listeners.forEach((fn) => fn(current));
  }

  function setLang(lang) {
    if (!DICT[lang] || lang === current) return;
    current = lang;
    localStorage.setItem("gp-lang", lang);
    apply();
  }

  window.GP_I18N = {
    t,
    setLang,
    get lang() { return current; },
    onChange: (fn) => listeners.push(fn),
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".lang__btn").forEach((btn) =>
      btn.addEventListener("click", () => setLang(btn.dataset.lang))
    );
    apply();
  });
})();
