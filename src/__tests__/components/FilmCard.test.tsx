/**
 * TEST DE COMPONENTE DE UI — FilmCard + SearchableFilmList
 * =========================================================
 * 
 * POR QUÉ ESTE TEST:
 * Verifica que los componentes de React renderizan los datos correctos
 * y responden a la interacción del usuario. Usa jsdom como entorno
 * (configurado en vitest.config.ts) y React Testing Library para
 * renderizar y simular interacción.
 * 
 * PATRÓN REUTILIZABLE:
 * - render(): renderiza el componente en jsdom.
 * - screen.getByTestId / screen.getByText: localiza elementos.
 * - userEvent: simula interacciones reales (typing, clicks).
 * - vi.fn(): crea callbacks espiados para verificar llamadas.
 * - NO mockees Supabase aquí; estos componentes reciben datos por props.
 *   Si un componente hace fetch interno, ese test va en la capa de datos.
 * 
 * ASSERTIONS CLAVE:
 * - toBeInTheDocument(): verifica presencia en el DOM.
 * - toHaveTextContent(): verifica contenido de texto.
 * - toHaveBeenCalledWith(): verifica argumentos de callbacks.
 * - waitFor(): espera actualizaciones asíncronas del DOM.
 */

import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FilmCard from '../../app/components/FilmCard'
import SearchableFilmList from '../../app/components/SearchableFilmList'
import type { FashionFilm } from '../../lib/utils'

// ─────────────────────────────────────────────
// Datos de prueba compartidos
// ─────────────────────────────────────────────
const sampleFilm: FashionFilm = {
  film_id: 'f1',
  titulo: 'The Tale of a Fairy',
  direccion: 'Karl Lagerfeld',
  fecha_publicacion: '2011',
  duracion: "16'00''",
  link: 'https://www.youtube.com/watch?v=test123',
  visualizaciones: 42,
  sinopsis: 'Un cuento de hadas ambientado en un castillo francés.',
}

const sampleFilms: FashionFilm[] = [
  sampleFilm,
  {
    film_id: 'f2',
    titulo: 'Bleu de Chanel',
    direccion: 'Martin Scorsese',
    fecha_publicacion: '2018',
    duracion: "01'30''",
    link: null,
    visualizaciones: 300,
  },
  {
    film_id: 'f3',
    titulo: 'Kenzo World',
    direccion: 'Spike Jonze',
    fecha_publicacion: '2016',
    duracion: "03'52''",
    link: 'https://vimeo.com/555',
    visualizaciones: 1200,
  },
]

// ─────────────────────────────────────────────
// FilmCard
// ─────────────────────────────────────────────
describe('FilmCard', () => {
  it('renderiza título, dirección, año y duración correctamente', () => {
    render(<FilmCard film={sampleFilm} isSelected={false} onClick={() => {}} />)

    expect(screen.getByTestId('film-title')).toHaveTextContent('The Tale of a Fairy')
    expect(screen.getByTestId('film-direction')).toHaveTextContent('Karl Lagerfeld')
    expect(screen.getByTestId('film-year')).toHaveTextContent('2011')
    expect(screen.getByTestId('film-duration')).toHaveTextContent("16'00''")
  })

  it('renderiza la sinopsis cuando existe', () => {
    render(<FilmCard film={sampleFilm} isSelected={false} onClick={() => {}} />)

    expect(screen.getByTestId('film-sinopsis')).toHaveTextContent('Un cuento de hadas')
  })

  it('no renderiza la sinopsis cuando es null', () => {
    const filmSinSinopsis = { ...sampleFilm, sinopsis: null }
    render(<FilmCard film={filmSinSinopsis} isSelected={false} onClick={() => {}} />)

    expect(screen.queryByTestId('film-sinopsis')).not.toBeInTheDocument()
  })

  it('muestra guión (-) cuando fecha_publicacion o duracion es null', () => {
    const filmIncompleto = { ...sampleFilm, fecha_publicacion: null, duracion: null }
    render(<FilmCard film={filmIncompleto} isSelected={false} onClick={() => {}} />)

    expect(screen.getByTestId('film-year')).toHaveTextContent('-')
    expect(screen.getByTestId('film-duration')).toHaveTextContent('-')
  })

  it('llama a onClick con el film_id al hacer click', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<FilmCard film={sampleFilm} isSelected={false} onClick={handleClick} />)

    await user.click(screen.getByTestId(`film-card-${sampleFilm.film_id}`))
    expect(handleClick).toHaveBeenCalledOnce()
    expect(handleClick).toHaveBeenCalledWith('f1')
  })
})

// ─────────────────────────────────────────────
// SearchableFilmList (integración UI)
// ─────────────────────────────────────────────
describe('SearchableFilmList', () => {
  it('renderiza todos los films inicialmente', () => {
    render(<SearchableFilmList films={sampleFilms} onFilmClick={() => {}} />)

    expect(screen.getByText('The Tale of a Fairy')).toBeInTheDocument()
    expect(screen.getByText('Bleu de Chanel')).toBeInTheDocument()
    expect(screen.getByText('Kenzo World')).toBeInTheDocument()
  })

  it('filtra los films al escribir en el buscador', async () => {
    const user = userEvent.setup()
    render(<SearchableFilmList films={sampleFilms} onFilmClick={() => {}} />)

    const searchInput = screen.getByTestId('search-input')
    await user.type(searchInput, 'Kenzo')

    // Sólo Kenzo World debería ser visible
    expect(screen.getByText('Kenzo World')).toBeInTheDocument()
    expect(screen.queryByText('The Tale of a Fairy')).not.toBeInTheDocument()
    expect(screen.queryByText('Bleu de Chanel')).not.toBeInTheDocument()
  })

  it('muestra mensaje de "no resultados" cuando el filtro no coincide', async () => {
    const user = userEvent.setup()
    render(
      <SearchableFilmList
        films={sampleFilms}
        onFilmClick={() => {}}
        noResultsText="No se encontraron resultados."
      />
    )

    await user.type(screen.getByTestId('search-input'), 'ZZZZZ')
    expect(screen.getByTestId('no-results')).toHaveTextContent('No se encontraron resultados.')
  })

  it('restaura la lista completa al borrar el texto de búsqueda', async () => {
    const user = userEvent.setup()
    render(<SearchableFilmList films={sampleFilms} onFilmClick={() => {}} />)

    const searchInput = screen.getByTestId('search-input')
    await user.type(searchInput, 'Kenzo')
    expect(screen.queryByText('Bleu de Chanel')).not.toBeInTheDocument()

    await user.clear(searchInput)
    expect(screen.getByText('Bleu de Chanel')).toBeInTheDocument()
    expect(screen.getByText('Kenzo World')).toBeInTheDocument()
    expect(screen.getByText('The Tale of a Fairy')).toBeInTheDocument()
  })
})
