'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

type FashionFilm = {
  film_id: string
  titulo: string
  direccion: string
  fecha_publicacion: string | null
  duracion: string | number | null
  link: string | null
  visualizaciones: number | null
  sinopsis?: string | null
}

type Comentario = {
  id: string
  comentario: string
  fecha_comentario: string
  Usuarios: { nombre: string }
}

function toEmbedUrl(rawLink: string): string | null {
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

// Paleta de colores (Estilo Editorial Brutalista)
const colors = {
  primary: '#000000',      // Negro puro para iniciar y cerrar sesión
  secondary: '#105666',    // Azul petróleo
  accent: '#f7f4d5',       // Crema suave para fondos
  dark: '#000000',         // Negro puro para tipografía y bordes
  success: '#0a3323',      // Verde muy oscuro
  danger: '#e63946',       // Rojo vibrante para cancelar/eliminar
  pink: '#0047AB',         // Azul Cobalto para qué es un FF y play
  disabled: '#cccccc',     // Gris sólido
  textOnPrimary: '#f7f4d5',// Crema sobre oscuro
}

const darkColors = {
  primary: '#f7f4d5',       // Crema
  secondary: '#2c7a7b',
  accent: '#1a365d',
  dark: '#ffffff',
  success: '#38a169',       // Verde claro para éxito en dark mode
  danger: '#e63946',
  pink: '#0047AB',
  disabled: '#4a5568',
  textOnPrimary: '#000000', // Negro sobre crema
  background: '#1a202c',
  cardBackground: '#2d3748',
  text: '#f7fafc',
  border: '#4a5568'
}

const translations = {
  es: {
    title: 'Fashion Films',
    welcome: '¡Hola, {username}!',
    reproducir: 'Reproducir',
    quitarFavorito: 'Quitar de favoritos',
    marcarFavorito: 'Marcar como favorito',
    volverTodos: 'Volver a todos',
    verFavoritos: 'Ver mis favoritos',
    cancelar: 'Cancelar',
    agregarFilm: 'Agregar Fashion Film',
    cerrarSesion: 'Cerrar Sesión',
    nuevoFilm: 'Nuevo Fashion Film',
    titulo: 'Título',
    direccion: 'Dirección',
    anio: 'Año de publicación',
    duracion: 'Duración (MM:SS)',
    link: 'Link (YouTube o Vimeo)',
    guardando: 'Guardando...',
    guardar: 'Guardar Fashion Film',
    misFavoritos: 'Mis favoritos',
    fashionFilms: 'FashionFilms',
    buscarPlaceholder: 'Buscar por título, dirección, duración o año...',
    cargandoFavoritos: 'Cargando favoritos...',
    cargando: 'Cargando...',
    fechaPub: 'Fecha publicación',
    noResultados: 'No se encontraron resultados para tu búsqueda.',
    noFavoritos: 'No tienes favoritos aún.',
    noRegistros: 'No hay registros para mostrar.',
    reproduciendo: 'Reproduciendo',
    cerrar: 'Cerrar',
    noEmbed: 'No se pudo generar el reproductor para este link.',
    usuarioLabel: 'Nombre de Usuario',
    claveLabel: 'Contraseña',
    iniciarSesion: 'Iniciar Sesión',
    registrarse: 'Registrarse',
    regExito: '¡Usuario {username} registrado con éxito!',
    regError: 'Error al registrar: ',
    verificando: 'Verificando...',
    loginError: 'Usuario o contraseña incorrectos',
    loginExito: '¡Hola de nuevo, {username}!',
    registrando: 'Registrando usuario...',
    validarClave: 'La clave no es válida. Debe tener al menos 5 caracteres alfanuméricos, sin signos.',
    validarNombre: 'El nombre no es válido, no debe tener signos y solo se permiten uno o dos nombres.',
    noUsuarioId: 'No se encontró usuarioId. Vuelve a iniciar sesión.',
    noLink: 'Este fashion film no tiene link.',
    linkInvalido: 'El link no parece ser de YouTube o Vimeo (o no se pudo convertir a embed).',
    cargandoFilmsError: 'No se pudo cargar FashionFilms: ',
    consultarAccionError: 'No se pudo consultar AccionUsuario: ',
    actualizarAccionError: 'No se pudo actualizar AccionUsuario: ',
    insertarAccionError: 'No se pudo insertar AccionUsuario: ',
    visualizacionesError: 'No se pudo incrementar visualizaciones: ',
    cargarFavoritosError: 'No se pudieron cargar favoritos: ',
    cargarDatosError: 'No se pudieron cargar datos de FashionFilms: ',
    obligatorioError: 'El título y la dirección son obligatorios.',
    guardandoMsg: 'Guardando nuevo fashion film...',
    guardadoExito: '¡Fashion film guardado exitosamente!',
    guardarError: 'Error al guardar: ',
    camposVacios: 'Debes completar el nombre de usuario y la contraseña.',
    debeRegistrarse: 'El usuario no existe. Debes registrarte primero.',
    queEsFashionFilm: '¿Qué es un Fashion Film?',
    infoFashionFilm: 'Un fashion film es una creación audiovisual breve vinculada a una firma, diseñador o marca de moda, donde la indumentaria y la estética constituyen el núcleo del significado visual y simbólico. Su objetivo es comunicar identidad, valores y el universo estilístico y simbólico de una marca mediante una narrativa artística o experimental, no mediante la promoción directa de un producto.\n Más info y PDF descargable en:',
    enlaceMasInfo: 'https://polired.upm.es/index.php/ardin/article/view/5432',
    verComentarios: 'Ver comentarios',
    anadirComentario: 'Añadir comentario',
    escribeComentario: 'Escribe tu comentario...',
    enviar: 'Enviar',
    noComentarios: 'Aún no hay comentarios. ¡Sé el primero en comentar!',
    comentariosDe: 'Comentarios de',
    cargandoComentarios: 'Cargando comentarios...',
    errorComentarios: 'Error al cargar comentarios: ',
    comentarioExito: '¡Comentario añadido!',
    sinopsis: 'Sinopsis',
    langBtn: 'EN'
  },
  en: {
    title: 'Fashion Films',
    welcome: 'Hello, {username}!',
    reproducir: 'Play',
    quitarFavorito: 'Remove from favorites',
    marcarFavorito: 'Mark as favorite',
    volverTodos: 'Back to all',
    verFavoritos: 'See my favorites',
    cancelar: 'Cancel',
    agregarFilm: 'Add Fashion Film',
    cerrarSesion: 'Log Out',
    nuevoFilm: 'New Fashion Film',
    titulo: 'Title',
    direccion: 'Direction',
    anio: 'Release Year',
    duracion: 'Duration (MM:SS)',
    link: 'Link (YouTube or Vimeo)',
    guardando: 'Saving...',
    guardar: 'Save Fashion Film',
    misFavoritos: 'My favorites',
    fashionFilms: 'FashionFilms',
    buscarPlaceholder: 'Search by title, direction, duration or year...',
    cargandoFavoritos: 'Loading favorites...',
    cargando: 'Loading...',
    fechaPub: 'Release date',
    noResultados: 'No results found for your search.',
    noFavoritos: 'You don\'t have favorites yet.',
    noRegistros: 'No records to show.',
    reproduciendo: 'Playing',
    cerrar: 'Close',
    noEmbed: 'Could not generate player for this link.',
    usuarioLabel: 'Username',
    claveLabel: 'Password',
    iniciarSesion: 'Log In',
    registrarse: 'Register',
    regExito: 'User {username} registered successfully!',
    regError: 'Registration error: ',
    verificando: 'Verifying...',
    loginError: 'Incorrect username or password',
    loginExito: 'Welcome back, {username}!',
    registrando: 'Registering user...',
    validarClave: 'The password is invalid. It must have at least 5 alphanumeric characters with no symbols.',
    validarNombre: 'The username is invalid, must not have signs and only one or two names are allowed.',
    noUsuarioId: 'User ID not found. Please log in again.',
    noLink: 'This fashion film has no link.',
    linkInvalido: 'The link does not seem to be from YouTube or Vimeo (or could not be converted to embed).',
    cargandoFilmsError: 'Could not load FashionFilms: ',
    consultarAccionError: 'Could not query AccionUsuario: ',
    actualizarAccionError: 'Could not update AccionUsuario: ',
    insertarAccionError: 'Could not insert AccionUsuario: ',
    statusAccionError: 'Could not update AccionUsuario: ',
    visualizacionesError: 'Could not increment views: ',
    cargarFavoritosError: 'Could not load favorites: ',
    cargarDatosError: 'Could not load FashionFilms data: ',
    obligatorioError: 'Title and direction are required.',
    guardandoMsg: 'Saving new fashion film...',
    guardadoExito: 'Fashion film saved successfully!',
    guardarError: 'Error saving: ',
    camposVacios: 'You must fill in the username and password.',
    debeRegistrarse: 'User does not exist. You must register first.',
    queEsFashionFilm: 'What is a Fashion Film?',
    infoFashionFilm: 'A fashion film is a short audiovisual creation linked to a fashion label, designer, or brand, where clothing and aesthetics are at the core of the visual and symbolic meaning. Its goal is to communicate a brand\'s identity, values, and stylistic and symbolic universe through an artistic or experimental narrative, rather than through the direct promotion of a product.\n' +
      'More info and downloadable PDF at:',
    enlaceMasInfo: 'https://polired.upm.es/index.php/ardin/article/view/5432',
    verComentarios: 'View comments',
    anadirComentario: 'Add comment',
    escribeComentario: 'Write your comment...',
    enviar: 'Send',
    noComentarios: 'No comments yet. Be the first to comment!',
    comentariosDe: 'Comments on',
    cargandoComentarios: 'Loading comments...',
    errorComentarios: 'Error loading comments: ',
    comentarioExito: 'Comment added!',
    sinopsis: 'Synopsis',
    langBtn: 'ES'
  }
}

export default function LoginPage() {
  const [language, setLanguage] = useState<'es' | 'en'>('es')
  const t = translations[language]

  const [isDarkMode, setIsDarkMode] = useState(false)
  const theme = isDarkMode ? darkColors : { ...colors, background: '#f0f2f5', cardBackground: 'white', text: '#333', border: '#ddd' }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.style.backgroundColor = theme.background
      document.body.style.color = theme.text
    }
  }, [isDarkMode, theme.background, theme.text])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userError, setUserError] = useState(false)
  const [passError, setPassError] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [mostrandoBienvenida, setMostrandoBienvenida] = useState(false)
  const [estaLogueado, setEstaLogueado] = useState(false)

  const [usuarioId, setUsuarioId] = useState<string | null>(null)

  const [isMobile, setIsMobile] = useState(false)
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)

  const [films, setFilms] = useState<FashionFilm[]>([])
  const [cargandoFilms, setCargandoFilms] = useState(false)
  const [errorFilms, setErrorFilms] = useState<string>('')

  const [selectedFilmId, setSelectedFilmId] = useState<string | null>(null)
  const selectedFilm = useMemo(
    () => films.find((f) => f.film_id === selectedFilmId) ?? null,
    [films, selectedFilmId]
  )

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const embedUrl = useMemo(() => {
    const link = selectedFilm?.link
    return link ? toEmbedUrl(link) : null
  }, [selectedFilm])

  const [viendoFavoritos, setViendoFavoritos] = useState(false)
  const [filmsFavoritos, setFilmsFavoritos] = useState<FashionFilm[]>([])
  const [cargandoFavoritos, setCargandoFavoritos] = useState(false)
  const [favoritoSeleccionado, setFavoritoSeleccionado] = useState<boolean>(false)

  const [mostrandoFormulario, setMostrandoFormulario] = useState(false)
  const [nuevoTitulo, setNuevoTitulo] = useState('')
  const [nuevaDireccion, setNuevaDireccion] = useState('')
  const [nuevoAnio, setNuevoAnio] = useState('')
  const [nuevoMinutos, setNuevoMinutos] = useState('')
  const [nuevoSegundos, setNuevoSegundos] = useState('')
  const [nuevoLink, setNuevoLink] = useState('')
  const [nuevaSinopsis, setNuevaSinopsis] = useState('')
  const [guardandoFilm, setGuardandoFilm] = useState(false)

  const [isComentariosModalOpen, setIsComentariosModalOpen] = useState(false)
  const [isAddComentarioModalOpen, setIsAddComentarioModalOpen] = useState(false)
  const [comentariosList, setComentariosList] = useState<Comentario[]>([])
  const [cargandoComentarios, setCargandoComentarios] = useState(false)
  const [nuevoComentarioTexto, setNuevoComentarioTexto] = useState('')

  const [busqueda, setBusqueda] = useState('')
  const [mostrandoInfo, setMostrandoInfo] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => setIsMobile(window.innerWidth < 768)
      handleResize()
      window.addEventListener('resize', handleResize)

      const usuarioGuardado = localStorage.getItem('usuarioLogueado')
      const usuarioIdGuardado = localStorage.getItem('usuarioId')

      if (usuarioGuardado) setUsername(usuarioGuardado)
      if (usuarioIdGuardado) setUsuarioId(usuarioIdGuardado)

      if (usuarioGuardado && usuarioIdGuardado) {
        setEstaLogueado(true)
      }
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (!estaLogueado) return

    const cargarFashionFilms = async () => {
      setCargandoFilms(true)
      setErrorFilms('')

      const { data, error } = await supabase
        .from('FashionFilms')
        .select('film_id, titulo, direccion, fecha_publicacion, duracion, link, visualizaciones, sinopsis')
        .order('titulo', { ascending: true })

      if (error) {
        setErrorFilms(t.cargandoFilmsError + error.message)
        setFilms([])
        setSelectedFilmId(null)
      } else {
        setFilms((data ?? []) as FashionFilm[])
      }

      setCargandoFilms(false)
    }

    cargarFashionFilms()
  }, [estaLogueado])

  useEffect(() => {
    // Cada vez que cambias de fila, consultamos si ese film ya está en favoritos para este usuario
    const cargarEstadoFavorito = async () => {
      setFavoritoSeleccionado(false)
      if (!estaLogueado || !usuarioId || !selectedFilmId) return

      const { data, error } = await supabase
        .from('AccionUsuario')
        .select('favorito')
        .eq('usuario_id', usuarioId)
        .eq('film_id', selectedFilmId)
        .order('fecha_accion', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!error && data?.favorito === true) setFavoritoSeleccionado(true)
    }

    cargarEstadoFavorito()
  }, [estaLogueado, usuarioId, selectedFilmId])

  const handleRegister = async () => {
    // Limpiar estados de error previos
    setUserError(false)
    setPassError(false)

    // Validar si están vacíos
    if (!username.trim() || !password.trim()) {
      setMensaje(t.camposVacios)
      if (!username.trim()) setUserError(true)
      if (!password.trim()) setPassError(true)
      return
    }

    // Validaciones

    // Validación de clave
    const passwordTrimmed = password.trim();
    const passwordLower = passwordTrimmed.toLowerCase();

    //No permitir "admin" en la clave
    if (passwordLower.includes('admin')) {
      setMensaje(t.validarClave);
      setPassError(true)
      return
    }
    // Mínimo 5 caracteres, números y letras sin signos
    const regexClave = /^[a-zA-Z0-9]{5,}$/
    if (!regexClave.test(passwordTrimmed)) {
      setMensaje(t.validarClave)
      setPassError(true)
      return
    }

    // Validación de nombre de usuario
    const usernameTrimmed = username.trim();
    const usernameLower = usernameTrimmed.toLowerCase();

    // Nombre de usuario: no "admin", no signos, solo uno o dos nombres (letras)
    if (usernameLower.includes('admin')) {
      setMensaje(t.validarNombre)
      setUserError(true)
      return
    }
    // Permite uno o dos nombres, solo letras (incluyendo ñ y tildes), separados por un espacio opcional
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)?$/
    if (!regexNombre.test(usernameTrimmed)) {
      setMensaje(t.validarNombre)
      setUserError(true)
      return
    }

    setMensaje(t.registrando)

    const { error } = await supabase
      .from('Usuarios')
      .insert([{ nombre: username, clave: password }])
      .select()

    if (error) {
      setMensaje(t.regError + error.message)
    } else {
      setMensaje(t.regExito.replace('{username}', username))
      setUsername('')
      setPassword('')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reiniciar estados de error previos
    setUserError(false)
    setPassError(false)

    // Validar si están vacíos
    if (!username.trim() || !password.trim()) {
      setMensaje(t.camposVacios)
      if (!username.trim()) setUserError(true)
      if (!password.trim()) setPassError(true)
      return
    }

    setMensaje(t.verificando)

    // Llamar a la función verificar_login que usa crypt() para comparar contraseñas
    const { data, error } = await supabase
      .rpc('verificar_login', {
        p_nombre: username.trim(),
        p_clave: password.trim()
      })

    if (error || !data || data.length === 0) {
      // Login incorrecto: no revelamos cuál campo es erróneo
      setUserError(true)
      setPassError(true)
      setMensaje(t.loginError)
      return
    }

    const user = data[0]

    // Éxito
    setUserError(false)
    setPassError(false)
    localStorage.setItem('usuarioLogueado', user.nombre)
    localStorage.setItem('usuarioId', user.usuario_id)

    setUsuarioId(user.usuario_id)
    setMensaje(t.loginExito.replace('{username}', user.nombre))
    setEstaLogueado(true)
  }

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioLogueado')
    localStorage.removeItem('usuarioId')
    setEstaLogueado(false)
    setUsername('')
    setPassword('')
    setUsuarioId(null)
    setFilms([])
    setFilmsFavoritos([])
    setSelectedFilmId(null)
    setErrorFilms('')
    setIsModalOpen(false)
    setHasPlayed(false)
    setViendoFavoritos(false)
    setFavoritoSeleccionado(false)
  }

  const upsertAccionUsuario = async (args: { filmId: string; visualizado?: boolean; favorito?: boolean }) => {
    if (!usuarioId) return

    // Buscamos si ya existe una acción previa del usuario para este film
    const { data: existente, error: errorSelect } = await supabase
      .from('AccionUsuario')
      .select('accion_id, visualizado, favorito')
      .eq('usuario_id', usuarioId)
      .eq('film_id', args.filmId)
      .order('fecha_accion', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (errorSelect) {
      setMensaje(t.consultarAccionError + errorSelect.message)
      return
    }

    const payload = {
      usuario_id: usuarioId,
      film_id: args.filmId,
      visualizado: args.visualizado ?? (existente?.visualizado ?? false),
      favorito: args.favorito ?? (existente?.favorito ?? false),
      fecha_accion: new Date().toISOString(),
    }

    if (existente?.accion_id) {
      const { error: errorUpdate } = await supabase
        .from('AccionUsuario')
        .update(payload)
        .eq('accion_id', existente.accion_id)

      if (errorUpdate) setMensaje(t.actualizarAccionError + errorUpdate.message)
    } else {
      const { error: errorInsert } = await supabase.from('AccionUsuario').insert([payload])
      if (errorInsert) setMensaje(t.insertarAccionError + errorInsert.message)
    }
  }

  const incrementarVisualizaciones = async (film: FashionFilm) => {
    const current = film.visualizaciones ?? 0
    const next = current + 1

    const { data, error } = await supabase
      .from('FashionFilms')
      .update({ visualizaciones: next })
      .eq('film_id', film.film_id)
      .select('film_id, visualizaciones')
      .single()

    if (error) {
      setMensaje(t.visualizacionesError + error.message)
      return
    }

    setFilms((prev) =>
      prev.map((f) =>
        f.film_id === film.film_id ? { ...f, visualizaciones: data.visualizaciones } : f
      )
    )
  }

  const handlePlayVideo = async () => {
    if (!selectedFilm) return
    if (!usuarioId) {
      setMensaje(t.noUsuarioId)
      return
    }
    setHasPlayed(true)
    await incrementarVisualizaciones(selectedFilm)
    await upsertAccionUsuario({ filmId: selectedFilm.film_id, visualizado: true })
  }

  const onClickFavorito = async () => {
    if (!selectedFilm) return
    if (!usuarioId) {
      setMensaje(t.noUsuarioId)
      return
    }

    const next = !favoritoSeleccionado
    setFavoritoSeleccionado(next)
    await upsertAccionUsuario({ filmId: selectedFilm.film_id, favorito: next })
  }

  const cargarMisFavoritos = async () => {
    if (!usuarioId) {
      setMensaje(t.noUsuarioId)
      return
    }

    setCargandoFavoritos(true)
    setMensaje('')

    const { data: acciones, error: errorAcciones } = await supabase
      .from('AccionUsuario')
      .select('film_id')
      .eq('usuario_id', usuarioId)
      .eq('favorito', true)

    if (errorAcciones) {
      setMensaje(t.cargarFavoritosError + errorAcciones.message)
      setFilmsFavoritos([])
      setCargandoFavoritos(false)
      return
    }

    const filmIds = Array.from(new Set((acciones ?? []).map((a) => a.film_id).filter(Boolean))) as string[]
    if (filmIds.length === 0) {
      setFilmsFavoritos([])
      setCargandoFavoritos(false)
      return
    }

    const { data: favFilms, error: errorFilms } = await supabase
      .from('FashionFilms')
      .select('film_id, titulo, direccion, fecha_publicacion, duracion, link, visualizaciones, sinopsis')
      .in('film_id', filmIds)
      .order('fecha_publicacion', { ascending: false })

    if (errorFilms) {
      setMensaje(t.cargarDatosError + errorFilms.message)
      setFilmsFavoritos([])
    } else {
      setFilmsFavoritos((favFilms ?? []) as FashionFilm[])
    }

    setCargandoFavoritos(false)
  }

  const guardarNuevoFilm = async () => {
    if (!usuarioId) {
      setMensaje(t.noUsuarioId)
      return
    }

    if (!nuevoTitulo.trim() || !nuevaDireccion.trim()) {
      setMensaje(t.obligatorioError)
      return
    }

    setGuardandoFilm(true)
    setMensaje(t.guardandoMsg)

    const payload: any = {
      titulo: nuevoTitulo.trim(),
      direccion: nuevaDireccion.trim(),
      creador_usuario_id: usuarioId,
      visualizaciones: 0,
    }

    if (nuevoAnio.trim()) payload.fecha_publicacion = nuevoAnio.trim()

    // Formatear duración como mm'ss''
    if (nuevoMinutos.trim() || nuevoSegundos.trim()) {
      const mins = nuevoMinutos.trim() || '0'
      const secs = nuevoSegundos.trim() || '0'
      payload.duracion = `${mins.padStart(2, '0')}'${secs.padStart(2, '0')}''`
    }

    if (nuevoLink.trim()) payload.link = nuevoLink.trim()
    if (nuevaSinopsis.trim()) payload.sinopsis = nuevaSinopsis.trim()

    const { data, error } = await supabase
      .from('FashionFilms')
      .insert([payload])
      .select()
      .single()

    if (error) {
      setMensaje(t.guardarError + error.message)
      setGuardandoFilm(false)
      return
    }

    setMensaje(t.guardadoExito)
    setNuevoTitulo('')
    setNuevaDireccion('')
    setNuevoAnio('')
    setNuevoMinutos('')
    setNuevoSegundos('')
    setNuevoLink('')
    setNuevaSinopsis('')
    setMostrandoFormulario(false)
    setGuardandoFilm(false)

    // Recargar lista de films
    const { data: todosFilms, error: errorCargar } = await supabase
      .from('FashionFilms')
      .select('film_id, titulo, direccion, fecha_publicacion, duracion, link, visualizaciones, sinopsis')
      .order('titulo', { ascending: true })

    if (!errorCargar && todosFilms) {
      setFilms(todosFilms as FashionFilm[])
    }

    setTimeout(() => setMensaje(''), 3000)
  }

  const cargarComentarios = async (filmId: string) => {
    setCargandoComentarios(true)
    const { data, error } = await supabase
      .from('Comentarios')
      .select('id, comentario, fecha_comentario, Usuarios(nombre)')
      .eq('film_id', filmId)
      .order('fecha_comentario', { ascending: false })

    if (error) {
      setMensaje(t.errorComentarios + error.message)
      setComentariosList([])
    } else {
      setComentariosList((data as any) as Comentario[])
    }
    setCargandoComentarios(false)
  }

  const abrirComentarios = async () => {
    if (!selectedFilm) return
    setIsComentariosModalOpen(true)
    await cargarComentarios(selectedFilm.film_id)
  }

  const guardarNuevoComentario = async () => {
    if (!selectedFilm || !usuarioId || !nuevoComentarioTexto.trim()) return
    setMensaje(t.guardando)
    const { error } = await supabase
      .from('Comentarios')
      .insert([{
        usuario_id: usuarioId,
        film_id: selectedFilm.film_id,
        comentario: nuevoComentarioTexto.trim()
      }])

    if (error) {
      setMensaje(t.errorComentarios + error.message)
    } else {
      setMensaje(t.comentarioExito)
      setNuevoComentarioTexto('')
      setIsAddComentarioModalOpen(false)
      setTimeout(() => setMensaje(''), 3000)
    }
  }

  if (estaLogueado) {
    const listaActual = viendoFavoritos ? filmsFavoritos : films

    // Filtrar por búsqueda
    const listaFiltrada = listaActual.filter((f) => {
      if (!busqueda.trim()) return true
      const busquedaLower = busqueda.toLowerCase()
      return (
        f.titulo.toLowerCase().includes(busquedaLower) ||
        f.direccion.toLowerCase().includes(busquedaLower) ||
        (f.fecha_publicacion && f.fecha_publicacion.toLowerCase().includes(busquedaLower)) ||
        (f.duracion && f.duracion.toString().toLowerCase().includes(busquedaLower))
      )
    })

    return (
      <div style={{ ...cardStyle, width: isMobile ? '95vw' : 'min(1000px, 95vw)', position: 'relative', padding: isMobile ? '15px' : '30px', backgroundColor: theme.cardBackground, color: theme.text }}>
        <div style={{ position: 'absolute', top: isMobile ? 10 : 20, right: isMobile ? 10 : 20, display: 'flex', gap: '8px', zIndex: 100 }}>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              backgroundColor: theme.secondary,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '5px 10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}
            title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            style={{
              backgroundColor: theme.secondary,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '5px 10px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {t.langBtn}
          </button>
        </div>
        <h1 style={{ fontFamily: 'Century Gothic, sans-serif', color: theme.dark }}>
          {t.welcome.replace('{username}', username)}
        </h1>


        <div
          style={{
            position: 'sticky',
            top: 12,
            zIndex: 50,
            background: theme.cardBackground,
            padding: '10px 0',
            borderBottom: `1px solid ${theme.border}`,
            marginTop: 12,
            marginBottom: 12,
          }}
        >
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
            <button
              onClick={() => setMostrandoInfo(!mostrandoInfo)}
              style={{
                ...buttonStyle,
                backgroundColor: theme.pink,
                color: 'white',
                cursor: 'pointer',
                width: isMobile ? '100%' : 'auto',
                paddingInline: 16,
              }}
              type="button"
            >
              {t.queEsFashionFilm}
            </button>

            <button
              onClick={async () => {
                const next = !viendoFavoritos
                setViendoFavoritos(next)
                setSelectedFilmId(null)
                setFavoritoSeleccionado(false)
                if (next) await cargarMisFavoritos()
              }}
              style={{ ...buttonStyle, width: isMobile ? '100%' : 'auto', paddingInline: 16, backgroundColor: theme.secondary, color: 'white' }}
              type="button"
            >
              {viendoFavoritos ? t.volverTodos : t.verFavoritos}
            </button>

            <button
              onClick={() => setMostrandoFormulario(!mostrandoFormulario)}
              style={{
                ...buttonStyle,
                width: isMobile ? '100%' : 'auto',
                paddingInline: 16,
                backgroundColor: mostrandoFormulario ? theme.danger : theme.success,
                color: 'white'
              }}
              type="button"
            >
              {mostrandoFormulario ? t.cancelar : t.agregarFilm}
            </button>

            <button
              onClick={cerrarSesion}
              style={{ ...buttonStyle, width: isMobile ? '100%' : 'auto', paddingInline: 16, backgroundColor: theme.dark, color: isDarkMode ? '#1a202c' : 'white' }}
              type="button"
            >
              {t.cerrarSesion}
            </button>
          </div>
        </div>

        {mostrandoInfo && (
          <div style={{
            background: theme.accent,
            padding: 20,
            borderRadius: 8,
            marginBottom: 20,
            border: `2px solid ${theme.pink}`,
            color: isDarkMode ? 'white' : theme.dark,
            fontSize: '15px',
            lineHeight: '1.5'
          }}>
            <p style={{ margin: '0 0 10px 0' }}>{t.infoFashionFilm}</p>
            <a
              href={`${t.enlaceMasInfo}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: theme.secondary, fontWeight: 'bold', textDecoration: 'underline', wordBreak: 'break-all' }}
            >
              {t.enlaceMasInfo}
            </a>
          </div>
        )}

        {mostrandoFormulario && (
          <div style={{
            background: theme.accent,
            padding: 20,
            borderRadius: 8,
            marginBottom: 20,
            border: `2px solid ${theme.primary}`
          }}>
            <h3 style={{ margin: '0 0 16px', fontFamily: 'Century Gothic, sans-serif', color: isDarkMode ? 'white' : theme.dark }}>
              {t.nuevoFilm}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ ...labelStyle, color: isDarkMode ? '#cbd5e0' : '#666' }}>{t.titulo} *</label>
                <input
                  type="text"
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  style={{ ...inputStyle, backgroundColor: isDarkMode ? '#4a5568' : 'white', color: theme.text, borderColor: theme.border }}
                  placeholder="Ej: Fashion Film 2024"
                  disabled={guardandoFilm}
                />
              </div>

              <div>
                <label style={{ ...labelStyle, color: isDarkMode ? '#cbd5e0' : '#666' }}>{t.direccion} *</label>
                <input
                  type="text"
                  value={nuevaDireccion}
                  onChange={(e) => setNuevaDireccion(e.target.value)}
                  style={{ ...inputStyle, backgroundColor: isDarkMode ? '#4a5568' : 'white', color: theme.text, borderColor: theme.border }}
                  placeholder="Ej: John Doe"
                  disabled={guardandoFilm}
                />
              </div>

              <div>
                <label style={{ ...labelStyle, color: isDarkMode ? '#cbd5e0' : '#666' }}>{t.anio}</label>
                <input
                  type="text"
                  value={nuevoAnio}
                  onChange={(e) => setNuevoAnio(e.target.value)}
                  style={{ ...inputStyle, backgroundColor: isDarkMode ? '#4a5568' : 'white', color: theme.text, borderColor: theme.border }}
                  placeholder="Ej: 2024"
                  disabled={guardandoFilm}
                />
              </div>

              <div>
                <label style={{ ...labelStyle, color: isDarkMode ? '#cbd5e0' : '#666' }}>{t.duracion}</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={nuevoMinutos}
                    onChange={(e) => setNuevoMinutos(e.target.value)}
                    style={{ ...inputStyle, width: '80px', backgroundColor: isDarkMode ? '#4a5568' : 'white', color: theme.text, borderColor: theme.border }}
                    placeholder="MM"
                    disabled={guardandoFilm}
                  />
                  <span style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={nuevoSegundos}
                    onChange={(e) => setNuevoSegundos(e.target.value)}
                    style={{ ...inputStyle, width: '80px', backgroundColor: isDarkMode ? '#4a5568' : 'white', color: theme.text, borderColor: theme.border }}
                    placeholder="SS"
                    disabled={guardandoFilm}
                  />
                </div>
              </div>

              <div>
                <label style={{ ...labelStyle, color: isDarkMode ? '#cbd5e0' : '#666' }}>{t.link}</label>
                <input
                  type="url"
                  value={nuevoLink}
                  onChange={(e) => setNuevoLink(e.target.value)}
                  style={{ ...inputStyle, backgroundColor: isDarkMode ? '#4a5568' : 'white', color: theme.text, borderColor: theme.border }}
                  placeholder="Ej: https://www.youtube.com/watch?v=..."
                  disabled={guardandoFilm}
                />
              </div>

              <div>
                <label style={{ ...labelStyle, color: isDarkMode ? '#cbd5e0' : '#666' }}>{t.sinopsis}</label>
                <textarea
                  value={nuevaSinopsis}
                  onChange={(e) => setNuevaSinopsis(e.target.value)}
                  style={{
                    ...inputStyle,
                    backgroundColor: isDarkMode ? '#4a5568' : 'white',
                    color: theme.text,
                    borderColor: theme.border,
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="Ej: Breve descripción del fashion film..."
                  disabled={guardandoFilm}
                />
              </div>

              <button
                onClick={guardarNuevoFilm}
                style={{
                  ...buttonStyle,
                  backgroundColor: guardandoFilm ? theme.disabled : theme.success,
                  cursor: guardandoFilm ? 'not-allowed' : 'pointer',
                  color: 'white'
                }}
                disabled={guardandoFilm}
                type="button"
              >
                {guardandoFilm ? t.guardando : t.guardar}
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', marginBottom: 12, flexDirection: isMobile ? 'column' : 'row', gap: 10 }}>
          <h2 style={{ margin: 0, fontFamily: 'Century Gothic, sans-serif', color: theme.dark, fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
            {viendoFavoritos ? t.misFavoritos : t.fashionFilms}
          </h2>

          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder={t.buscarPlaceholder}
            style={{
              ...inputStyle,
              width: isMobile ? '100%' : '300px',
              padding: '8px 12px',
              backgroundColor: isDarkMode ? '#4a5568' : 'white',
              color: theme.text,
              borderColor: theme.border
            }}
          />
        </div>

        {viendoFavoritos && cargandoFavoritos && <p>{t.cargandoFavoritos}</p>}
        {!viendoFavoritos && cargandoFilms && <p>{t.cargando}</p>}
        {errorFilms && <p style={{ color: '#b00020' }}>{errorFilms}</p>}

        {!cargandoFilms && !errorFilms && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, color: isDarkMode ? '#e2e8f0' : '#333', borderBottomColor: theme.border }}>{t.titulo}</th>
                  {!isMobile && (
                    <>
                      <th style={{ ...thStyle, color: isDarkMode ? '#e2e8f0' : '#333', borderBottomColor: theme.border }}>{t.direccion}</th>
                      <th style={{ ...thStyle, color: isDarkMode ? '#e2e8f0' : '#333', borderBottomColor: theme.border }}>{t.fechaPub}</th>
                      <th style={{ ...thStyle, color: isDarkMode ? '#e2e8f0' : '#333', borderBottomColor: theme.border }}>{t.duracion}</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {listaFiltrada.map((f) => {
                  const isSelected = f.film_id === selectedFilmId
                  const isExpanded = isMobile && expandedRowId === f.film_id
                  return (
                    <React.Fragment key={f.film_id}>
                      <tr
                        onClick={() => {
                          setSelectedFilmId(f.film_id)
                          if (isMobile) {
                            setExpandedRowId(expandedRowId === f.film_id ? null : f.film_id)
                          }
                          setIsModalOpen(true)
                          setHasPlayed(false)
                        }}
                        style={{
                          background: isSelected ? (isDarkMode ? '#3e4a5b' : '#eef5ff') : 'transparent',
                          cursor: 'pointer',
                        }}
                        title={f.link ? 'Haz clic para abrir el reproductor' : 'Sin link'}
                      >
                        <td style={{ ...tdStyle, borderBottomColor: theme.border, color: theme.text }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{f.titulo}</span>
                            {isMobile && (
                              <span style={{ fontSize: '10px', color: isDarkMode ? '#a0aec0' : '#888' }}>
                                {isExpanded ? '▲' : '▼'}
                              </span>
                            )}
                          </div>
                        </td>
                        {!isMobile && (
                          <>
                            <td style={{ ...tdStyle, borderBottomColor: theme.border, color: theme.text }}>{f.direccion}</td>
                            <td style={{ ...tdStyle, borderBottomColor: theme.border, color: theme.text }}>{f.fecha_publicacion ?? '-'}</td>
                            <td style={{ ...tdStyle, borderBottomColor: theme.border, color: theme.text }}>{f.duracion ?? '-'}</td>
                          </>
                        )}
                      </tr>
                      {isExpanded && (
                        <tr style={{ background: isDarkMode ? '#2d3748' : '#f9f9f9' }}>
                          <td colSpan={1} style={{ ...tdStyle, whiteSpace: 'normal', padding: '10px 20px', borderBottomColor: theme.border }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: theme.text }}>
                              <div><strong>{t.direccion}:</strong> {f.direccion}</div>
                              <div><strong>{t.fechaPub}:</strong> {f.fecha_publicacion ?? '-'}</div>
                              <div><strong>{t.duracion}:</strong> {f.duracion ?? '-'}</div>
                              {f.sinopsis && <div style={{ marginTop: 8 }}><strong>{t.sinopsis}:</strong> <span style={{ display: 'block', marginTop: 4 }}>{f.sinopsis}</span></div>}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}

                {listaFiltrada.length === 0 && (
                  <tr>
                    <td style={tdStyle} colSpan={isMobile ? 1 : 4}>
                      {busqueda.trim()
                        ? t.noResultados
                        : viendoFavoritos
                          ? t.noFavoritos
                          : t.noRegistros}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && (
          <div style={overlayStyle} onClick={() => setIsModalOpen(false)}>
            <div style={{ ...modalStyle, backgroundColor: theme.cardBackground, color: theme.text }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <h3 style={{ margin: 0, fontFamily: 'Century Gothic, sans-serif', color: isDarkMode ? 'white' : theme.dark }}>
                  {selectedFilm?.titulo ?? t.reproduciendo}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ ...buttonStyle, width: 'auto', paddingInline: 12, backgroundColor: theme.dark, color: isDarkMode ? '#1a202c' : 'white' }}
                >
                  {t.cerrar}
                </button>
              </div>

              <div style={{ marginTop: 12 }}>
                {embedUrl ? (
                  <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                    {!hasPlayed && (
                      <div
                        onClick={handlePlayVideo}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 10,
                          cursor: 'pointer',
                          borderRadius: 10
                        }}
                      >
                        <div style={{
                          width: '60px',
                          height: '60px',
                          backgroundColor: theme.pink,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '24px',
                          paddingLeft: '5px'
                        }}>
                          ▶
                        </div>
                      </div>
                    )}
                    <iframe
                      src={hasPlayed ? embedUrl + (embedUrl.includes('?') ? '&autoplay=1' : '?autoplay=1') : embedUrl}
                      title={selectedFilm?.titulo ?? 'Video'}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        border: '0',
                        borderRadius: 10,
                      }}
                    />
                  </div>
                ) : (
                  <p>{t.noEmbed}</p>
                )}

                {selectedFilm?.sinopsis && (
                  <div style={{ marginTop: 16, fontSize: '14px', lineHeight: '1.6', color: isDarkMode ? '#cbd5e0' : '#4a5568' }}>
                    <strong>{t.sinopsis}:</strong>
                    <p style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{selectedFilm.sinopsis}</p>
                  </div>
                )}

                <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button
                    onClick={onClickFavorito}
                    style={{
                      ...buttonStyle,
                      backgroundColor: favoritoSeleccionado ? theme.danger : theme.secondary,
                      width: 'auto',
                      paddingInline: 16,
                      color: 'white',
                    }}
                    type="button"
                  >
                    {favoritoSeleccionado ? t.quitarFavorito : t.marcarFavorito}
                  </button>


                  <button
                    onClick={() => setIsAddComentarioModalOpen(true)}
                    style={{
                      ...buttonStyle,
                      backgroundColor: theme.success,
                      width: 'auto',
                      paddingInline: 16,
                      color: 'white',
                    }}
                    type="button"
                  >
                    {t.anadirComentario}
                  </button>

                  <button
                    onClick={abrirComentarios}
                    style={{
                      ...buttonStyle,
                      backgroundColor: theme.primary,
                      color: theme.textOnPrimary,
                      width: 'auto',
                      paddingInline: 16,
                    }}
                    type="button"
                  >
                    {t.verComentarios}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isComentariosModalOpen && (
          <div style={overlayStyle} onClick={() => setIsComentariosModalOpen(false)}>
            <div style={{ ...modalStyle, backgroundColor: theme.cardBackground, color: theme.text, maxHeight: '80vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontFamily: 'Century Gothic, sans-serif', color: isDarkMode ? 'white' : theme.dark }}>
                  {t.comentariosDe} {selectedFilm?.titulo}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsComentariosModalOpen(false)}
                  style={{ ...buttonStyle, width: 'auto', paddingInline: 12, backgroundColor: theme.dark, color: isDarkMode ? '#1a202c' : 'white' }}
                >
                  {t.cerrar}
                </button>
              </div>
              {cargandoComentarios ? (
                <p>{t.cargandoComentarios}</p>
              ) : comentariosList.length === 0 ? (
                <p>{t.noComentarios}</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {comentariosList.map((c) => (
                    <div key={c.id} style={{ padding: 12, backgroundColor: isDarkMode ? '#4a5568' : '#f7f4d5', borderRadius: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem', color: isDarkMode ? '#cbd5e0' : '#555' }}>
                        <strong>{c.Usuarios?.nombre || 'Usuario'}</strong>
                        <span>{new Date(c.fecha_comentario).toLocaleString()}</span>
                      </div>
                      <p style={{ margin: 0 }}>{c.comentario}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {isAddComentarioModalOpen && (
          <div style={overlayStyle} onClick={() => setIsAddComentarioModalOpen(false)}>
            <div style={{ ...modalStyle, backgroundColor: theme.cardBackground, color: theme.text, maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontFamily: 'Century Gothic, sans-serif', color: isDarkMode ? 'white' : theme.dark }}>
                  {t.anadirComentario} - {selectedFilm?.titulo}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddComentarioModalOpen(false)}
                  style={{ ...buttonStyle, width: 'auto', paddingInline: 12, backgroundColor: theme.dark, color: isDarkMode ? '#1a202c' : 'white' }}
                >
                  {t.cerrar}
                </button>
              </div>
              <textarea
                value={nuevoComentarioTexto}
                onChange={(e) => setNuevoComentarioTexto(e.target.value)}
                placeholder={t.escribeComentario}
                style={{
                  width: '100%',
                  minHeight: 100,
                  padding: 12,
                  borderRadius: 8,
                  border: `1px solid ${theme.border}`,
                  backgroundColor: isDarkMode ? '#4a5568' : 'white',
                  color: theme.text,
                  marginBottom: 16,
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
              <button
                onClick={guardarNuevoComentario}
                disabled={!nuevoComentarioTexto.trim()}
                style={{
                  ...buttonStyle,
                  backgroundColor: nuevoComentarioTexto.trim() ? theme.success : theme.disabled,
                  color: 'white'
                }}
                type="button"
              >
                {t.enviar}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ ...cardStyle, width: isMobile ? '90vw' : '350px', position: 'relative', padding: isMobile ? '20px' : '30px', backgroundColor: theme.cardBackground, color: theme.text }}>
      <div style={{ position: 'absolute', top: isMobile ? 10 : 20, right: isMobile ? 10 : 20, display: 'flex', gap: '8px', zIndex: 100 }}>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            backgroundColor: theme.secondary,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '5px 10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px'
          }}
          title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <button
          onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
          style={{
            backgroundColor: theme.secondary,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '5px 10px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {t.langBtn}
        </button>
      </div>
      <h2 style={{ textAlign: 'center', fontFamily: 'Century Gothic, sans-serif', color: theme.dark }}>
        {t.title}
      </h2>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ ...labelStyle, color: isDarkMode ? '#cbd5e0' : '#666' }}>{t.usuarioLabel}</label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              if (userError) setUserError(false)
            }}
            style={{
              ...inputStyle,
              borderColor: userError ? theme.danger : theme.border,
              borderWidth: userError ? '2px' : '1px',
              backgroundColor: isDarkMode ? '#4a5568' : 'white',
              color: theme.text
            }}
          />
        </div>

        <div>
          <label style={{ ...labelStyle, color: isDarkMode ? '#cbd5e0' : '#666' }}>{t.claveLabel}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (passError) setPassError(false)
            }}
            style={{
              ...inputStyle,
              borderColor: passError ? theme.danger : theme.border,
              borderWidth: passError ? '2px' : '1px',
              backgroundColor: isDarkMode ? '#4a5568' : 'white',
              color: theme.text
            }}
          />
        </div>

        <button
          type="button"
          onClick={handleRegister}
          style={{ ...buttonStyle, backgroundColor: theme.secondary, color: 'white' }}
        >
          {t.registrarse}
        </button>

        <button type="submit" style={{ ...buttonStyle, backgroundColor: theme.primary, color: theme.textOnPrimary }}>
          {t.iniciarSesion}
        </button>
      </form>

      {mensaje && (
        <p style={{
          textAlign: 'center',
          marginTop: '10px',
          color: (userError || passError) ? theme.danger : theme.text,
          fontWeight: (userError || passError) ? 'bold' : 'normal',
          fontSize: '14px'
        }}>
          {mensaje}
        </p>
      )}
    </div>
  )
}

// Estilos Editorial Brutalista
const cardStyle = {
  background: 'white',
  padding: '30px',
  borderRadius: '0px',
  border: '2px solid #000',
  boxShadow: 'none',
  width: '350px',
}

const labelStyle = { display: 'block', fontSize: '14px', color: '#000', marginBottom: '5px', fontWeight: 'bold' as 'bold', textTransform: 'uppercase' as 'uppercase' }

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '0px',
  border: '2px solid #000',
  boxSizing: 'border-box' as 'border-box',
}

const buttonStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '0px',
  border: '2px solid #000',
  backgroundColor: '#000',
  color: 'white',
  fontWeight: 'bold' as 'bold',
  textTransform: 'uppercase' as 'uppercase',
  cursor: 'pointer',
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '15px 10px',
  borderBottom: '2px solid #000',
  fontSize: 14,
  color: '#000',
  whiteSpace: 'nowrap',
  textTransform: 'uppercase',
  fontWeight: 'bold',
}

const tdStyle: React.CSSProperties = {
  padding: '15px 10px',
  borderBottom: '1px solid #000',
  fontSize: 14,
  color: '#000',
  whiteSpace: 'nowrap',
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.85)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  zIndex: 9999,
}

const modalStyle: React.CSSProperties = {
  width: 'min(900px, 95vw)',
  background: 'white',
  borderRadius: 0,
  border: '2px solid #000',
  padding: 24,
  boxShadow: 'none',
}