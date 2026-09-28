import React from 'react'

export type NewFilmFormProps = {
  nuevoTitulo: string
  setNuevoTitulo: (val: string) => void
  nuevaDireccion: string
  setNuevaDireccion: (val: string) => void
  nuevoAnio: string
  setNuevoAnio: (val: string) => void
  nuevoMinutos: string
  setNuevoMinutos: (val: string) => void
  nuevoSegundos: string
  setNuevoSegundos: (val: string) => void
  nuevoLink: string
  setNuevoLink: (val: string) => void
  nuevaSinopsis: string
  setNuevaSinopsis: (val: string) => void
  guardandoFilm: boolean
  onSave: () => void
  t: Record<string, string>
  theme: Record<string, string>
  isDarkMode: boolean
}

export default function NewFilmForm({
  nuevoTitulo,
  setNuevoTitulo,
  nuevaDireccion,
  setNuevaDireccion,
  nuevoAnio,
  setNuevoAnio,
  nuevoMinutos,
  setNuevoMinutos,
  nuevoSegundos,
  setNuevoSegundos,
  nuevoLink,
  setNuevoLink,
  nuevaSinopsis,
  setNuevaSinopsis,
  guardandoFilm,
  onSave,
  t,
  theme,
  isDarkMode,
}: NewFilmFormProps) {
  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 4,
    fontSize: '0.85rem',
    fontWeight: 'bold',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    fontSize: '0.9rem',
  }

  const buttonStyle: React.CSSProperties = {
    padding: '10px 16px',
    borderRadius: 6,
    border: 'none',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  }

  return (
    <div
      data-testid="new-film-form"
      style={{
        background: theme.accent || '#eef2f7',
        padding: 20,
        borderRadius: 8,
        marginBottom: 20,
        border: `2px solid ${theme.primary || '#3182ce'}`,
      }}
    >
      <h3
        data-testid="form-title"
        style={{
          margin: '0 0 16px',
          fontFamily: 'Century Gothic, sans-serif',
          color: isDarkMode ? 'white' : theme.dark || '#1a202c',
        }}
      >
        {t.nuevoFilm}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={{ ...labelStyle, color: isDarkMode ? '#cbd5e0' : '#666' }}>
            {t.titulo} *
          </label>
          <input
            type="text"
            data-testid="input-titulo"
            value={nuevoTitulo}
            onChange={(e) => setNuevoTitulo(e.target.value)}
            style={{
              ...inputStyle,
              backgroundColor: isDarkMode ? '#4a5568' : 'white',
              color: theme.text || '#333',
              borderColor: theme.border || '#ccc',
            }}
            placeholder="Ej: Fashion Film 2024"
            disabled={guardandoFilm}
          />
        </div>

        <div>
          <label style={{ ...labelStyle, color: isDarkMode ? '#cbd5e0' : '#666' }}>
            {t.direccion} *
          </label>
          <input
            type="text"
            data-testid="input-direccion"
            value={nuevaDireccion}
            onChange={(e) => setNuevaDireccion(e.target.value)}
            style={{
              ...inputStyle,
              backgroundColor: isDarkMode ? '#4a5568' : 'white',
              color: theme.text || '#333',
              borderColor: theme.border || '#ccc',
            }}
            placeholder="Ej: John Doe"
            disabled={guardandoFilm}
          />
        </div>

        <div>
          <label style={{ ...labelStyle, color: isDarkMode ? '#cbd5e0' : '#666' }}>
            {t.anio}
          </label>
          <input
            type="text"
            data-testid="input-anio"
            value={nuevoAnio}
            onChange={(e) => setNuevoAnio(e.target.value)}
            style={{
              ...inputStyle,
              backgroundColor: isDarkMode ? '#4a5568' : 'white',
              color: theme.text || '#333',
              borderColor: theme.border || '#ccc',
            }}
            placeholder="Ej: 2024"
            disabled={guardandoFilm}
          />
        </div>

        <div>
          <label style={{ ...labelStyle, color: isDarkMode ? '#cbd5e0' : '#666' }}>
            {t.duracion}
          </label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="number"
              min="0"
              max="59"
              data-testid="input-minutos"
              value={nuevoMinutos}
              onChange={(e) => setNuevoMinutos(e.target.value)}
              style={{
                ...inputStyle,
                width: '80px',
                backgroundColor: isDarkMode ? '#4a5568' : 'white',
                color: theme.text || '#333',
                borderColor: theme.border || '#ccc',
              }}
              placeholder="MM"
              disabled={guardandoFilm}
            />
            <span style={{ fontSize: 18, fontWeight: 'bold', color: theme.text || '#333' }}>:</span>
            <input
              type="number"
              min="0"
              max="59"
              data-testid="input-segundos"
              value={nuevoSegundos}
              onChange={(e) => setNuevoSegundos(e.target.value)}
              style={{
                ...inputStyle,
                width: '80px',
                backgroundColor: isDarkMode ? '#4a5568' : 'white',
                color: theme.text || '#333',
                borderColor: theme.border || '#ccc',
              }}
              placeholder="SS"
              disabled={guardandoFilm}
            />
          </div>
        </div>

        <div>
          <label style={{ ...labelStyle, color: isDarkMode ? '#cbd5e0' : '#666' }}>
            {t.link}
          </label>
          <input
            type="url"
            data-testid="input-link"
            value={nuevoLink}
            onChange={(e) => setNuevoLink(e.target.value)}
            style={{
              ...inputStyle,
              backgroundColor: isDarkMode ? '#4a5568' : 'white',
              color: theme.text || '#333',
              borderColor: theme.border || '#ccc',
            }}
            placeholder="Ej: https://www.youtube.com/watch?v=..."
            disabled={guardandoFilm}
          />
        </div>

        <div>
          <label style={{ ...labelStyle, color: isDarkMode ? '#cbd5e0' : '#666' }}>
            {t.sinopsis}
          </label>
          <textarea
            data-testid="input-sinopsis"
            value={nuevaSinopsis}
            onChange={(e) => setNuevaSinopsis(e.target.value)}
            style={{
              ...inputStyle,
              backgroundColor: isDarkMode ? '#4a5568' : 'white',
              color: theme.text || '#333',
              borderColor: theme.border || '#ccc',
              minHeight: '80px',
              resize: 'vertical',
            }}
            placeholder="Ej: Breve descripción del fashion film..."
            disabled={guardandoFilm}
          />
        </div>

        <button
          onClick={onSave}
          data-testid="submit-film-button"
          style={{
            ...buttonStyle,
            backgroundColor: guardandoFilm ? theme.disabled || '#a0aec0' : theme.success || '#38a169',
            cursor: guardandoFilm ? 'not-allowed' : 'pointer',
            color: 'white',
          }}
          disabled={guardandoFilm}
          type="button"
        >
          {guardandoFilm ? t.guardando : t.guardar}
        </button>
      </div>
    </div>
  )
}
