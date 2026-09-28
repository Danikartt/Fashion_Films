'use client'
import React, { useState, useMemo } from 'react'
import type { FashionFilm } from '../../lib/utils'
import { filterFilms } from '../../lib/utils'
import FilmCard from './FilmCard'

export type SearchableFilmListProps = {
  films: FashionFilm[]
  placeholder?: string
  noResultsText?: string
  onFilmClick: (filmId: string) => void
  selectedFilmId?: string | null
}

/**
 * Lista de films con buscador integrado.
 * Filtra en tiempo real por título, dirección, año y duración.
 */
export default function SearchableFilmList({
  films,
  placeholder = 'Buscar...',
  noResultsText = 'No se encontraron resultados.',
  onFilmClick,
  selectedFilmId = null,
}: SearchableFilmListProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => filterFilms(films, query), [films, query])

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        data-testid="search-input"
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '2px solid #000',
          marginBottom: '12px',
          boxSizing: 'border-box',
        }}
      />

      {filtered.length === 0 ? (
        <p data-testid="no-results">{noResultsText}</p>
      ) : (
        filtered.map((film) => (
          <FilmCard
            key={film.film_id}
            film={film}
            isSelected={film.film_id === selectedFilmId}
            onClick={onFilmClick}
          />
        ))
      )}
    </div>
  )
}
