/* Consulta de puntos con enlace personal: puntos.html?c=CODIGO
   Lee la pestaña «Consulta» publicada como CSV (o los clientes ficticios). */
(function () {
  var C = window.PAUSA, UI = window.PAUSA_UI;
  var panel = document.getElementById("panel");
  var KEY = "pausa_codigo";

  function getCode() {
    var p = new URLSearchParams(location.search).get("c");
    if (p) {
      p = p.trim().toUpperCase();
      try { localStorage.setItem(KEY, p); } catch (e) {}
      // Quita el código de la barra de direcciones (no queda a la vista ni en capturas)
      try { history.replaceState(null, "", location.pathname); } catch (e) {}
      return p;
    }
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function parseCSV(text) {
    var rows = [], row = [], cur = "", q = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (q) {
        if (ch === '"' && text[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') q = false;
        else cur += ch;
      } else if (ch === '"') q = true;
      else if (ch === ",") { row.push(cur); cur = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(cur); rows.push(row); row = []; cur = "";
      } else cur += ch;
    }
    if (cur || row.length) { row.push(cur); rows.push(row); }
    var head = rows.shift().map(function (h) { return h.trim().toLowerCase(); });
    return rows.filter(function (r) { return r.join("").trim(); }).map(function (r) {
      var o = {}; head.forEach(function (h, k) { o[h] = (r[k] || "").trim(); }); return o;
    });
  }

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function check() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'; }

  function render(state, data) {
    var sim = document.getElementById("sim");
    sim.textContent = C.SHEET_CSV_URL ? "Demostración · hoja de registro del equipo" : "Simulado · clientes ficticios";
    while (panel.children.length > 1) panel.removeChild(panel.lastChild);

    if (state === "sin-codigo") {
      panel.appendChild(el("h1", null, "Mis puntos"));
      panel.appendChild(el("p", "muted", "Abre el enlace personal que te enviamos por WhatsApp cuando confirmamos tu pago. Así ves tus sellos sin escribir tu número."));
      var a = el("a", "btn btn--secondary", "Escribir por WhatsApp");
      a.setAttribute("data-wa", "puntos"); a.target = "_blank"; panel.appendChild(a);
      UI.wire(panel); return;
    }
    if (state === "no-encontrado") {
      panel.appendChild(el("h1", null, "No encontramos ese enlace"));
      panel.appendChild(el("p", "muted", "Puede que el código esté incompleto. Escríbenos y te lo reenviamos."));
      var b = el("a", "btn btn--secondary", "Escribir por WhatsApp");
      b.setAttribute("data-wa", "puntos"); b.target = "_blank"; panel.appendChild(b);
      UI.wire(panel); return;
    }
    if (state === "error") {
      panel.appendChild(el("h1", null, "Mis puntos"));
      panel.appendChild(el("p", "muted", "No pudimos cargar tus sellos ahora. Revisa tu conexión y vuelve a abrir el enlace."));
      return;
    }

    var meta = C.SELLOS_META || 10;
    var n = Math.max(0, parseInt(data.sellos, 10) || 0);
    var nombre = (data.nombre || "").split(" (")[0];
    panel.appendChild(el("h1", null, nombre ? "Hola, " + nombre : "Mis puntos"));

    var count = el("p", "count");
    count.appendChild(el("span", "count__n", String(Math.min(n, meta))));
    count.appendChild(el("span", "count__of", "de " + meta + " sellos digitales"));
    panel.appendChild(count);

    var ul = el("ul", "stamps"); ul.setAttribute("aria-hidden", "true");
    for (var i = 0; i < meta; i++) { var li = el("li", i < n ? "on" : ""); if (i < n) li.innerHTML = check(); ul.appendChild(li); }
    panel.appendChild(ul);

    if (n >= meta) {
      panel.appendChild(el("p", null, "¡Completaste tus " + meta + " sellos! Pide por el chat como siempre y dinos que quieres canjearlos."));
    } else if (n === 0) {
      panel.appendChild(el("p", "muted", "Todavía no tienes sellos digitales. Tu próximo pedido por WhatsApp suma el primero."));
    } else {
      panel.appendChild(el("p", "muted", "Te faltan " + (meta - n) + ". Si tienes sellos en tu tarjeta de cartón, también cuentan al canjear."));
    }
    if (data.ultimo_sello) panel.appendChild(el("p", "small muted", "Último sello: " + data.ultimo_sello));
  }

  var code = getCode();
  if (!code) { render("sin-codigo"); return; }

  var url = C.SHEET_CSV_URL || "datos/puntos-demo.csv";
  fetch(url, { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(function (t) {
      var row = parseCSV(t).filter(function (o) { return (o.codigo || "").toUpperCase() === code; })[0];
      render(row ? "ok" : "no-encontrado", row);
    })
    .catch(function () { render("error"); });
})();
