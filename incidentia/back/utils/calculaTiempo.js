export function calculaDiasTranscurridos(fechaInicial, fechaFinal) {
    const fechaInicialStr = new Intl.DateTimeFormat('es-MX').format(new Date(fechaInicial))
    const fechaFinalStr = new Intl.DateTimeFormat('es-MX').format(new Date(fechaFinal))

    // Parsea las fechas en formato DD/MM/AAAA a objetos Date
    const fInicial = parsearFecha(fechaInicialStr);
    const fFinal = parsearFecha(fechaFinalStr);
  
    // Calcula la diferencia en milisegundos
    const diferenciaEnMilisegundos = fFinal - fInicial;
  
    // Convierte la diferencia a días
    const diasTranscurridos = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);
  
    // Redondea el resultado y lo devuelve
    return Math.round(diasTranscurridos);
  }
  
  // Función para parsear fechas en formato DD/MM/AAAA a objetos Date
  function parsearFecha(fechaStr) {
    const [dia, mes, anio] = fechaStr.split('/').map(Number);
    return new Date(anio, mes - 1, dia); // Resta 1 al mes porque en JavaScript los meses van de 0 a 11
  }
  