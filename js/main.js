/* ==========================================================
   main.js: menú móvil + slider del hero
   Seguro para todas las páginas: cada bloque solo corre si
   sus elementos existen.
   ========================================================== */

/* ---------- 1. Menú móvil ---------- */
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("menu");

if (toggle && nav) {
  const cerrar = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const abierto = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(abierto));
  });

  nav.addEventListener("click", (e) => { if (e.target.closest("a")) cerrar(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrar(); });
}

/* ---------- 2. Slider del hero (solo en index) ---------- */
const slides = [...document.querySelectorAll(".hero__slide")];

if (slides.length) {
  const dotsBox = document.querySelector(".hero__dots");
  const prev = document.querySelector(".hero__arrow--prev");
  const next = document.querySelector(".hero__arrow--next");
  const hero = document.querySelector(".hero");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let index = 0;
  let timer = null;

  // Puntos
  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Ir al slide ${i + 1}`);
    b.addEventListener("click", () => { go(i); play(); });
    dotsBox.appendChild(b);
    return b;
  });

  function go(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle("is-active", n === index));
    dots.forEach((d, n) => d.classList.toggle("is-active", n === index));
  }

  function play() {
    stop();
    if (slides.length > 1 && !reduceMotion) timer = setInterval(() => go(index + 1), 6000);
  }
  function stop() { clearInterval(timer); }

  prev?.addEventListener("click", () => { go(index - 1); play(); });
  next?.addEventListener("click", () => { go(index + 1); play(); });

  // Pausa al pasar el mouse o enfocar con teclado
  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", play);
  hero.addEventListener("focusin", stop);
  hero.addEventListener("focusout", play);

  // Deslizar en móvil
  let x0 = null;
  hero.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) { go(index + (dx < 0 ? 1 : -1)); play(); }
    x0 = null;
  });

  // Con un solo slide no tienen sentido flechas ni puntos
  if (slides.length < 2) {
    prev?.remove(); next?.remove(); dotsBox?.remove();
  }

  go(0);
  play();
}
