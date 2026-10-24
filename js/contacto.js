/* Formulario: arma el mensaje y abre WhatsApp (sin backend) */
const form = document.getElementById("form-contacto");
const error = document.getElementById("form-error");
const NUMERO = "573214720350";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const nombre = String(d.get("nombre") || "").trim();
  const nombreInput = form.elements.namedItem("nombre");
  if (!nombre) {
    error.hidden = false;
    nombreInput.setAttribute("aria-invalid", "true");
    nombreInput.focus();
    return;
  }
  error.hidden = true;
  nombreInput.removeAttribute("aria-invalid");

  const mensaje = String(d.get("mensaje") || "").trim();
  const texto = `Hola, soy ${nombre}. Quiero cotizar: ${d.get("producto")}.` +
    (mensaje ? `\n${mensaje}` : "");
  window.open(`https://wa.me/${NUMERO}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
});

form.elements.namedItem("nombre").addEventListener("input", (e) => {
  if (e.target.value.trim()) {
    error.hidden = true;
    e.target.removeAttribute("aria-invalid");
  }
});
