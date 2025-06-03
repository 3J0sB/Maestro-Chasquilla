export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return date.toLocaleDateString("es-CL", options);
}

/**
 * Formatea una fecha en un formato corto y amigable
 * @param dateString - String de fecha en formato ISO o timestamp
 * @param includeTime - Si se debe incluir la hora (por defecto: false)
 * @returns String de fecha formateada (ej: "15 jun 2023" o "15 jun 2023, 14:30")
 */
export function formatShortDate(dateString: string, includeTime: boolean = false) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Si la fecha no es válida, retornar string vacío
    if (isNaN(date.getTime())) return '';
    
    // Nombres cortos de los meses en español
    const shortMonths = [
      'ene', 'feb', 'mar', 'abr', 'may', 'jun', 
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
    ];
    
    const day = date.getDate();
    const month = shortMonths[date.getMonth()];
    const year = date.getFullYear();
    
    // Formato base: "15 jun 2023"
    let formattedDate = `${day} ${month} ${year}`;
    
    // Si se solicita incluir la hora
    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      formattedDate += `, ${hours}:${minutes}`;
    }
    
    return formattedDate;
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return '';
  }
}

/**
 * Formatea una fecha en un formato relativo (hace X tiempo)
 * @param dateString - String de fecha en formato ISO o timestamp
 * @returns String con tiempo relativo (ej: "hace 5 minutos", "hace 2 días")
 */
export function formatRelativeTime(dateString: string) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Si la fecha no es válida, retornar string vacío
    if (isNaN(date.getTime())) return '';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Menos de 1 minuto
    if (diffInSeconds < 60) {
      return 'hace un momento';
    }
    
    // Menos de 1 hora
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }
    
    // Menos de 1 día
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }
    
    // Menos de 1 semana
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
    }
    
    // Menos de 1 mes
    if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
    }
    
    // Para fechas más antiguas, usar el formato corto
    return formatShortDate(dateString);
  } catch (error) {
    console.error('Error al calcular tiempo relativo:', error);
    return '';
  }
}