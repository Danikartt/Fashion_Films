import React from 'react'

export type ComentarioItem = {
  id: string
  comentario: string
  fecha_comentario: string
  Usuarios?: { nombre: string } | null
}

export type CommentsModalProps = {
  isOpen: boolean
  filmTitle?: string
  commentsList: ComentarioItem[]
  loading: boolean
  onClose: () => void
  t: Record<string, string>
  theme: Record<string, string>
  isDarkMode: boolean
}

export default function CommentsModal({
  isOpen,
  filmTitle,
  commentsList,
  loading,
  onClose,
  t,
  theme,
  isDarkMode,
}: CommentsModalProps) {
  if (!isOpen) return null

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: 16,
  }

  const modalStyle: React.CSSProperties = {
    borderRadius: 8,
    padding: 24,
    width: '100%',
    maxWidth: 600,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  }

  const buttonStyle: React.CSSProperties = {
    padding: '8px 12px',
    borderRadius: 6,
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
  }

  return (
    <div
      data-testid="comments-modal-overlay"
      style={overlayStyle}
      onClick={onClose}
    >
      <div
        data-testid="comments-modal-content"
        style={{
          ...modalStyle,
          backgroundColor: theme.cardBackground || 'white',
          color: theme.text || '#333',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
          <h3
            data-testid="comments-modal-title"
            style={{
              margin: 0,
              fontFamily: 'Century Gothic, sans-serif',
              color: isDarkMode ? 'white' : theme.dark || '#1a202c',
            }}
          >
            {t.comentariosDe} {filmTitle}
          </h3>
          <button
            type="button"
            data-testid="close-comments-modal"
            onClick={onClose}
            style={{
              ...buttonStyle,
              width: 'auto',
              paddingInline: 12,
              backgroundColor: theme.dark || '#1a202c',
              color: isDarkMode ? '#1a202c' : 'white',
            }}
          >
            {t.cerrar}
          </button>
        </div>

        {loading ? (
          <p data-testid="comments-loading">{t.cargandoComentarios}</p>
        ) : commentsList.length === 0 ? (
          <p data-testid="no-comments">{t.noComentarios}</p>
        ) : (
          <div data-testid="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {commentsList.map((c) => (
              <div
                key={c.id}
                data-testid={`comment-item-${c.id}`}
                style={{
                  padding: 12,
                  backgroundColor: isDarkMode ? '#4a5568' : '#f7f4d5',
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                    fontSize: '0.85rem',
                    color: isDarkMode ? '#cbd5e0' : '#555',
                  }}
                >
                  <strong data-testid={`comment-author-${c.id}`}>
                    {c.Usuarios?.nombre || 'Usuario'}
                  </strong>
                  <span data-testid={`comment-date-${c.id}`}>
                    {new Date(c.fecha_comentario).toLocaleString()}
                  </span>
                </div>
                <p data-testid={`comment-text-${c.id}`} style={{ margin: 0 }}>
                  {c.comentario}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
