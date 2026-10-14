/* Comportamiento común: enlaces desde config.js, estado abierto/cerrado,
   y sin aviso de instalación (la PWA es mínima y nunca se pide). */
(function () {
  var C = window.PAUSA;
  if (!C) return;

  /* No pedir la instalación: se suprime el aviso automático de Chrome.
     La web sigue siendo instalable desde el menú del navegador. */
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); });

  function waLink(key) {
    var text = (C.WA_TEXTS && C.WA_TEXTS[key]) || "";
    // encodeURIComponent codifica & como %26 y + como %2B
    return "https://wa.me/" + C.WA_NUMBER + (text ? "?text=" + encodeURIComponent(text) : "");
  }
  function catalogLink() { return "https://wa.me/c/" + C.WA_NUMBER; }
  function prettyNumber(n) { // 59157901276 -> +591 5790 1276
    var local = n.replace(/^591/, "");
    return "+591 " + local.slice(0, 4) + " " + local.slice(4);
  }
  var isDemo = C.WA_NUMBER !== C.REAL_NUMBER;

  function wire(root) {
    root = root || document;
    root.querySelectorAll("[data-wa]").forEach(function (a) { a.href = waLink(a.getAttribute("data-wa")); a.rel = "noopener"; });
    root.querySelectorAll("[data-catalog]").forEach(function (a) { a.href = catalogLink(); a.rel = "noopener"; });
    root.querySelectorAll("[data-maps]").forEach(function (a) { a.href = C.MAPS[a.getAttribute("data-maps")]; a.rel = "noopener"; });
    root.querySelectorAll("[data-conf]").forEach(function (a) { a.href = C[a.getAttribute("data-conf")]; a.rel = "noopener"; });
    root.querySelectorAll("[data-wa-number]").forEach(function (el) {
      el.textContent = prettyNumber(C.WA_NUMBER) + (isDemo ? " (número de demostración)" : "");
    });
    root.querySelectorAll("[data-updated]").forEach(function (el) { el.textContent = C.ACTUALIZADO; });
  }

  /* ---------- Abierto ahora / Cerrado ---------- */
  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  function nowInTZ() {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: C.TIMEZONE, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
    }).formatToParts(new Date());
    var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
    var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    var h = parseInt(o.hour, 10) % 24;
    return { day: map[o.weekday], min: h * 60 + parseInt(o.minute, 10) };
  }
  function toMin(s) { var p = s.split(":"); return +p[0] * 60 + +p[1]; }
  function fmt(s) { return s.replace(/^0/, ""); }

  function status() {
    var n = nowInTZ(), H = C.HORARIO;
    var openToday = H.dias.indexOf(n.day) !== -1;
    if (openToday) {
      for (var i = 0; i < H.franjas.length; i++) {
        var a = toMin(H.franjas[i][0]), b = toMin(H.franjas[i][1]);
        if (n.min >= a && n.min < b) return { open: true, text: "Abierto ahora · hasta las " + fmt(H.franjas[i][1]) };
      }
      for (var j = 0; j < H.franjas.length; j++) {
        if (n.min < toMin(H.franjas[j][0])) return { open: false, text: "Cerrado · abrimos a las " + fmt(H.franjas[j][0]) };
      }
    }
    // próximo día con atención
    for (var d = 1; d <= 7; d++) {
      var nd = (n.day + d) % 7;
      if (H.dias.indexOf(nd) !== -1) {
        var when = d === 1 ? "mañana" : "el " + DIAS[nd];
        return { open: false, text: "Cerrado · abrimos " + when + " a las " + fmt(H.franjas[0][0]) };
      }
    }
    return { open: false, text: "Cerrado" };
  }
  function paintStatus() {
    var s = status();
    document.querySelectorAll("[data-status]").forEach(function (el) {
      el.textContent = s.text; el.setAttribute("data-open", String(s.open));
    });
  }

  window.PAUSA_UI = { wire: wire, waLink: waLink, catalogLink: catalogLink, status: status, isDemo: isDemo };
  wire(document);
  paintStatus();
  setInterval(paintStatus, 60000);
})();
