import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CommentsModal, { type ComentarioItem } from '../../app/components/CommentsModal'
import { translations } from '../../lib/translations'

describe('CommentsModal', () => {
  const dummyComments: ComentarioItem[] = [
    {
      id: 'c1',
      comentario: '¡Excelente dirección artística!',
      fecha_comentario: '2024-05-10T12:00:00.000Z',
      Usuarios: { nombre: 'María' },
    },
    {
      id: 'c2',
      comentario: 'La iluminación es espectacular.',
      fecha_comentario: '2024-05-11T14:30:00.000Z',
      Usuarios: { nombre: 'Carlos' },
    },
  ]

  const defaultProps = {
    isOpen: true,
    filmTitle: 'The Tale of a Fairy',
    commentsList: dummyComments,
    loading: false,
    onClose: vi.fn(),
    t: translations.es,
    theme: { cardBackground: 'white', text: '#333', dark: '#1a202c' },
    isDarkMode: false,
  }

  it('no renderiza nada cuando isOpen es false', () => {
    render(<CommentsModal {...defaultProps} isOpen={false} />)

    expect(screen.queryByTestId('comments-modal-overlay')).not.toBeInTheDocument()
  })

  it('muestra mensaje de carga cuando loading es true', () => {
    render(<CommentsModal {...defaultProps} loading={true} />)

    expect(screen.getByTestId('comments-loading')).toHaveTextContent(translations.es.cargandoComentarios)
    expect(screen.queryByTestId('comments-list')).not.toBeInTheDocument()
  })

  it('muestra mensaje de estado vacío cuando no hay comentarios', () => {
    render(<CommentsModal {...defaultProps} commentsList={[]} />)

    expect(screen.getByTestId('no-comments')).toHaveTextContent(translations.es.noComentarios)
    expect(screen.queryByTestId('comments-list')).not.toBeInTheDocument()
  })

  it('renderiza la lista de comentarios con autor y texto correctamente', () => {
    render(<CommentsModal {...defaultProps} />)

    expect(screen.getByTestId('comments-modal-title')).toHaveTextContent('Comentarios de The Tale of a Fairy')
    expect(screen.getByTestId('comment-author-c1')).toHaveTextContent('María')
    expect(screen.getByTestId('comment-text-c1')).toHaveTextContent('¡Excelente dirección artística!')
    expect(screen.getByTestId('comment-author-c2')).toHaveTextContent('Carlos')
    expect(screen.getByTestId('comment-text-c2')).toHaveTextContent('La iluminación es espectacular.')
  })

  it('llama a onClose al hacer click en el botón de cerrar', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()

    render(<CommentsModal {...defaultProps} onClose={handleClose} />)

    await user.click(screen.getByTestId('close-comments-modal'))
    expect(handleClose).toHaveBeenCalledOnce()
  })
})
