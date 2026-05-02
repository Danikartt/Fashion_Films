# AI Agents Context: Fashion_Films

## Overview
This project is a web application built with **Next.js** and **React**. It serves as a database and viewer for "Fashion Films" (short audiovisual creations linked to fashion labels). 

## Tech Stack
- Framework: Next.js (Pages/App Router)
- Language: TypeScript
- Database & Backend: Supabase (Authentication, PostgreSQL Database)
- Styling: Inline styles & custom CSS (potentially to be migrated to Tailwind CSS or a modern styling solution as per frontend-design skills)

## Core Functionality
- **Authentication**: Custom login/registration system using Supabase `Usuarios` table.
- **Data Display**: Shows a list of fashion films with details (title, direction, release year, duration).
- **Video Playback**: Embedded video player for YouTube and Vimeo links.
- **User Interactions**: 
  - Tracking views (`visualizaciones`).
  - Marking films as favorites (`AccionUsuario` table).
- **Internationalization (i18n)**: Basic custom implementation with English and Spanish translations built into the components.

## AI Agent Guidelines
- **Frontend Design**: When creating or updating UI, aim for a polished, modern, and distinctive aesthetic. Refer to the `frontend-design` skill for guidelines on creating production-grade interfaces.
- **Supabase Integration**: Ensure database calls use the configured Supabase client (`src/lib/supabase`).
- **Code Style**: Maintain existing TypeScript interfaces and component structures.

## Database Tables Reference
- `FashionFilms`: film_id, titulo, direccion, fecha_publicacion, duracion, link, visualizaciones, creador_usuario_id
- `Usuarios`: usuario_id, nombre, clave
- `AccionUsuario`: accion_id, usuario_id, film_id, visualizado, favorito, fecha_accion
