import { supabase } from './supabase'
import type { FashionFilm } from './utils'

/**
 * Obtiene todos los FashionFilms de Supabase, ordenados por título ascendente.
 * Devuelve { data, error } para que el componente maneje ambos casos.
 */
export async function fetchFashionFilms(): Promise<{
  data: FashionFilm[]
  error: string | null
}> {
  const { data, error } = await supabase
    .from('FashionFilms')
    .select('film_id, titulo, direccion, fecha_publicacion, duracion, link, visualizaciones, sinopsis')
    .order('titulo', { ascending: true })

  if (error) {
    return { data: [], error: error.message }
  }

  return { data: (data ?? []) as FashionFilm[], error: null }
}

/**
 * Obtiene los IDs de los films favoritos de un usuario.
 */
export async function fetchFavoriteFilmIds(usuarioId: string): Promise<{
  filmIds: string[]
  error: string | null
}> {
  const { data, error } = await supabase
    .from('AccionUsuario')
    .select('film_id')
    .eq('usuario_id', usuarioId)
    .eq('favorito', true)

  if (error) {
    return { filmIds: [], error: error.message }
  }

  const filmIds = Array.from(
    new Set((data ?? []).map((a) => a.film_id).filter(Boolean))
  ) as string[]

  return { filmIds, error: null }
}

/**
 * Obtiene los FashionFilms favoritos de un usuario.
 */
export async function fetchFavoriteFilms(usuarioId: string): Promise<{
  data: FashionFilm[]
  error: string | null
}> {
  const { filmIds, error: idsError } = await fetchFavoriteFilmIds(usuarioId)

  if (idsError) return { data: [], error: idsError }
  if (filmIds.length === 0) return { data: [], error: null }

  const { data, error } = await supabase
    .from('FashionFilms')
    .select('film_id, titulo, direccion, fecha_publicacion, duracion, link, visualizaciones, sinopsis')
    .in('film_id', filmIds)
    .order('fecha_publicacion', { ascending: false })

  if (error) {
    return { data: [], error: error.message }
  }

  return { data: (data ?? []) as FashionFilm[], error: null }
}

/**
 * Incrementa las visualizaciones de un FashionFilm en +1 y devuelve el objeto actualizado.
 */
export async function incrementarVisualizaciones(
  filmId: string,
  currentViews: number
): Promise<{
  data: { film_id: string; visualizaciones: number } | null
  error: string | null
}> {
  const next = currentViews + 1
  const { data, error } = await supabase
    .from('FashionFilms')
    .update({ visualizaciones: next })
    .eq('film_id', filmId)
    .select('film_id, visualizaciones')
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data as { film_id: string; visualizaciones: number }, error: null }
}

export type ComentarioConUsuario = {
  id: string
  comentario: string
  fecha_comentario: string
  Usuarios?: { nombre: string } | null
}

/**
 * Obtiene los comentarios de un FashionFilm incluyendo el nombre del usuario (join).
 */
export async function cargarComentarios(filmId: string): Promise<{
  data: ComentarioConUsuario[]
  error: string | null
}> {
  const { data, error } = await supabase
    .from('Comentarios')
    .select('id, comentario, fecha_comentario, Usuarios(nombre)')
    .eq('film_id', filmId)
    .order('fecha_comentario', { ascending: false })

  if (error) {
    return { data: [], error: error.message }
  }

  return { data: (data ?? []) as unknown as ComentarioConUsuario[], error: null }
}

/**
 * Guarda un nuevo comentario de un usuario en un FashionFilm.
 */
export async function guardarNuevoComentario(
  usuarioId: string,
  filmId: string,
  comentarioText: string
): Promise<{
  success: boolean
  error: string | null
}> {
  const trimmed = comentarioText.trim()
  if (!trimmed) {
    return { success: false, error: 'El comentario no puede estar vacío.' }
  }

  const { error } = await supabase
    .from('Comentarios')
    .insert([
      {
        usuario_id: usuarioId,
        film_id: filmId,
        comentario: trimmed,
      },
    ])

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}

