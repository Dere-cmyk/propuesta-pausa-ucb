/* Visor de historias destacadas de la maqueta (sin avance automático) */
(function () {
  var IMG = "../assets/img/";
  var LINK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>';

  var HL = {
    "como-pedir": [
      { img: "ig-historia-como-pedir-720.webp", alt: "Dos vasos para llevar en un portavasos", text: "1 · Toca el botón de WhatsApp del perfil" },
      { img: "ig-historia-menu-720.webp", alt: "Bebidas de Pausa en la barra", text: "2 · Elige en el menú y paga con QR", sticker: { label: "Ver precios y pedir", catalog: true } },
      { img: "ig-historia-ventanilla-720.webp", alt: "Ventana de retiro del local principal", text: "3 · Retira en la ventanilla, sin fila" }
    ],
    "menu": [
      // Historia del anuncio (paso 1 de la ruta, 13 §4.2.1): oferta con precio, promesa y acción
      { img: "ig-historia-anuncio-720.webp", contain: true, alt: "Persona con un Matcha Blue & berries frío de Pausa",
        title: "Matcha Blue & berries · Bs 14",
        text: "Pídelo por WhatsApp y retíralo en ventanilla, sin fila",
        sticker: { label: "Pedir por WhatsApp", wa: "anuncio" } },
      { img: "ig-historia-menu-720.webp", alt: "Bebidas frías y calientes de Pausa", sticker: { label: "Ver precios y pedir", catalog: true } }
    ],
    "ubicacion": [
      { img: "ig-historia-fachada-principal-720.webp", alt: "Fachada del local principal", title: "Local principal · ventanilla de retiro",
        text: "C. Sucre entre Virginio Lema y 15 de Abril\nLun–sáb · 8–12 y 15–20", sticker: { label: "Cómo llegar", maps: "principal" } },
      { img: "ig-historia-fachada-sucursal-720.webp", alt: "Fachada de la sucursal", title: "Sucursal",
        text: "Av. La Paz 249, entre Avaroa y Las Américas\nLun–sáb · 8–12 y 15–20", sticker: { label: "Cómo llegar", maps: "sucursal" } }
    ],
    "puntos": [
      { img: "ig-historia-puntos-720.webp", alt: "Vaso de Pausa frente a la pared «Para un buen coffee»", title: "Tu tarjeta de sellos, ahora también en el celular",
        text: "Un sello por compra, también por WhatsApp", sticker: { label: "Consultar mis puntos", href: "../puntos.html" } }
    ],
    "ustedes": [
      { img: "ig-historia-ustedes-720.webp", alt: "Clientas con sus vasos de Pausa en un ascensor" }
    ]
  };

  var box = document.getElementById("story"), img = document.getElementById("story-img");
  var bars = document.getElementById("story-bars"), over = document.getElementById("story-over");
  var cur = null, idx = 0, opener = null;

  function show() {
    var s = HL[cur][idx];
    img.src = IMG + s.img; img.alt = s.alt || ""; img.className = s.contain ? "contain" : "";
    bars.innerHTML = HL[cur].map(function (_, i) { return '<i class="' + (i <= idx ? "on" : "") + '"></i>'; }).join("");
    over.innerHTML = "";
    if (s.title) { var t = document.createElement("div"); t.className = "story__title"; t.textContent = s.title; over.appendChild(t); }
    if (s.text) { var p = document.createElement("div"); p.className = "story__text"; p.textContent = s.text; over.appendChild(p); }
    if (s.sticker) {
      var a = document.createElement("a"); a.className = "sticker"; a.target = "_blank";
      a.innerHTML = LINK + "<span></span>"; a.lastChild.textContent = s.sticker.label;
      if (s.sticker.wa) a.setAttribute("data-wa", s.sticker.wa);
      if (s.sticker.catalog) a.setAttribute("data-catalog", "");
      if (s.sticker.maps) a.setAttribute("data-maps", s.sticker.maps);
      if (s.sticker.href) { a.href = s.sticker.href; a.target = "_self"; }
      over.appendChild(a);
      window.PAUSA_UI.wire(over);
    }
  }
  function open(key, btn) { cur = key; idx = 0; opener = btn; box.classList.add("open"); document.body.classList.add("lock"); show(); document.getElementById("story-close").focus(); history.replaceState(null, "", "#" + key); }
  function close() { box.classList.remove("open"); document.body.classList.remove("lock"); cur = null; history.replaceState(null, "", location.pathname); if (opener) opener.focus(); }
  function next() { if (idx < HL[cur].length - 1) { idx++; show(); } else close(); }
  function prev() { if (idx > 0) { idx--; show(); } }

  document.querySelectorAll("[data-hl]").forEach(function (b) { b.addEventListener("click", function () { open(b.getAttribute("data-hl"), b); }); });
  document.getElementById("story-close").addEventListener("click", close);
  document.getElementById("story-next").addEventListener("click", next);
  document.getElementById("story-prev").addEventListener("click", prev);
  document.addEventListener("keydown", function (e) {
    if (!cur) return;
    if (e.key === "Escape") close(); else if (e.key === "ArrowRight") next(); else if (e.key === "ArrowLeft") prev();
  });

  // Enlace de la bio: muestra la dirección de la web de la propuesta
  var host = document.getElementById("bio-host");
  if (host) { var u = new URL("../", location.href); host.textContent = (u.host + u.pathname).replace(/\/$/, ""); }

  // Abrir directo una destacada con #menu, #puntos, etc.
  var h = location.hash.slice(1); if (HL[h]) open(h, document.querySelector('[data-hl="' + h + '"]'));
})();
