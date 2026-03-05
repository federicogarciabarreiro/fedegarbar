# Assets locales

Coloca aquí los recursos estáticos para servirlos junto al despliegue.

## Estructura

- `images/projects/` → imágenes de cada sección (recomendado `.webp` o `.avif`)
- `videos/projects/` → videos opcionales locales para secciones expandidas
- `icons/` → iconos del sitio (favicons, app icons, etc.)

También puedes usar enlaces de YouTube directamente en `src/sectionData.js`:

- `video: 'https://www.youtube.com/watch?v=VIDEO_ID'`
- `video: 'https://youtu.be/VIDEO_ID'`

Importante: para embebido web, el video debería estar en **No listado (Unlisted)** o público.
Los videos en **Privado** normalmente no se reproducen dentro del `iframe`.

## Nombres esperados actualmente

### Imágenes de proyectos
- `simuladores-interactivos.webp`
- `backend-integration.webp`
- `xr-3d-systems.webp`
- `performance-optimization.webp`
- `herramientas-internas.webp`
- `proyectos-destacados.webp`
- `formacion-hard-skills.webp`

### Videos de proyectos (opcionales)
- `simuladores-interactivos.mp4`
- `backend-integration.mp4`
- `xr-3d-systems.mp4`
- `performance-optimization.mp4`
- `herramientas-internas.mp4`
- `proyectos-destacados.mp4`
- `formacion-hard-skills.mp4`

Si falta un archivo local, la app usa automáticamente la URL externa de respaldo.
