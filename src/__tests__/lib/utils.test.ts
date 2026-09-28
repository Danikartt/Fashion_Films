/**
 * TEST DE LÓGICA PURA — src/lib/utils.ts
 * ========================================
 * 
 * POR QUÉ ESTE TEST:
 * Testea funciones puras (sin side-effects, sin dependencias externas).
 * No necesita mocks ni React: sólo entrada → salida esperada.
 * 
 * PATRÓN REUTILIZABLE:
 * - Importa directamente la función.
 * - Usa `describe` para agrupar por función.
 * - Cubre: casos normales, edge-cases y valores inválidos.
 * - NO mockees nada; si la función necesita mock, probablemente no es "lógica pura".
 */

import { describe, it, expect } from 'vitest'
import { toEmbedUrl, filterFilms, formatDuration, validarClave, validarNombre, type FashionFilm } from '../../lib/utils'
import { translations } from '../../lib/translations'


// ─────────────────────────────────────────────
// toEmbedUrl
// ─────────────────────────────────────────────
describe('toEmbedUrl', () => {
  it('convierte YouTube watch URL a embed', () => {
    const result = toEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    expect(result).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ')
  })

  it('convierte YouTube shorts URL a embed', () => {
    const result = toEmbedUrl('https://www.youtube.com/shorts/abc123')
    expect(result).toBe('https://www.youtube.com/embed/abc123')
  })

  it('convierte youtu.be short URL a embed', () => {
    const result = toEmbedUrl('https://youtu.be/dQw4w9WgXcQ')
    expect(result).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ')
  })

  it('convierte Vimeo URL a embed', () => {
    const result = toEmbedUrl('https://vimeo.com/123456789')
    expect(result).toBe('https://player.vimeo.com/video/123456789')
  })

  it('devuelve null para URLs desconocidas', () => {
    expect(toEmbedUrl('https://example.com/video')).toBeNull()
  })

  it('devuelve null para strings inválidos (no URL)', () => {
    expect(toEmbedUrl('esto no es un link')).toBeNull()
  })

  it('devuelve null para YouTube URL sin parámetro v', () => {
    expect(toEmbedUrl('https://www.youtube.com/watch')).toBeNull()
  })
})

// ─────────────────────────────────────────────
// filterFilms
// ─────────────────────────────────────────────
describe('filterFilms', () => {
  const mockFilms: FashionFilm[] = [
    {
      film_id: '1',
      titulo: 'Chanel No. 5',
      direccion: 'Jean-Pierre Jeunet',
      fecha_publicacion: '2004',
      duracion: "03'20''",
      link: 'https://youtube.com/watch?v=abc',
      visualizaciones: 100,
    },
    {
      film_id: '2',
      titulo: 'First Spring',
      direccion: 'Karl Lagerfeld',
      fecha_publicacion: '2015',
      duracion: "05'10''",
      link: null,
      visualizaciones: 50,
    },
    {
      film_id: '3',
      titulo: 'Reincarnation',
      direccion: 'Karl Lagerfeld',
      fecha_publicacion: '2014',
      duracion: "30'45''",
      link: 'https://vimeo.com/999',
      visualizaciones: 200,
    },
  ]

  it('devuelve todos los films si la búsqueda está vacía', () => {
    expect(filterFilms(mockFilms, '')).toHaveLength(3)
    expect(filterFilms(mockFilms, '   ')).toHaveLength(3)
  })

  it('filtra por título (case-insensitive)', () => {
    const result = filterFilms(mockFilms, 'chanel')
    expect(result).toHaveLength(1)
    expect(result[0].titulo).toBe('Chanel No. 5')
  })

  it('filtra por dirección', () => {
    const result = filterFilms(mockFilms, 'Lagerfeld')
    expect(result).toHaveLength(2)
  })

  it('filtra por año de publicación', () => {
    const result = filterFilms(mockFilms, '2015')
    expect(result).toHaveLength(1)
    expect(result[0].titulo).toBe('First Spring')
  })

  it('filtra por duración', () => {
    const result = filterFilms(mockFilms, "30'45")
    expect(result).toHaveLength(1)
    expect(result[0].titulo).toBe('Reincarnation')
  })

  it('devuelve array vacío si no hay coincidencias', () => {
    expect(filterFilms(mockFilms, 'ZZZ no existe')).toHaveLength(0)
  })
})

// ─────────────────────────────────────────────
// formatDuration
// ─────────────────────────────────────────────
describe('formatDuration', () => {
  it("formatea correctamente minutos y segundos: 3, 20 → 03'20''", () => {
    expect(formatDuration('3', '20')).toBe("03'20''")
  })

  it('devuelve null si ambos están vacíos', () => {
    expect(formatDuration('', '')).toBeNull()
    expect(formatDuration('   ', '  ')).toBeNull()
  })

  it("usa 0 si sólo se dan minutos: 5, '' → 05'00''", () => {
    expect(formatDuration('5', '')).toBe("05'00''")
  })

  it("usa 0 si sólo se dan segundos: '', 30 → 00'30''", () => {
    expect(formatDuration('', '30')).toBe("00'30''")
  })
})

// ─────────────────────────────────────────────
// validarClave
// ─────────────────────────────────────────────
describe('validarClave', () => {
  it('acepta claves válidas con al menos 5 caracteres alfanuméricos', () => {
    expect(validarClave('pass123')).toBe(true)
    expect(validarClave('Secret5')).toBe(true)
    expect(validarClave('123456')).toBe(true)
  })

  it('rechaza claves con menos de 5 caracteres', () => {
    expect(validarClave('1234')).toBe(false)
    expect(validarClave('abc')).toBe(false)
  })

  it('rechaza claves que contengan "admin" (case-insensitive)', () => {
    expect(validarClave('admin123')).toBe(false)
    expect(validarClave('SuperAdmin')).toBe(false)
  })

  it('rechaza claves con símbolos o espacios', () => {
    expect(validarClave('pass!123')).toBe(false)
    expect(validarClave('hello world')).toBe(false)
  })
})

// ─────────────────────────────────────────────
// validarNombre
// ─────────────────────────────────────────────
describe('validarNombre', () => {
  it('acepta nombres válidos de uno o dos términos con letras o tildes', () => {
    expect(validarNombre('Juan')).toBe(true)
    expect(validarNombre('María Carmen')).toBe(true)
    expect(validarNombre('Íñigo')).toBe(true)
  })

  it('rechaza nombres que contengan "admin" (case-insensitive)', () => {
    expect(validarNombre('admin')).toBe(false)
    expect(validarNombre('Juan Admin')).toBe(false)
  })

  it('rechaza nombres con números, símbolos o más de dos palabras', () => {
    expect(validarNombre('Juan123')).toBe(false)
    expect(validarNombre('Juan!')).toBe(false)
    expect(validarNombre('Juan Carlos Perez')).toBe(false)
  })
})

// ─────────────────────────────────────────────
// translations (integridad)
// ─────────────────────────────────────────────
describe('translations', () => {
  it('contiene las mismas claves de traducción tanto en español (es) como en inglés (en)', () => {
    const esKeys = Object.keys(translations.es).sort()
    const enKeys = Object.keys(translations.en).sort()

    expect(esKeys).toEqual(enKeys)
  })

  it('ninguna clave de traducción está vacía', () => {
    Object.entries(translations.es).forEach(([key, val]) => {
      expect(val, `Clave 'es.${key}' no debe estar vacía`).toBeTruthy()
    })
    Object.entries(translations.en).forEach(([key, val]) => {
      expect(val, `Clave 'en.${key}' no debe estar vacía`).toBeTruthy()
    })
  })
})

