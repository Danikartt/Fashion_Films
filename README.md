# 🎬 Fashion Films

Aplicación web para explorar y gestionar una base de datos de fashion films — cortometrajes audiovisuales del mundo de la moda.

🔗 **Deploy en producción:** [fashion-films.vercel.app](https://fashion-films.vercel.app)

---

## 🛠️ Stack tecnológico

- **Frontend:** Next.js, TypeScript, React, CSS Modules
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

> Pantalla de inicio <img width="615" height="583" alt="FF_registro-inicio" src="https://github.com/user-attachments/assets/32228891-5794-47d0-a299-4d8676c08f2f" />

> Pantalla principal <img width="1258" height="785" alt="FF_principal" src="https://github.com/user-attachments/assets/63a6f803-9d2d-4a19-afc6-3594b4787204" />

> Pantalla principal, modo oscuro <img width="1160" height="784" alt="FF_principal_noche" src="https://github.com/user-attachments/assets/7bb679b5-e930-4024-82fe-d4fe2416b38c" />

> Lista de favoritos <img width="1164" height="679" alt="FF_favoritos" src="https://github.com/user-attachments/assets/de43ec60-86db-417d-913f-5d0a26d93f4d" />

> Formulario <img width="1179" height="835" alt="FF_formulario" src="https://github.com/user-attachments/assets/3650825f-a0c2-49d6-a3c1-4ed03760c7de" />



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
