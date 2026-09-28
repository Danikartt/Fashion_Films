/**
 * Convierte un link crudo de YouTube o Vimeo a su URL de embed.
 * Devuelve null si el link no es reconocido.
 */
export function toEmbedUrl(rawLink: string): string | null {
  try {
    const url = new URL(rawLink)

    // YouTube: https://www.youtube.com/watch?v=XXXX o /shorts/XXXX o youtu.be/XXXX
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.replace('/', '').trim()
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (url.hostname.includes('youtube.com')) {
      const shortsMatch = url.pathname.match(/\/shorts\/([^/]+)/)
      if (shortsMatch?.[1]) return `https://www.youtube.com/embed/${shortsMatch[1]}`

      const id = url.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    // Vimeo: https://vimeo.com/123456789
    if (url.hostname.includes('vimeo.com')) {
      const id = url.pathname.split('/').filter(Boolean)[0]
      return id ? `https://player.vimeo.com/video/${id}` : null
    }

    return null
  } catch {
    return null
  }
}

/**
 * Filtra una lista de FashionFilms por un término de búsqueda.
 * Busca en título, dirección, fecha de publicación y duración.
 */
export type FashionFilm = {
  film_id: string
  titulo: string
  direccion: string
  fecha_publicacion: string | null
  duracion: string | number | null
  link: string | null
  visualizaciones: number | null
  sinopsis?: string | null
}

export function filterFilms(films: FashionFilm[], query: string): FashionFilm[] {
  if (!query.trim()) return films
  const queryLower = query.toLowerCase()
  return films.filter((f) =>
    f.titulo.toLowerCase().includes(queryLower) ||
    f.direccion.toLowerCase().includes(queryLower) ||
    (f.fecha_publicacion && f.fecha_publicacion.toLowerCase().includes(queryLower)) ||
    (f.duracion && f.duracion.toString().toLowerCase().includes(queryLower))
  )
}

/**
 * Formatea la duración de minutos y segundos al formato mm'ss'' usado en la BD.
 */
export function formatDuration(minutes: string, seconds: string): string | null {
  if (!minutes.trim() && !seconds.trim()) return null
  const mins = minutes.trim() || '0'
  const secs = seconds.trim() || '0'
  return `${mins.padStart(2, '0')}'${secs.padStart(2, '0')}''`
}

/**
 * Valida que una contraseña tenga al menos 5 caracteres alfanuméricos sin símbolos y no contenga "admin".
 */
export function validarClave(password: string): boolean {
  const passwordTrimmed = password.trim()
  const passwordLower = passwordTrimmed.toLowerCase()

  if (passwordLower.includes('admin')) {
    return false
  }

  const regexClave = /^[a-zA-Z0-9]{5,}$/
  return regexClave.test(passwordTrimmed)
}

/**
 * Valida que un nombre de usuario no contenga "admin", no lleve números/signos y tenga uno o dos nombres.
 */
export function validarNombre(username: string): boolean {
  const usernameTrimmed = username.trim()
  const usernameLower = usernameTrimmed.toLowerCase()

  if (usernameLower.includes('admin')) {
    return false
  }

  const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)?$/
  return regexNombre.test(usernameTrimmed)
}

