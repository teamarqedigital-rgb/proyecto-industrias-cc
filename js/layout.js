/* ==========================================================
   layout.js: inyecta header y footer en todas las páginas.
   Para cambiar menú, teléfono o datos de contacto, edita SOLO aquí.
   ========================================================== */

const NEGOCIO = {
  whatsapp: "573214720350",
  telefono: "321 472 0350",
  email: "industriascc1@gmail.com",
  direccion: "Tundama, casa 243, piso 1",
  instagram: "@Industrias CC",
  instagramUrl: ""            // pega aquí el enlace de tu perfil para activarlo
};
const WHATSAPP = `https://wa.me/${NEGOCIO.whatsapp}`;

const PAGES = [
  { href: "index.html",        label: "Inicio" },
  { href: "catalogo.html",     label: "Productos" },
  { href: "nosotros.html",     label: "Nosotros" },
  { href: "galeria.html",      label: "Galería" },
  { href: "como-comprar.html", label: "Cómo comprar" },
  { href: "faq.html",          label: "Preguntas frecuentes" },
  { href: "contacto.html",     label: "Contacto" }
];

const current = decodeURIComponent(location.pathname.split("/").pop() || "index.html");

const headerHTML = `
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  <header class="site-header">
    <div class="container header__inner">
      <a class="brand" href="index.html" aria-label="Industrias CC, inicio">
        <img src="assets/img/logo.png" alt="" width="64" height="64">
        <span class="brand__text">
          <strong>INDUSTRIAS CC</strong>
          <small>Buzos | Chaquetas | Estampados</small>
        </span>
      </a>

      <button class="nav-toggle" aria-expanded="false" aria-controls="menu" aria-label="Abrir menú">
        <span></span><span></span><span></span>
      </button>

      <nav class="nav" id="menu" aria-label="Principal">
        <ul class="nav__list">
          ${PAGES.map((p) => `
            <li><a class="nav__link ${p.href === current ? "is-active" : ""}"
                   href="${p.href}" ${p.href === current ? 'aria-current="page"' : ""}>${p.label}</a></li>
          `).join("")}
        </ul>
      </nav>

      <a class="btn btn--primary btn--sm" href="${WHATSAPP}" target="_blank" rel="noopener">Cotizar por WhatsApp</a>
    </div>
  </header>`;

const insta = NEGOCIO.instagramUrl
  ? `<a href="${NEGOCIO.instagramUrl}" target="_blank" rel="noopener">${NEGOCIO.instagram}</a>`
  : NEGOCIO.instagram;

const footerHTML = `
  <footer class="site-footer">
    <div class="container footer__grid">
      <div>
        <p class="footer__brand">INDUSTRIAS CC</p>
        <p class="footer__slogan">Calidad que se viste, <span class="accent">estilo que te identifica.</span></p>
      </div>
      <ul class="footer__contact">
        <li><a href="${WHATSAPP}" target="_blank" rel="noopener">${NEGOCIO.telefono}</a></li>
        <li><a href="mailto:${NEGOCIO.email}">${NEGOCIO.email}</a></li>
        <li>${NEGOCIO.direccion}</li>
        <li>${insta}</li>
      </ul>
    </div>
    <div class="container footer__bottom">
      <p>© ${new Date().getFullYear()} Industrias CC. Todos los derechos reservados.</p>
      <p>Creado por <a class="footer__creator" href="https://arqe-digital.vercel.app/" target="_blank" rel="noopener noreferrer">Arqé Digital by Joa</a></p>
    </div>
  </footer>`;

const whatsappFloatHTML = `
  <a class="whatsapp-float" href="${WHATSAPP}?text=${encodeURIComponent("Hola, quiero información sobre sus productos.")}"
     target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp">
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16.04 2.67a13.25 13.25 0 0 0-11.3 20.16l-1.4 5.1 5.22-1.37a13.26 13.26 0 1 0 7.48-23.89Zm0 24.14a10.87 10.87 0 0 1-5.55-1.52l-.4-.24-3.1.81.83-3.02-.26-.42a10.88 10.88 0 1 1 8.48 4.39Zm5.97-8.15c-.33-.17-1.95-.96-2.25-1.07-.3-.11-.52-.17-.74.17-.22.33-.85 1.07-1.04 1.29-.19.22-.39.25-.72.08-.33-.17-1.4-.52-2.66-1.65-.98-.87-1.64-1.95-1.83-2.28-.19-.33-.02-.51.15-.68.15-.15.33-.39.5-.58.17-.19.22-.33.33-.55.11-.22.06-.41-.03-.58-.08-.17-.74-1.79-1.02-2.45-.27-.65-.54-.56-.74-.57h-.63c-.22 0-.58.08-.88.41-.3.33-1.15 1.13-1.15 2.75s1.18 3.19 1.35 3.41c.17.22 2.32 3.54 5.62 4.96.79.34 1.41.54 1.89.69.79.25 1.51.21 2.08.13.63-.09 1.95-.8 2.23-1.57.27-.77.27-1.43.19-1.57-.08-.14-.3-.22-.63-.39Z"/>
    </svg>
    <span>¿Hablamos?</span>
  </a>`;

const h = document.getElementById("site-header");
const f = document.getElementById("site-footer");
if (h) h.innerHTML = headerHTML;
if (f) f.innerHTML = footerHTML;
document.body.insertAdjacentHTML("beforeend", whatsappFloatHTML);
