/* Galería: lightbox con <dialog> (teclado: ← → Esc) */
const botones = [...document.querySelectorAll("#galeria button")];
const box = document.getElementById("lightbox");
const img = document.getElementById("lb-img");
const cap = document.getElementById("lb-cap");
let i = 0;

function mostrar(n) {
  i = (n + botones.length) % botones.length;
  const b = botones[i];
  img.src = b.dataset.full;
  img.alt = b.querySelector("img").alt;
  cap.textContent = b.dataset.caption;
}
function abrir(n) { mostrar(n); box.showModal(); }

botones.forEach((b, n) => b.addEventListener("click", () => abrir(n)));
box.querySelector(".lightbox__close").addEventListener("click", () => box.close());
box.querySelector(".lightbox__nav--prev").addEventListener("click", () => mostrar(i - 1));
box.querySelector(".lightbox__nav--next").addEventListener("click", () => mostrar(i + 1));
box.addEventListener("click", (e) => { if (e.target === box) box.close(); });   // clic fuera
box.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") mostrar(i - 1);
  if (e.key === "ArrowRight") mostrar(i + 1);
});
