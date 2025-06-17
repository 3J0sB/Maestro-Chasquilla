/**
 * Formatea un número como moneda en pesos chilenos
 * @param amount - El monto a formatear
 * @returns El monto formateado como string (ejemplo: "$15.000")
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Trunca un texto a un número máximo de caracteres
 * @param text - El texto a truncar
 * @param maxLength - La longitud máxima
 * @returns El texto truncado con '...' al final si fue truncado
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Formatea un objeto Date como una fecha legible
 * @param date - La fecha a formatear
 * @returns La fecha formateada (ejemplo: "25 de junio de 2025")
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

/**
 * Formatea un objeto Date como una hora legible
 * @param date - La fecha a formatear
 * @returns La hora formateada (ejemplo: "14:30")
 */
export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Formatea un objeto Date como una fecha y hora legible
 * @param date - La fecha a formatear
 * @returns La fecha y hora formateada (ejemplo: "25 de junio de 2025, 14:30")
 */
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
