/**
 * TEST DE ACCESO A DATOS — src/lib/data.ts (con Supabase mockeado)
 * ==================================================================
 * 
 * POR QUÉ ESTE TEST:
 * Verifica que las funciones de acceso a datos (fetchFashionFilms, etc.)
 * transforman correctamente las respuestas de Supabase sin hacer llamadas
 * reales a la API. Mockeamos el módulo `../supabase` completo con vi.mock().
 * 
 * PATRÓN REUTILIZABLE:
 * 1. vi.mock('../supabase', ...) → reemplaza el módulo real por un mock.
 * 2. Se crea un objeto `mockSupabase` con la API de builder-pattern de Supabase:
 *    from().select().order().eq().in().limit().maybeSingle()
 * 3. Cada test configura las respuestas antes de llamar a la función.
 * 4. Se verifica que la función devuelve { data, error } correctamente.
 * 
 * IMPORTANTE:
 * - vi.mock() se hoistea al top del archivo por Vitest (como jest.mock).
 * - El mock factory NO puede acceder a variables del scope del test.
 *   Por eso el mock se define DENTRO del factory con vi.hoisted().
 * - El mock usa un patrón de "chainable builder" donde cada método devuelve
 *   el mismo objeto `mockChain`, excepto el último que resuelve la Promise.
 * - beforeEach resetea los mocks para evitar interferencia entre tests.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─────────────────────────────────────────────
// vi.hoisted: variables accesibles desde el vi.mock factory
// ─────────────────────────────────────────────
const { mockChain, mockFrom, mockResolve } = vi.hoisted(() => {
  // Almacén de la respuesta simulada
  let _data: any = null
  let _error: any = null

  const mockResolve = {
    set(data: any, error: any) {
      _data = data
      _error = error
    },
    reset() {
      _data = null
      _error = null
    },
  }

  // Chain con API fluida que simula el query builder de Supabase
  const chain: Record<string, any> = {}
  const self = () => chain

  chain.select = vi.fn(self)
  chain.order = vi.fn(self)
  chain.eq = vi.fn(self)
  chain.in = vi.fn(self)
  chain.limit = vi.fn(self)
  chain.update = vi.fn(self)
  chain.insert = vi.fn(self)
  chain.single = vi.fn(() => Promise.resolve({ data: _data, error: _error }))
  chain.maybeSingle = vi.fn(() => Promise.resolve({ data: _data, error: _error }))


  // Hacemos el chain "thenable" para que `await supabase.from(...).select(...)` resuelva
  Object.defineProperty(chain, 'then', {
    get() {
      return (resolve: any, reject: any) =>
        Promise.resolve({ data: _data, error: _error }).then(resolve, reject)
    },
  })

  const mockFrom = vi.fn(() => chain)

  return { mockChain: chain, mockFrom, mockResolve }
})

// ─────────────────────────────────────────────
// Mock del módulo Supabase
// ─────────────────────────────────────────────
vi.mock('../../lib/supabase', () => ({
  supabase: { from: mockFrom },
}))

// Importamos DESPUÉS del vi.mock (Vitest lo reordena automáticamente)
import {
  fetchFashionFilms,
  fetchFavoriteFilmIds,
  incrementarVisualizaciones,
  cargarComentarios,
  guardarNuevoComentario,
} from '../../lib/data'

// ─────────────────────────────────────────────
// Reset entre tests
// ─────────────────────────────────────────────
beforeEach(() => {
  vi.clearAllMocks()
  mockResolve.reset()
})

// ─────────────────────────────────────────────
// fetchFashionFilms
// ─────────────────────────────────────────────
describe('fetchFashionFilms', () => {
  it('devuelve la lista de films cuando Supabase responde correctamente', async () => {
    // Configuramos la respuesta simulada
    mockResolve.set(
      [
        {
          film_id: '1',
          titulo: 'Test Film',
          direccion: 'Test Director',
          fecha_publicacion: '2024',
          duracion: "03'20''",
          link: 'https://youtube.com/watch?v=test',
          visualizaciones: 10,
          sinopsis: 'Test synopsis',
        },
        {
          film_id: '2',
          titulo: 'Another Film',
          direccion: 'Another Director',
          fecha_publicacion: '2023',
          duracion: null,
          link: null,
          visualizaciones: 0,
          sinopsis: null,
        },
      ],
      null // sin error
    )

    const result = await fetchFashionFilms()

    // Verificamos la estructura de la respuesta
    expect(result.error).toBeNull()
    expect(result.data).toHaveLength(2)
    expect(result.data[0].titulo).toBe('Test Film')
    expect(result.data[1].titulo).toBe('Another Film')

    // Verificamos que se llamó a Supabase con los parámetros correctos
    expect(mockFrom).toHaveBeenCalledWith('FashionFilms')
    expect(mockChain.select).toHaveBeenCalledWith(
      'film_id, titulo, direccion, fecha_publicacion, duracion, link, visualizaciones, sinopsis'
    )
    expect(mockChain.order).toHaveBeenCalledWith('titulo', { ascending: true })
  })

  it('devuelve error cuando Supabase falla', async () => {
    mockResolve.set(null, { message: 'Connection refused' })

    const result = await fetchFashionFilms()

    expect(result.data).toEqual([])
    expect(result.error).toBe('Connection refused')
  })

  it('devuelve array vacío cuando data es null (sin error)', async () => {
    mockResolve.set(null, null)

    const result = await fetchFashionFilms()

    expect(result.data).toEqual([])
    expect(result.error).toBeNull()
  })
})

// ─────────────────────────────────────────────
// fetchFavoriteFilmIds
// ─────────────────────────────────────────────
describe('fetchFavoriteFilmIds', () => {
  it('devuelve los IDs de films favoritos del usuario', async () => {
    mockResolve.set(
      [
        { film_id: 'f1' },
        { film_id: 'f2' },
        { film_id: 'f1' }, // duplicado intencional
      ],
      null
    )

    const result = await fetchFavoriteFilmIds('user-123')

    // Verifica que elimina duplicados
    expect(result.filmIds).toEqual(['f1', 'f2'])
    expect(result.error).toBeNull()

    // Verifica los filtros de la query
    expect(mockFrom).toHaveBeenCalledWith('AccionUsuario')
    expect(mockChain.eq).toHaveBeenCalledWith('usuario_id', 'user-123')
    expect(mockChain.eq).toHaveBeenCalledWith('favorito', true)
  })

  it('devuelve array vacío y error cuando Supabase falla', async () => {
    mockResolve.set(null, { message: 'Unauthorized' })

    const result = await fetchFavoriteFilmIds('user-123')

    expect(result.filmIds).toEqual([])
    expect(result.error).toBe('Unauthorized')
  })
})

// ─────────────────────────────────────────────
// incrementarVisualizaciones
// ─────────────────────────────────────────────
describe('incrementarVisualizaciones', () => {
  it('incrementa el contador de visualizaciones en +1 en la BD y devuelve la respuesta', async () => {
    mockResolve.set({ film_id: 'film-456', visualizaciones: 11 }, null)

    const result = await incrementarVisualizaciones('film-456', 10)

    expect(result.error).toBeNull()
    expect(result.data).toEqual({ film_id: 'film-456', visualizaciones: 11 })

    expect(mockFrom).toHaveBeenCalledWith('FashionFilms')
    expect(mockChain.update).toHaveBeenCalledWith({ visualizaciones: 11 })
    expect(mockChain.eq).toHaveBeenCalledWith('film_id', 'film-456')
    expect(mockChain.select).toHaveBeenCalledWith('film_id, visualizaciones')
    expect(mockChain.single).toHaveBeenCalled()
  })

  it('devuelve error cuando la actualización en Supabase falla', async () => {
    mockResolve.set(null, { message: 'Database error' })

    const result = await incrementarVisualizaciones('film-456', 5)

    expect(result.data).toBeNull()
    expect(result.error).toBe('Database error')
  })
})

// ─────────────────────────────────────────────
// cargarComentarios
// ─────────────────────────────────────────────
describe('cargarComentarios', () => {
  it('obtiene los comentarios con join de Usuarios(nombre) ordenados por fecha', async () => {
    const mockComentariosData = [
      {
        id: 'c1',
        comentario: 'Hermoso corto.',
        fecha_comentario: '2024-05-10T12:00:00.000Z',
        Usuarios: { nombre: 'Ana' },
      },
      {
        id: 'c2',
        comentario: 'Me encantó el vestuario.',
        fecha_comentario: '2024-05-09T10:00:00.000Z',
        Usuarios: { nombre: 'Luis' },
      },
    ]

    mockResolve.set(mockComentariosData, null)

    const result = await cargarComentarios('film-123')

    expect(result.error).toBeNull()
    expect(result.data).toHaveLength(2)
    expect(result.data[0].Usuarios?.nombre).toBe('Ana')

    expect(mockFrom).toHaveBeenCalledWith('Comentarios')
    expect(mockChain.select).toHaveBeenCalledWith('id, comentario, fecha_comentario, Usuarios(nombre)')
    expect(mockChain.eq).toHaveBeenCalledWith('film_id', 'film-123')
    expect(mockChain.order).toHaveBeenCalledWith('fecha_comentario', { ascending: false })
  })

  it('devuelve array vacío si la consulta falla', async () => {
    mockResolve.set(null, { message: 'Table not found' })

    const result = await cargarComentarios('film-123')

    expect(result.data).toEqual([])
    expect(result.error).toBe('Table not found')
  })
})

// ─────────────────────────────────────────────
// guardarNuevoComentario
// ─────────────────────────────────────────────
describe('guardarNuevoComentario', () => {
  it('inserta el comentario correctamente en la BD', async () => {
    mockResolve.set(null, null)

    const result = await guardarNuevoComentario('user-1', 'film-123', 'Gran trabajo audiovisual')

    expect(result.success).toBe(true)
    expect(result.error).toBeNull()

    expect(mockFrom).toHaveBeenCalledWith('Comentarios')
    expect(mockChain.insert).toHaveBeenCalledWith([
      {
        usuario_id: 'user-1',
        film_id: 'film-123',
        comentario: 'Gran trabajo audiovisual',
      },
    ])
  })

  it('devuelve error si el comentario está vacío', async () => {
    const result = await guardarNuevoComentario('user-1', 'film-123', '   ')

    expect(result.success).toBe(false)
    expect(result.error).toBe('El comentario no puede estar vacío.')
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it('devuelve success false y error cuando Supabase falla al insertar', async () => {
    mockResolve.set(null, { message: 'Constraint failure' })

    const result = await guardarNuevoComentario('user-1', 'film-123', 'Comentario válido')

    expect(result.success).toBe(false)
    expect(result.error).toBe('Constraint failure')
  })
})

