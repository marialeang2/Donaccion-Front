// utils/ImageUtils.js

// Imágenes predeterminadas disponibles
const defaultImages = {
  foundations: [
    '/images/default-enterprise.png',
    '/images/Fundation1.jpg',
    '/images/Fundation2.jpg',
    '/images/Fundation3.jpg',
    '/images/Fundation4.jpg',
    '/images/Fundation5.jpg',
    '/images/Fundation6.jpg'
  ],
  opportunities: [
    '/images/voluntariado_default.png',
    '/images/Voluntareado1.jpg',
    '/images/Voluntareado2.jpg',
    '/images/Voluntareado3.jpg',
    '/images/Voluntareado4.jpg'
  ],
  hero: [
    '/images/hero.jpg',
    '/images/hero2.jpg'
  ],
  profile: '/images/default-profile.png',
  donations: [
    '/images/donacion_default.png',
    '/images/donaciones-1.avif',
    '/images/donaciones-2.jpg'
  ],
  about: [
    '/images/Sobre-noosotro-1.jpg',
    '/images/Sobre-Nosotros-2.webp'
  ],
  vision: [
    '/images/vision.jpg',
    '/images/vision-2.webp'
  ]
};

/**
 * Obtiene una imagen predeterminada para un tipo específico
 * @param {string} type - Tipo de imagen (foundations, opportunities, etc.)
 * @param {string|number} index - Índice específico o 'random' para aleatorio
 * @returns {string} URL de la imagen
 */
export const getDefaultImage = (type, index = 0) => {
  const images = defaultImages[type];
  
  if (!images) {
    console.warn(`Tipo de imagen no encontrado: ${type}`);
    return '/images/default-enterprise.png'; // Fallback general
  }
  
  // Si es un string (como profile), devolverlo directamente
  if (typeof images === 'string') {
    return images;
  }
  
  // Si es un array, obtener el índice específico o aleatorio
  if (Array.isArray(images)) {
    if (index === 'random') {
      const randomIndex = Math.floor(Math.random() * images.length);
      return images[randomIndex];
    }
    
    // Asegurar que el índice esté dentro del rango
    const safeIndex = Math.max(0, Math.min(index, images.length - 1));
    return images[safeIndex];
  }
  
  return images;
};

/**
 * Obtiene una imagen con fallback inteligente
 * @param {string} imageUrl - URL de la imagen del backend
 * @param {string} type - Tipo de imagen para el fallback
 * @param {string|number} index - Índice específico o 'random'
 * @returns {string} URL de la imagen final
 */
export const getImageWithFallback = (imageUrl, type, index = 0) => {
  // Si hay una imagen del backend y no está vacía, usarla
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl;
  }
  
  // Si no hay imagen del backend, usar imagen predeterminada
  return getDefaultImage(type, index);
};

/**
 * Obtiene múltiples imágenes aleatorias del mismo tipo
 * @param {string} type - Tipo de imagen
 * @param {number} count - Cantidad de imágenes a obtener
 * @returns {string[]} Array de URLs de imágenes
 */
export const getRandomImages = (type, count = 1) => {
  const images = defaultImages[type];
  
  if (!Array.isArray(images)) {
    return Array(count).fill(getDefaultImage(type));
  }
  
  const result = [];
  const shuffled = [...images].sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < count; i++) {
    result.push(shuffled[i % shuffled.length]);
  }
  
  return result;
};

/**
 * Obtiene una imagen específica por ID para consistencia
 * @param {string} type - Tipo de imagen
 * @param {string} id - ID del elemento (para generar índice consistente)
 * @returns {string} URL de la imagen
 */
export const getConsistentImage = (type, id) => {
  const images = defaultImages[type];
  
  if (!Array.isArray(images)) {
    return getDefaultImage(type);
  }
  
  // Generar un índice consistente basado en el ID
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a 32-bit integer
  }
  
  const index = Math.abs(hash) % images.length;
  return images[index];
};

// Exportar todas las imágenes disponibles para referencia
export { defaultImages };