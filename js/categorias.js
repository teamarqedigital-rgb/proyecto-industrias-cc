
const grid = document.getElementById("categorias-grid");

/* ---------- Íconos (el campo "icono" de Firestore elige uno) ---------- */
const ICONOS = {
  shirt:     '<path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/>',
  gift:      '<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>',
  calendar:  '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  dice:      '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1"/><circle cx="16" cy="8" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/>'
};

/* ---------- Rutas de imágenes ---------- */
const IMG_BASE = "assets/img/";
const IMG_LOGO = IMG_BASE + "logo.png";

// Imágenes locales y recursos de Unsplash son los únicos destinos admitidos.
const resolverImagen = (src = "") => {
  src = String(src).trim();
  if (!src) return "";
  const local = src.startsWith(IMG_BASE) ? src : `${IMG_BASE}${src}`;
  if (/^assets\/img\/[\w.-]+\.(?:png|jpe?g|webp|svg)$/i.test(local)) return local;
  try {
    const url = new URL(src, location.href);
    return url.protocol === "https:" && url.hostname === "images.unsplash.com" && (!url.port || url.port === "443")
      ? url.href
      : "";
  } catch {
    return "";
  }
};

/* ---------- Respaldo si Firestore falla o está vacío ---------- */
const FALLBACK = [
  { nombre: "Vestuario y estampado",    descripcion: "Buzos, chaquetas, camisetas y más.",       imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85", icono: "shirt",     enlace: "catalogo.html?categoria=vestuario" },
  { nombre: "Regalos personalizados",   descripcion: "Mugs, termos, esferos, libretas y más.",   imagen: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=900&q=85", icono: "gift",      enlace: "catalogo.html?categoria=regalos" },
  { nombre: "Empresas y dotaciones",    descripcion: "Kits, regalos corporativos y más.",        imagen: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85", icono: "briefcase", enlace: "catalogo.html?categoria=empresas" },
  { nombre: "Eventos y recordatorios",  descripcion: "Cumpleaños, grados, matrimonios y más.",  imagen: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=85", icono: "calendar",  enlace: "catalogo.html?categoria=eventos" },
  { nombre: "Juegos didácticos",        descripcion: "Rompecabezas, memoria, tarjetas y más.",   imagen: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=85", icono: "dice",      enlace: "catalogo.html?categoria=juegos" }
];

/* Evita que un texto con < > rompa el HTML */
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => (
  { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
));

const normalizarNombre = (nombre = "") => String(nombre)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .trim()
  .toLowerCase();

const resolverEnlace = (enlace, respaldo) => {
  if (!enlace) return respaldo || "catalogo.html";
  try {
    const destino = new URL(String(enlace), location.href);
    const catalogo = new URL("catalogo.html", location.href);
    const categoria = destino.searchParams.get("categoria");
    const esCategoriaValida = FALLBACK.some((item) =>
      new URL(item.enlace, location.href).searchParams.get("categoria") === categoria
    );
    if (destino.origin !== catalogo.origin || destino.pathname !== catalogo.pathname || !esCategoriaValida) {
      return respaldo || "catalogo.html";
    }
    return `catalogo.html?categoria=${encodeURIComponent(categoria)}`;
  } catch {
    return respaldo || "catalogo.html";
  }
};

/* Completa los datos de Firestore con los del FALLBACK si faltan */
const normalizar = (d) => {
  const base = FALLBACK.find(
    (f) => normalizarNombre(f.nombre) === normalizarNombre(d.nombre)
  ) || {};
  return {
    ...base,
    ...d,
    nombre: base.nombre || d.nombre,
    imagen: resolverImagen(base.imagen) || resolverImagen(d.imagen) || IMG_LOGO,
    enlace: base.enlace || resolverEnlace(d.enlace, "catalogo.html")
  };
};

const cardHTML = (c) => `
  <li class="card">
    <img src="${esc(c.imagen)}" alt="" loading="lazy" referrerpolicy="no-referrer">
    <a class="card__link" href="${esc(c.enlace)}" aria-label="${esc(c.nombre)}">
      <svg class="card__icon" viewBox="0 0 24 24" aria-hidden="true">${Object.hasOwn(ICONOS, c.icono) ? ICONOS[c.icono] : ICONOS.gift}</svg>
      <h3 class="card__title">${esc(c.nombre)}</h3>
      <p class="card__desc">${esc(c.descripcion)}</p>
      <span class="card__go" aria-hidden="true">→</span>
    </a>
  </li>`;

const render = (lista) => {
  grid.innerHTML = lista.map(cardHTML).join("");
  grid.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.src = IMG_LOGO;
    }, { once: true });
  });
};

async function cargar() {
  if (!grid) return;
  render(FALLBACK);
  try {
    const { db } = await import("./firebase.js");
    const { collection, getDocs, query, orderBy } = await import(
      "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
    );
    const snap = await getDocs(query(collection(db, "categorias"), orderBy("orden")));
    const data = snap.docs.map((d) => normalizar(d.data()));
    const nombresPresentes = new Set(data.map((categoria) => normalizarNombre(categoria.nombre)));
    const faltantes = FALLBACK.filter(
      (categoria) => !nombresPresentes.has(normalizarNombre(categoria.nombre))
    );
    render([...data, ...faltantes]);
  } catch (err) {
    console.error("Firestore (categorias):", err);
  }
}

cargar();