(function () {
const WHATSAPP = "https://wa.me/573214720350";
const LOGO = "assets/img/logo.png";

const grid     = document.getElementById("productos-grid");
const filtros  = document.getElementById("filtros");
const buscador = document.getElementById("buscador");
const contador = document.getElementById("contador");
const estado   = document.getElementById("catalogo-estado");

/* ---------- Productos de respaldo (se muestran siempre al inicio) ---------- */
const PRODUCTOS_BASE = [
  /* Vestuario */
  { orden: 1,  categoria: "vestuario", nombre: "Camiseta Colombia roja y dorado",    descripcion: "Camiseta roja con la palabra Colombia en dorado.",                      imagen: "assets/img/camisa-colombia-roja-dorada.jpg" },
  { orden: 2,  categoria: "vestuario", nombre: "Camiseta Orgullo Tricolor",          descripcion: "Camiseta blanca con franjas tricolor y la frase Orgullo Tricolor.",     imagen: "assets/img/camisa-orgullo-tricolor.jpg" },
  { orden: 3,  categoria: "vestuario", nombre: "Camiseta negra tricolor",            descripcion: "Camiseta negra con franjas amarilla, azul y roja y detalles dorados.", imagen: "assets/img/camisa-colombia-negra-tricolor.jpg" },
  { orden: 4,  categoria: "vestuario", nombre: "Camiseta blanca franja tricolor",    descripcion: "Camiseta blanca con franja tricolor al frente.",                        imagen: "assets/img/camisa-colombia-blanca-franja.jpg" },
  { orden: 5,  categoria: "vestuario", nombre: "Camiseta COLOMBIA triple",           descripcion: "Camiseta blanca con la palabra Colombia en dorado, azul y rojo.",       imagen: "assets/img/camisa-colombia-triple.jpg" },
  { orden: 6,  categoria: "vestuario", nombre: "Camiseta negra con franjas doradas", descripcion: "Camiseta negra con franjas doradas.",                                   imagen: "assets/img/camisa-colombia-negra-dorada.jpg" },

  /* Regalos: bolsos */
  { orden: 7,  categoria: "regalos", nombre: "Bolso Transformadas a su semejanza",    descripcion: "Bolso de tela con diseño de mariposas y flores.",       imagen: "assets/img/bolso-transformadas.jpg" },
  { orden: 8,  categoria: "regalos", nombre: "Bolso Jesús salva",                     descripcion: "Bolso de tela con frase Buenas nuevas, Jesús salva.",   imagen: "assets/img/bolso-jesus-salva.jpg" },
  { orden: 9,  categoria: "regalos", nombre: "Bolso Bogotá",                          descripcion: "Bolso de tela con collage de lugares de Bogotá.",       imagen: "assets/img/bolso-bogota.jpg" },
  { orden: 10, categoria: "regalos", nombre: "Bolso Para Dios no hay nada imposible", descripcion: "Bolso de tela con diseño ilustrado y frase de fe.",     imagen: "assets/img/bolso-para-dios-nada-imposible.jpg" },

  /* Regalos: mugs */
  { orden: 11, categoria: "regalos", nombre: "Mug Dragon Ball", descripcion: "Mug sublimado con diseño de Broly y Goku.", imagen: "assets/img/mug-dragonball-broly.jpg" },
  { orden: 12, categoria: "regalos", nombre: "Mug Goku negro",  descripcion: "Mug negro sublimado con diseño de Goku.",    imagen: "assets/img/mug-goku-negro.jpg" },

  /* Ejemplos de categorías disponibles bajo cotización */
  { orden: 13, categoria: "empresas", nombre: "Dotaciones industriales", descripcion: "Uniformes y prendas de alta visibilidad para equipos de trabajo. Materiales, marcación y cantidades se cotizan según tu necesidad.", imagen: "https://images.unsplash.com/photo-1652303518379-c0ef1c9fb2b1?auto=format&fit=crop&w=900&q=85" },
  { orden: 14, categoria: "eventos", nombre: "Charlas de seguridad industrial", descripcion: "Prendas y detalles personalizados para jornadas de capacitación en seguridad industrial. Consulta opciones para tu equipo.", imagen: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=85" },
  { orden: 15, categoria: "eventos", nombre: "Recordatorios personalizados", descripcion: "Detalles para celebraciones, capacitaciones y fechas especiales. Personaliza el diseño y cotiza tu pedido.", imagen: "https://images.unsplash.com/photo-1521478706270-f2e33c203d95?auto=format&fit=crop&w=900&q=85" },
  { orden: 16, categoria: "juegos", nombre: "Juegos didácticos personalizados", descripcion: "Juegos personalizados para aprender jugando. Consulta opciones y cotiza un diseño a tu medida.", imagen: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=900&q=85" }
];

const ETIQUETAS = {
  vestuario: "Vestuario",
  regalos:   "Regalos",
  empresas:  "Empresas",
  eventos:   "Eventos",
  juegos:    "Juegos didácticos"
};
const CATEGORIAS_EQUIVALENTES = {
  "vestuario y estampado": "vestuario",
  "vestuario y estampados": "vestuario",
  "regalos personalizados": "regalos",
  "empresas y dotaciones": "empresas",
  "eventos y recordatorios": "eventos",
  "juegos didacticos": "juegos"
};
const normalizarCategoria = (categoria) => {
  const valor = String(categoria || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
  return CATEGORIAS_EQUIVALENTES[valor] || valor;
};
const etiqueta = (c) => ETIQUETAS[normalizarCategoria(c)] || c || "";

let productos = PRODUCTOS_BASE;
let visibles = [];            // lista que se ve ahora (según filtro y búsqueda)
let categoriaActual = "todos";
let texto = "";

/* Evita que un texto con < > rompa el HTML */
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => (
  { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
));

const resolverImagen = (src = "") => {
  const valor = String(src).trim();
  const local = valor.startsWith("assets/img/") ? valor : `assets/img/${valor}`;
  if (/^assets\/img\/[\w.-]+\.(?:png|jpe?g|webp|svg)$/i.test(local)) return local;
  try {
    const url = new URL(valor, location.href);
    return url.protocol === "https:" && url.hostname === "images.unsplash.com" && (!url.port || url.port === "443")
      ? url.href
      : LOGO;
  } catch {
    return LOGO;
  }
};

const waLink = (p) =>
  `${WHATSAPP}?text=${encodeURIComponent("Hola, quiero cotizar: " + p.nombre)}`;

const imgTag = (p, clase = "") =>
  `<img ${clase ? `class="${clase}"` : ""} src="${esc(resolverImagen(p.imagen || LOGO))}" alt="${esc(p.nombre)}" loading="lazy">`;

/* ---------- 1. Tarjeta de producto ---------- */
const cardHTML = (p, i) => `
  <li class="product" data-i="${i}">
    <button class="product__media" type="button" aria-label="Ver ${esc(p.nombre)} en grande">
      ${imgTag(p)}
    </button>
    <div class="product__body">
      <span class="product__tag">${esc(etiqueta(p.categoria))}</span>
      <h3>${esc(p.nombre)}</h3>
      <p>${esc(p.descripcion)}</p>
      <a class="btn btn--primary btn--sm" href="${waLink(p)}" target="_blank" rel="noopener">Cotizar</a>
    </div>
  </li>`;

/* ---------- 2. Aparición suave al hacer scroll ---------- */
const io = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

if (io) grid.classList.add("is-reveal");

function revelar() {
  grid.querySelectorAll(".product").forEach((el, i) => {
    if (!io) { el.classList.add("is-visible"); return; }
    el.style.setProperty("--d", (i % 6) * 70 + "ms");
    io.observe(el);
  });
}

/* ---------- 3. Pintar según filtro y búsqueda ---------- */
function render() {
  visibles = productos.filter((p) => {
    const nombre = String(p.nombre || "");
    const descripcion = String(p.descripcion || "");
    const categoria = normalizarCategoria(p.categoria);
    const okCat = categoriaActual === "todos" || categoria === categoriaActual;
    const okTxt = `${nombre} ${descripcion}`.toLowerCase().includes(texto);
    return okCat && okTxt;
  });

  contador.textContent = `${visibles.length} ${visibles.length === 1 ? "producto" : "productos"}`;
  grid.innerHTML = visibles.length
    ? visibles.map(cardHTML).join("")
    : `<li class="empty">No encontramos productos con ese filtro.</li>`;
  grid.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.src = LOGO;
    }, { once: true });
  });
  revelar();
}

/* ---------- 4. Vista rápida (ventana emergente) ---------- */
const dlg = document.createElement("dialog");
dlg.className = "quickview";
dlg.setAttribute("aria-label", "Detalle del producto");
dlg.innerHTML = `
  <button class="quickview__close" type="button" aria-label="Cerrar">&times;</button>
  <button class="quickview__nav quickview__nav--prev" type="button" aria-label="Producto anterior">&#8249;</button>
  <button class="quickview__nav quickview__nav--next" type="button" aria-label="Producto siguiente">&#8250;</button>
  <div class="quickview__body"></div>`;
document.body.appendChild(dlg);

const qvBody = dlg.querySelector(".quickview__body");
let actual = 0;

function pintarModal() {
  const p = visibles[actual];
  if (!p) return;
  qvBody.innerHTML = `
    ${imgTag(p, "quickview__img")}
    <div class="quickview__info">
      <span class="product__tag">${esc(etiqueta(p.categoria))}</span>
      <h2 class="quickview__title">${esc(p.nombre)}</h2>
      <p class="quickview__desc">${esc(p.descripcion)}</p>
      <a class="btn btn--primary" href="${waLink(p)}" target="_blank" rel="noopener">Cotizar por WhatsApp</a>
      <p class="quickview__count">${actual + 1} / ${visibles.length}</p>
    </div>`;
  const image = qvBody.querySelector("img");
  image.addEventListener("error", () => {
    image.src = LOGO;
  }, { once: true });
}

function abrir(i) {
  actual = i;
  pintarModal();
  if (!dlg.open) {
    dlg.showModal();
    document.body.style.overflow = "hidden";
  }
}

function mover(paso) {
  if (!visibles.length) return;
  actual = (actual + paso + visibles.length) % visibles.length;
  pintarModal();
}

dlg.addEventListener("close", () => { document.body.style.overflow = ""; });

dlg.addEventListener("click", (e) => {
  if (e.target === dlg || e.target.closest(".quickview__close")) dlg.close();
  else if (e.target.closest(".quickview__nav--prev")) mover(-1);
  else if (e.target.closest(".quickview__nav--next")) mover(1);
});

dlg.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft")  mover(-1);
  if (e.key === "ArrowRight") mover(1);
});

grid.addEventListener("click", (e) => {
  if (e.target.closest("a")) return;            // el botón Cotizar funciona normal
  const li = e.target.closest(".product[data-i]");
  if (li) abrir(Number(li.dataset.i));
});

/* ---------- 5. Cargar de Firestore (si hay datos, reemplaza los de respaldo) ---------- */
async function cargar() {
  render(); // se ven los productos de respaldo de inmediato
  try {
    const { db } = await import("./firebase.js");
    const { collection, getDocs } = await import(
      "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
    );
    const snap = await getDocs(collection(db, "productos"));
    const data = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (Number(a.orden) || 999) - (Number(b.orden) || 999));
    if (data.length) {
      const categoriasDisponibles = new Set(
        data.map((producto) => normalizarCategoria(producto.categoria))
      );
      const ejemplosSinProducto = PRODUCTOS_BASE.filter(
        (producto) => ["empresas", "eventos", "juegos"].includes(producto.categoria)
          && !categoriasDisponibles.has(normalizarCategoria(producto.categoria))
      );
      productos = [...data, ...ejemplosSinProducto];
      render();
    }
  } catch (err) {
    console.error("Firestore (productos):", err);
    estado.textContent = "Mostramos el catálogo disponible. No fue posible sincronizar los productos en línea.";
  }
}

/* ---------- 6. Filtros y buscador ---------- */
function activarChip(cat) {
  categoriaActual = cat;
  filtros.querySelectorAll(".chip").forEach((c) => {
    const activo = c.dataset.cat === cat;
    c.classList.toggle("is-active", activo);
    c.setAttribute("aria-pressed", String(activo));
  });
  render();
}

filtros.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (btn) activarChip(btn.dataset.cat);
});

buscador.addEventListener("input", (e) => {
  texto = e.target.value.trim().toLowerCase();
  render();
});

/* Respeta ?categoria=vestuario que viene del inicio */
const inicial = new URLSearchParams(location.search).get("categoria");
if (inicial && [...filtros.querySelectorAll(".chip")].some((chip) => chip.dataset.cat === inicial)) {
  activarChip(inicial);
}

cargar();
})();