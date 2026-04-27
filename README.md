# 🎬 Fashion Films

Aplicación web para explorar y gestionar una base de datos de fashion films — cortometrajes audiovisuales del mundo de la moda.

🔗 **Deploy en producción:** [fashion-films.vercel.app](https://fashion-films.vercel.app)

---

## 🛠️ Stack tecnológico

- **Frontend:** Next.js, React, CSS Modules
- **Backend / Base de datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **Despliegue:** Vercel (CD automático desde GitHub)

---

## ✨ Funcionalidades

- Autenticación de usuarios (registro e inicio de sesión)
- Exploración de más de 120 fashion films con datos limpios y normalizados
- Tabla responsive con filas expandibles en móvil
- Filtrado y búsqueda de contenido
- Seguridad a nivel de fila (Row Level Security) configurada en Supabase

---

## 🗄️ Base de datos

- Más de **120 registros** importados y limpiados desde Excel
- Limpieza y normalización de datos con funciones regex directamente en PostgreSQL
- Diseño relacional con control de acceso por roles (RLS)

---

## 📸 Capturas de pantalla

> *Próximamente*

---

## 🚀 Instalación local

```bash
git clone https://github.com/tu-usuario/fashion-films.git
cd fashion-films
npm install
```

Crea un archivo `.env.local` en la raíz con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave
```

Luego arranca el servidor de desarrollo:

```bash
npm run dev
```

---

## 👤 Autor

DaniKartt — [LinkedIn](www.linkedin.com/in/danilotavaresgomes) · [GitHub]([#](https://github.com/Danikartt))
