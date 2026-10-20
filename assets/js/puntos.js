/* Consulta de puntos por número de WhatsApp (un solo enlace: puntos.html).
   El número queda guardado en este celular para la próxima visita.
   Lee la pestaña «Consulta» publicada como CSV (numero, sellos, ultimo_sello)
   o, si SHEET_CSV_URL está vacío, los números ficticios de datos/puntos-demo.csv.
   Por diseño, solo muestra sellos: nunca nombres (cualquiera puede escribir
   un número ajeno). */
(function () {
  var C = window.PAUSA, UI = window.PAUSA_UI;
  var panel = document.getElementById("panel");
  var KEY = "pausa_numero";

  /* Deja solo 8 dígitos: acepta «7123 4567», «+591 71234567», «59171234567» */
  function normalize(v) {
    var d = String(v || "").replace(/\D/g, "");
    if (d.length === 11 && d.indexOf("591") === 0) d = d.slice(3);
    return d;
  }
  function masked(n) { return "•••• " + n.slice(-4); }
  function load() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(n) { try { localStorage.setItem(KEY, n); } catch (e) {} }
  function forget() { try { localStorage.removeItem(KEY); } catch (e) {} }

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
  function clear() {
    var sim = document.getElementById("sim");
    sim.textContent = C.SHEET_CSV_URL ? "Demostración · hoja de registro del equipo" : "Simulado · números ficticios";
    while (panel.children.length > 1) panel.removeChild(panel.lastChild);
  }
  function whoLine(numero) {
    var w = el("div", "who");
    w.appendChild(el("span", null, "Número: " + masked(numero)));
    var b = el("button", null, "Cambiar número"); b.type = "button";
    b.addEventListener("click", function () { forget(); showForm(""); });
    w.appendChild(b);
    return w;
  }

  /* ---------- Buscador ---------- */
  function showForm(prefill, errorMsg) {
    clear();
    panel.appendChild(el("h1", null, "Mis puntos"));
    panel.appendChild(el("p", "muted", "Escribe el número de WhatsApp con el que pides. Lo guardamos en este celular para que la próxima vez veas tus sellos directo."));
    var f = el("form", "lookup"); f.noValidate = true;
    var lab = el("label", null, "Tu número de WhatsApp"); lab.htmlFor = "numero";
    var field = el("div", "field");
    field.appendChild(el("span", null, "+591"));
    var inp = document.createElement("input");
    inp.id = "numero"; inp.name = "numero"; inp.type = "tel"; inp.inputMode = "numeric";
    inp.autocomplete = "tel-national"; inp.placeholder = "7XXXXXXX"; inp.maxLength = 16; inp.value = prefill || "";
    field.appendChild(inp);
    var err = el("p", "error", errorMsg || ""); err.setAttribute("role", "alert"); if (!errorMsg) err.hidden = true;
    var btn = el("button", "btn btn--primary btn--block", "Ver mis sellos"); btn.type = "submit";
    f.appendChild(lab); f.appendChild(field); f.appendChild(err); f.appendChild(btn);
    f.appendChild(el("p", "hint", "Solo mostramos la cantidad de sellos, nunca tu nombre."));
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var n = normalize(inp.value);
      if (n.length !== 8) { err.textContent = "Escribe los 8 dígitos de tu número (por ejemplo, 71234567)."; err.hidden = false; inp.focus(); return; }
      save(n); lookup(n);
    });
    panel.appendChild(f);
    if (!prefill) inp.focus({ preventScroll: true });
  }

  /* ---------- Resultado ---------- */
  function showResult(numero, data) {
    clear();
    panel.appendChild(el("h1", null, "Mis puntos"));
    panel.appendChild(whoLine(numero));
    var meta = C.SELLOS_META || 10;
    var n = Math.max(0, parseInt(data.sellos, 10) || 0);

    var count = el("p", "count");
    count.appendChild(el("span", "count__n", String(Math.min(n, meta))));
    count.appendChild(el("span", "count__of", "de " + meta + " sellos digitales"));
    panel.appendChild(count);

    var ul = el("ul", "stamps"); ul.setAttribute("aria-hidden", "true");
    for (var i = 0; i < meta; i++) { var li = el("li", i < n ? "on" : ""); if (i < n) li.innerHTML = check(); ul.appendChild(li); }
    panel.appendChild(ul);

    if (n >= meta) panel.appendChild(el("p", null, "¡Completaste tus " + meta + " sellos! Pide por el chat como siempre y dinos que quieres canjearlos."));
    else if (n === 0) panel.appendChild(el("p", "muted", "Todavía no tienes sellos digitales. Tu próximo pedido por WhatsApp suma el primero."));
    else panel.appendChild(el("p", "muted", "Te faltan " + (meta - n) + ". Si tienes sellos en tu tarjeta de cartón, también cuentan al canjear."));
    if (data.ultimo_sello) panel.appendChild(el("p", "small muted", "Último sello: " + data.ultimo_sello));
  }

  function showNotFound(numero) {
    clear();
    panel.appendChild(el("h1", null, "Mis puntos"));
    panel.appendChild(whoLine(numero));
    panel.appendChild(el("p", null, "Todavía no hay sellos para este número."));
    panel.appendChild(el("p", "muted", "Tu primer sello aparece cuando confirmamos el pago de un pedido por WhatsApp. Si ya pediste y no lo ves, escríbenos."));
    var a = el("a", "btn btn--secondary", "Escribir por WhatsApp");
    a.setAttribute("data-wa", "puntos"); a.target = "_blank"; panel.appendChild(a);
    UI.wire(panel);
  }

  function showError(numero) {
    clear();
    panel.appendChild(el("h1", null, "Mis puntos"));
    panel.appendChild(whoLine(numero));
    panel.appendChild(el("p", "muted", "No pudimos cargar tus sellos ahora. Revisa tu conexión y vuelve a abrir esta página."));
  }

  function lookup(numero) {
    clear();
    panel.appendChild(el("h1", null, "Mis puntos"));
    panel.appendChild(el("p", "muted", "Buscando tus sellos…"));
    var url = C.SHEET_CSV_URL || "datos/puntos-demo.csv";
    fetch(url, { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (t) {
        var row = parseCSV(t).filter(function (o) { return normalize(o.numero) === numero; })[0];
        if (row) showResult(numero, row); else showNotFound(numero);
      })
      .catch(function () { showError(numero); });
  }

  var saved = load();
  if (saved && normalize(saved).length === 8) lookup(normalize(saved));
  else showForm("");
})();
