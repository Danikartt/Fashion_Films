'use client'
import React from 'react'
import type { FashionFilm } from '../../lib/utils'

export type FilmCardProps = {
  film: FashionFilm
  isSelected: boolean
  onClick: (filmId: string) => void
}

/**
 * Tarjeta de película — muestra título, dirección, fecha y duración.
 * Componente extraído de la tabla de page.tsx para permitir testing aislado.
 */
export default function FilmCard({ film, isSelected, onClick }: FilmCardProps) {
  return (
    <div
      data-testid={`film-card-${film.film_id}`}
      role="article"
      onClick={() => onClick(film.film_id)}
      style={{
        padding: '16px',
        border: `2px solid ${isSelected ? '#105666' : '#000'}`,
        backgroundColor: isSelected ? '#eef5ff' : 'white',
        cursor: 'pointer',
        marginBottom: '8px',
      }}
    >
      <h3 data-testid="film-title" style={{ margin: '0 0 8px 0' }}>
        {film.titulo}
      </h3>
      <p data-testid="film-direction" style={{ margin: '0 0 4px 0', color: '#555' }}>
        {film.direccion}
      </p>
      <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#888' }}>
        <span data-testid="film-year">
          {film.fecha_publicacion ?? '-'}
        </span>
        <span data-testid="film-duration">
          {film.duracion ?? '-'}
        </span>
      </div>
      {film.sinopsis && (
        <p data-testid="film-sinopsis" style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
          {film.sinopsis}
        </p>
      )}
    </div>
  )
}
