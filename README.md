# NEXUS LABS — biblioteca de plantillas

Sitio comercial de **NEXUS LABS**: una biblioteca navegable de 88 plantillas web
reales (restaurantes, hoteles, tiendas, inmobiliaria, SaaS, educación, eventos,
portafolios, causas y apps) con demo propia, ficha técnica honesta y un camino
directo por correo a `info@nexviro.art` (con copia a `meridian@nexviro.art`)
para pedir una versión personalizada.

**Sitio publicado:** https://christianhola.github.io/plantillas-freebuff/

## Qué hace

- Portada editorial con capturas reales de las plantillas, toggle día/noche,
  filtros por industria, búsqueda y tarjetas con estado honesto:
  `Demo estática`, `App local` o `Requiere servicio externo`.
- Cada tarjeta abre una ficha lateral con qué incluye, qué funciona sin servidor,
  qué necesita backend, crédito al autor y dos acciones: ver la demo completa o
  solicitar una versión personalizada por correo.
- Cada demo incluye una barra de NEXUS LABS con el nombre de la plantilla, vuelta
al catálogo, aviso de que es una demo estática y un aviso de recuperación si la
página no termina de cargar. Las apps con router propio respetan el prefijo
público: las 88 demos se auditaron una a una y ya no muestran “Page not found”.

Los juegos (`orbit`, `coil`, `crosscut`, `bedwars-lite`, `indie-game`) se pueden
jugar sin servidor. `orbit` y `coil` intentan primero el WebSocket multijugador y,
si no existe, arrancan la misma simulación en local con bots.

- Créditos y licencias: los diseños y el código original pertenecen a los autores
  del catálogo público de Freebuff. NEXUS LABS firma la curaduría, el contenido,
  la personalización y la publicación. Si eres autor y quieres retirar una
  plantilla, escríbenos.

## Cómo se genera

La fuente vive en este repositorio privado. El repositorio público solo recibe el
artefacto compilado y verificado; nunca la app de la galería, los scripts, el
catálogo ni los mapas de fuente.

```sh
bun library/scripts/build-library.mjs --static   # compila las 88 demos y la galería
bun library/scripts/prepare-public.mjs           # arma dist-public con lista blanca
bun library/scripts/verify-public.mjs            # falla si hay fuente, mapas o secretos
bun library/scripts/serve.mjs                    # preview local (PORT=3000 por defecto)
```

Variables útiles:

| Variable | Para qué |
| --- | --- |
| `BASE_PREFIX` | Prefijo público del sitio (`/plantillas-freebuff/` en Pages). |
| `BUILD_CONCURRENCY` | Plantillas compiladas en paralelo (4 en CI). |

El build es incremental: las demos ya compiladas se saltan. Para forzar una
recompilación completa, añade `--force`. El workflow cachea `library/demos` y
`library/previews` con un hash de los scripts y del catálogo.

## Estructura

```
library/
  scripts/
    build-library.mjs   # descarga, compila y ensambla el sitio
    gallery.mjs         # datos de la galería (industrias y fichas)
    serve.mjs           # servidor local
  gallery/              # app Vite + React 19 + Tailwind v4
    src/                # componentes shadcn/ui y Magic UI, tema y secciones
    public/             # favicon y estáticos
    bun.lock            # dependencias fijadas
  games/                # overrides privados y auditados de algunas plantillas
  demos/                # salida generada (no versionada)
  previews/             # capturas generadas (no versionada)
  index.html            # build de la galería generado (no versionado)
```

`library/index.html` y `library/assets` son la compilación de `library/gallery`.
`library/demos`, `library/previews`, `library/gallery/src/templates.json` y
`dist-public` se generan en el build; no se versionan. `library/games` contiene
solo los parches de enrutado y modo local que necesitan algunas plantillas; se
compilan igual que las descargadas y nunca se publican como fuente.

## Despliegue

Hay dos repositorios:

- **Fuente (privado):** este proyecto. Cada push a `main` ejecuta
  `.github/workflows/publish.yml`, compila todo, arma `dist-public`, ejecuta el
  verificador anti-fuga y hace force-push del artefacto a `gh-pages`.
- **Público:** `christianhola/plantillas-freebuff`, solo con la rama `gh-pages`.
  GitHub Pages debe servir esa rama desde `/ (root)`.

El workflow necesita el secret `PUBLIC_DEPLOY_KEY`: una deploy key SSH con
escritura sobre el repositorio público. Sin ese secret el job falla antes de
publicar. El artefacto se puede revisar en local con `prepare-public.mjs` y
`verify-public.mjs`; el verificador rechaza mapas, `.ts`, catálogos, scripts,
bucket interno, claves y tokens.
