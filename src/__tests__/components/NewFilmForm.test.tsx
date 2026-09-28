import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewFilmForm from '../../app/components/NewFilmForm'
import { translations } from '../../lib/translations'

describe('NewFilmForm', () => {
  const dummyProps = {
    nuevoTitulo: 'Fashion Film 2024',
    setNuevoTitulo: vi.fn(),
    nuevaDireccion: 'Jane Doe',
    setNuevaDireccion: vi.fn(),
    nuevoAnio: '2024',
    setNuevoAnio: vi.fn(),
    nuevoMinutos: '05',
    setNuevoMinutos: vi.fn(),
    nuevoSegundos: '30',
    setNuevoSegundos: vi.fn(),
    nuevoLink: 'https://youtube.com/watch?v=abc',
    setNuevoLink: vi.fn(),
    nuevaSinopsis: 'Una sinopsis de prueba',
    setNuevaSinopsis: vi.fn(),
    guardandoFilm: false,
    onSave: vi.fn(),
    t: translations.es,
    theme: { accent: '#eef2f7', primary: '#3182ce', dark: '#1a202c', text: '#333', border: '#ccc', disabled: '#a0aec0', success: '#38a169' },
    isDarkMode: false,
  }

  it('renderiza todos los campos obligatorios y opcionales', () => {
    render(<NewFilmForm {...dummyProps} />)

    expect(screen.getByTestId('form-title')).toHaveTextContent(translations.es.nuevoFilm)
    expect(screen.getByTestId('input-titulo')).toHaveValue('Fashion Film 2024')
    expect(screen.getByTestId('input-direccion')).toHaveValue('Jane Doe')
    expect(screen.getByTestId('input-anio')).toHaveValue('2024')
    expect(screen.getByTestId('input-minutos')).toHaveValue(5)
    expect(screen.getByTestId('input-segundos')).toHaveValue(30)
    expect(screen.getByTestId('input-link')).toHaveValue('https://youtube.com/watch?v=abc')
    expect(screen.getByTestId('input-sinopsis')).toHaveValue('Una sinopsis de prueba')
    expect(screen.getByTestId('submit-film-button')).not.toBeDisabled()
  })

  it('deshabilita inputs y muestra texto de guardando cuando guardandoFilm es true', () => {
    render(<NewFilmForm {...dummyProps} guardandoFilm={true} />)

    expect(screen.getByTestId('input-titulo')).toBeDisabled()
    expect(screen.getByTestId('input-direccion')).toBeDisabled()
    expect(screen.getByTestId('input-anio')).toBeDisabled()
    expect(screen.getByTestId('input-minutos')).toBeDisabled()
    expect(screen.getByTestId('input-segundos')).toBeDisabled()
    expect(screen.getByTestId('input-link')).toBeDisabled()
    expect(screen.getByTestId('input-sinopsis')).toBeDisabled()

    const submitBtn = screen.getByTestId('submit-film-button')
    expect(submitBtn).toBeDisabled()
    expect(submitBtn).toHaveTextContent(translations.es.guardando)
  })

  it('llama a onSave al hacer click en el botón de guardar', async () => {
    const user = userEvent.setup()
    const handleSave = vi.fn()

    render(<NewFilmForm {...dummyProps} onSave={handleSave} />)

    await user.click(screen.getByTestId('submit-film-button'))
    expect(handleSave).toHaveBeenCalledOnce()
  })
})
