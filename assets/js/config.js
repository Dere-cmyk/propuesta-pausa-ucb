/* =====================================================================
   DATOS DE LA PROPUESTA · se editan SOLO aquí (fuente única, tabla 2.1)
   Para editar desde el celular: en GitHub, abrir este archivo, tocar el
   lápiz, cambiar el valor entre comillas y "Commit changes".
   ===================================================================== */
window.PAUSA = {
  /* --- Número de WhatsApp ---------------------------------------------
     DEMOSTRACIÓN: 59157901276 (número del equipo, con aviso de demo).
     Cuando el dueño aplique la propuesta, cambiar SOLO esta línea por:
     WA_NUMBER: "59164581332",                                          */
  WA_NUMBER: "59157901276",

  /* Número real de Pausa (no se enlaza mientras dure la demostración) */
  REAL_NUMBER: "59164581332",

  /* --- Textos prellenados por canal (tabla 2.2) --------------------- */
  WA_TEXTS: {
    web: "Hola, vengo de la web y quiero hacer un pedido para retirar",
    tiktok: "Hola, vi su TikTok y quiero hacer un pedido para retirar",
    anuncio: "Hola, vi el Matcha Blue & berries en Instagram y lo quiero para retirar",
    instagram: "", // botón del perfil: el texto lo define la plataforma [VERIFICAR]
    puntos: ""     // consultas de sellos: el cliente escribe libremente
  },

  /* --- Horario (tabla 2.1) · zona America/La_Paz ---------------------
     Días: 1 = lunes … 6 = sábado, 0 = domingo. Franjas en "HH:MM".     */
  TIMEZONE: "America/La_Paz",
  HORARIO: {
    dias: [1, 2, 3, 4, 5, 6],
    franjas: [["08:00", "12:00"], ["15:00", "20:00"]]
  },

  /* --- Enlaces de Maps --------------------------------------------- */
  MAPS: {
    // [VERIFICAR] reemplazar por el enlace exacto de cada ficha (Compartir > Copiar enlace)
    principal: "https://www.google.com/maps/search/?api=1&query=F788%2B27F%20Tarija",
    sucursal: "https://www.google.com/maps/search/?api=1&query=Av.%20La%20Paz%20249%2C%20Tarija%2C%20Bolivia",
    ficha: "https://www.google.com/maps/search/?api=1&query=Pausa%20Coffee%20Express%20Tarija"
  },

  /* --- Redes reales de Pausa ----------------------------------------- */
  INSTAGRAM: "https://www.instagram.com/pausa.coffeetja/",
  TIKTOK: "https://www.tiktok.com/@pausa.coffeetja", // [VERIFICAR usuario exacto]

  /* --- Hoja de puntos -----------------------------------------------
     Pegar aquí el enlace de la pestaña «Consulta» publicada como CSV
     (Archivo > Compartir > Publicar en la web > Consulta > CSV).
     Vacío = se usan los clientes ficticios de datos/puntos-demo.csv     */
  SHEET_CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTuyH5kEynhyOSV-l-Q4cWKI1Ccf8WjL6iv84FGSZ0xuszdBBqXBUksIxg6tZU7rA/pub?gid=734004414&single=true&output=csv",

  SELLOS_META: 10,
  ACTUALIZADO: "14/10/2026"
};
