var map = L.map('mapid').setView([40.33, 16.67], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

var resourceList = document.getElementById('resources');
var geojsonLayer;

fetch('https://drive.google.com/uc?export=download&id=1rWB_rjKvX_WHOenlagrxVBQf-aVFqLq1')
    .then(response => response.json())
    .then(data => {
        geojsonLayer = L.geoJSON(data, {
            style: function (feature) {
                return {color: "blue", fillColor: "lightblue", weight: 1, opacity: 1, fillOpacity: 0.7};
            },
            onEachFeature: function (feature, layer) {
                var listItem = document.createElement('li');
                listItem.textContent = "Fonte Idrica (Area: " + feature.properties.area_hectares.toFixed(2) + " ha)";
                listItem.addEventListener('click', function() {
                    map.flyTo(layer.getBounds().getCenter(), 12); // Zoom sulla fonte cliccata
                    layer.openPopup();
                });

                if (feature.properties && feature.properties.area_hectares) {
                    layer.bindPopup("Area: " + feature.properties.area_hectares.toFixed(2) + " ettari");
                }
                resourceList.appendChild(listItem);
            }
        }).addTo(map);
    })
    .catch(error => {
        console.error("Errore nel caricamento del GeoJSON:", error);
    });
