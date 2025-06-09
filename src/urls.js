// Archivo centralizado de URLs para servicios y mapas

export const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
export const ESRI_SAT_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
export const GEOSERVER_WMS_URL = 'http://geoserver.gira360.com:8080/geoserver/canoabo/wms';
export const GEOSERVER_WFS_SUELO_URL = '/geoserver/canoabo/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=canoabo:pg_Suelo8_ur&outputFormat=application/json&srsName=EPSG:4326';
