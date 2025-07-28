import { translations } from './i18n.js';

const langBtn = document.getElementById("lang-toggle");
const label = document.getElementById("lang-label");
const flag = document.getElementById("lang-flag");
const elements = document.querySelectorAll("[data-i18n]");

// Idioma actual desde localStorage o por defecto "es"
let currentLang = localStorage.getItem("lang") || "es";
setLang(currentLang);

// Evento al hacer clic en el botón de idioma
langBtn.addEventListener("click", () => {
  currentLang = currentLang === "es" ? "en" : "es";
  localStorage.setItem("lang", currentLang);
  setLang(currentLang);
});

function setLang(lang) {
  // Cambiar los textos dinámicos
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = translations[lang][key] || key;
  });

  // Cambiar etiqueta y bandera del botón
  if (label) label.textContent = lang.toUpperCase();
  if (flag) flag.src = `/flags/${lang}.svg`;
}
