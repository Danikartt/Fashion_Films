-- ============================================================
-- CONSULTAS FAVORITAS / REGISTRO DE ACTIVIDAD PARA SUPABASE
-- Proyecto: FashionFilm Project
-- ============================================================

-- 1. Consultar todos los usuarios registrados
SELECT * 
FROM "Usuarios";

-- 2. Resumen de Fashion Films (título, dirección, fecha de publicación, duración y visualizaciones)
SELECT film_id, titulo, direccion, fecha_publicacion, duracion, visualizaciones 
FROM "FashionFilms";

-- 3. Registro de acciones de usuario (vistos y favoritos)
SELECT * 
FROM "AccionUsuario";

-- 4. Registro de todos los comentarios
SELECT * 
FROM "Comentarios";

-- 5. Relación completa de Comentarios con Nombres de Usuario y Títulos de Película (Vista Segura)
CREATE OR REPLACE VIEW vista_comentarios_detallados WITH (security_invoker = true) AS
SELECT 
    u.nombre AS usuario, 
    f.titulo AS film, 
    c.comentario, 
    c.fecha_comentario 
FROM "Comentarios" c 
JOIN "Usuarios" u ON c.usuario_id = u.usuario_id 
JOIN "FashionFilms" f ON c.film_id = f.film_id 
ORDER BY c.fecha_comentario DESC;

SELECT * FROM vista_comentarios_detallados;

-- 6. Métricas Agregadas por Película (Vista Segura)
CREATE OR REPLACE VIEW vista_metricas_peliculas WITH (security_invoker = true) AS
SELECT 
    f.titulo, 
    f.visualizaciones, 
    COUNT(a.accion_id) FILTER (WHERE a.favorito = true) AS fav_count, 
    COUNT(c.id) AS comments_count 
FROM "FashionFilms" f 
LEFT JOIN "AccionUsuario" a ON f.film_id = a.film_id 
LEFT JOIN "Comentarios" c ON f.film_id = c.film_id 
GROUP BY f.film_id, f.titulo, f.visualizaciones 
ORDER BY visualizaciones DESC;

SELECT * FROM vista_metricas_peliculas LIMIT 10;

-- 7. Listar Extensiones de PostgreSQL Instaladas y sus versiones
SELECT name, default_version, installed_version 
FROM pg_available_extensions 
WHERE installed_version IS NOT NULL;

-- 8. Tamaño total de almacenamiento utilizado por cada tabla en el esquema público
SELECT 
    table_name, 
    pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) AS total_size 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC;

-- 9. Ajuste de search_path para funciones de autenticación (solución error gen_salt / crypt)
ALTER FUNCTION public.hashear_clave() SET search_path = public, extensions;
ALTER FUNCTION public.verificar_login(text, text) SET search_path = public, extensions;

