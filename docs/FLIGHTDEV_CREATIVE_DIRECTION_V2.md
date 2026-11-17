# FlightDev: dirección creativa v2, "Plan de vuelo"

Complementa `FLIGHTDEV_ART_DIRECTION.md` (tokens, tipografía y lo que se evita siguen vigentes). Intensidad creativa: 7–8 de 10; marca premium B2B, sin espectáculo que retrase la lectura.

## Idea

El home es **un plan de vuelo real**: despega en Manizales sobre el relieve verdadero de la Cordillera Central y aterriza en el contacto. Cada sección es un tramo con código, nombre y siguiente *waypoint*; una sola línea discontinua los une en el margen izquierdo y el header muestra en qué tramo va el lector.

| Waypoint | Sección | Componente | Qué demuestra |
|---|---|---|---|
| ORIGEN · MANIZALES | Hero sobre relieve real | `HeroSection` + `art/CordilleraFlight` | Dónde estamos y qué hacemos, con instrumentos reales |
| 001 · PRODUCTOS | Vendra y FleetTrack a todo el ancho | `home/ProductScenes` | Lo que operamos: demo interactiva y captura real |
| 002 · INGENIERÍA | Matriz capacidad × sistema en producción | `home/EngineeringMatrix` | Qué sabemos construir y dónde ya funciona |
| 003 · CASO | AG Clean Ops como carta de aproximación (planta + perfil) | `home/CaseChart` | Un proyecto de cliente de punta a punta |
| 004 · MÉTODO | Lista de chequeo reto/respuesta | `home/MethodChecklist` | Cómo trabajamos, en el formato de una cabina |
| (bitácora) | Manifiesto "día trescientos" | `home/Manifesto` | Por qué diseñamos para la operación |
| DESTINO · CONTACTO | Aproximación final al aeródromo | `home/Destination` | La acción comercial y las rutas por tipo de caso |

Los códigos viven en `src/content/flightplan.ts`.

## Reglas del lenguaje

- **Nada inventado.** Coordenadas reales (relieve SRTM, base 05°04′N 75°31′W), capacidades respaldadas por código o caso publicado, "No publicamos resultados sin autorización del cliente" en lugar de cifras.
- **Un acento por función.** `cielo` = ruta y señal; `voltaje` = acción comercial y destino; FleetTrack azul, Vendra lima.
- **Papel de día, noche después.** El hero es carta sobre papel (`nube`); el resto del vuelo es nocturno (`noche`/`vuelo` alternados por tramo). La lista de chequeo vuelve al papel como objeto físico.
- **Instrumentos también en móvil.** La tabla (base, posición, hora local, próximo) aparece bajo las acciones en pantallas pequeñas.
- **Marcadores solo sobre imágenes estables.** La captura de FleetTrack lleva marcadores numerados; la demo de Vendra no, porque su diseño cambia por pestaña (la leyenda la describe aparte).

## El relieve del hero

Mapa de alturas de 256×256 px, 16 bits (R = byte alto, G = byte bajo, metros), `public/terrain/cordillera-central.png` (79 KB). Cubre 4°45′–5°11′N, 75°12′–75°38′W (~48,4 km de lado): Manizales en la esquina noroeste, Nevado del Ruiz al sureste.

Procedimiento para regenerarlo:

1. Descargar los tiles Terrarium z10, x 296–298, y 496–499: `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/10/{x}/{y}.png` (Mapzen Terrain Tiles, SRTM; atribución obligatoria, ya en la leyenda del hero).
2. Decodificar `h = R·256 + G + B/256 − 32768` y montar el mosaico 3×4.
3. Recortar `x0=218, y0=319, lado 318 px`; redimensionar a 256 px (bicúbico).
4. Suavizar con gaussiana separable σ = 0,9 px (evita escalones en las curvas de nivel).
5. Guardar como PNG RGB: R = h >> 8, G = h & 255, B = 0.

Lugares en coordenadas uv del mapa (`terrain-gl.ts` → `DEM.places`): Manizales (0,2847; 0,2519), Nevado del Ruiz (0,7193; 0,6617). Exageración vertical 1,8×, declarada en la leyenda.

## Render

Ver `docs/adr/ADR-001-hero-webgl2-dem-real.md`. Malla de 256² vértices (128² en móvil), sombreado de colina desde el noroeste, curvas cada 100 m y maestras cada 500 m con `fwidth`, niebla por distancia, fundido en bordes. Una capa 2D encima dibuja la ruta discontinua, el siguiente *waypoint* y los rótulos MANIZALES / NEVADO DEL RUIZ. La cámara sigue el terreno a 1,1 km/s de mapa; en marcos estrechos (relación < 2) mira más abajo para que el relieve llene el lienzo.
