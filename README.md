# GeoCanoabo - Geoportal Canoabo

GeoCanoabo es una aplicación web de geoportal desarrollada en Vue 3, Leaflet y Vite, que permite visualizar capas geográficas, consultar atributos de suelo y explorar información espacial de la zona Canoabo.

## Características principales

- **Mapa interactivo** con capas base (OpenStreetMap, Esri Satelital) y overlays (Perímetro, Ríos, Embalse, Suelo).
- **Consulta de atributos** de la capa Suelo mediante clic y popups dinámicos (GetFeatureInfo WMS).
- **Visualización de coordenadas** en tiempo real (EPSG:2202).
- **Control de escala** integrado.
- **Componentización limpia y semántica** siguiendo buenas prácticas de clean code.
- **Arquitectura desacoplada** para fácil mantenimiento y extensión.

## Estructura del proyecto

```
geoportal/
├── src/
│   ├── components/
│   │   ├── MapView.vue         # Orquestador principal del mapa
│   │   ├── map/
│   │   │   ├── MapBase.vue         # Inicializa el mapa Leaflet
│   │   │   ├── MapLayers.vue       # Añade capas base y overlays
│   │   │   ├── MapPopupSuelo.vue   # Popups con atributos de suelo
│   │   │   ├── MapScale.vue        # Control de escala
│   │   │   └── MapCoords.vue       # Muestra coordenadas en tiempo real
│   │   ├── Header.vue
│   │   └── Sidebar.vue
│   ├── main.js
│   └── ...
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .gitignore
└── README.md
```

## Instalación y ejecución local

1. **Clona el repositorio:**
   ```sh
   git clone git@github.com:JoseCaicedoDev/geocanoabo.git
   cd geocanoabo
   ```
2. **Instala dependencias:**
   ```sh
   npm install
   ```
3. **Ejecuta la app en modo desarrollo:**
   ```sh
   npm run dev
   ```
4. Accede a [http://localhost:5173](http://localhost:5173) en tu navegador.

## Uso y componentes principales

- `MapView.vue`: Orquesta y conecta todos los subcomponentes del mapa.
- `MapBase.vue`: Inicializa el objeto `map` de Leaflet y lo expone mediante evento.
- `MapLayers.vue`: Añade las capas base y overlays, emite la capa de suelo para los popups.
- `MapPopupSuelo.vue`: Gestiona los popups de atributos de suelo usando GetFeatureInfo.
- `MapScale.vue`: Añade el control de escala de Leaflet.
- `MapCoords.vue`: Añade el control de coordenadas en tiempo real (EPSG:2202).

## Buenas prácticas implementadas

- **Separación de responsabilidades**: cada componente tiene una función clara y única.
- **Comunicación entre componentes**: uso de eventos personalizados y props.
- **Código limpio y semántico**: fácil de leer, mantener y extender.
- **Uso de .gitignore**: excluye dependencias y archivos temporales.

## Dependencias principales

- [Vue 3](https://vuejs.org/)
- [Leaflet](https://leafletjs.com/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/) (opcional para estilos)
- [proj4js](https://proj4js.org/) (para reproyección de coordenadas)

## Personalización y extensión

- Puedes agregar nuevas capas WMS fácilmente en `MapLayers.vue`.
- Puedes crear nuevos componentes para leyendas, filtros, etc., siguiendo la misma arquitectura.

## Autor

- José Caicedo ([JoseCaicedoDev](https://github.com/JoseCaicedoDev))

---

¡Contribuciones y sugerencias son bienvenidas!

# geocanoabo
Geoportal de canoabo
