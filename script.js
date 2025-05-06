var map = L.map('mapid').setView([40.33, 16.67], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

var resourceList = document.getElementById('resources');
var geojsonLayer;

fetch('https://fonti-idriche-basilicata-web-data.s3.us-west-2.amazonaws.com/fonti_idriche_basilicata_scale100_v3.geojson')
    .then(response => response.json())
    .then(data => {
        console.log("Dati GeoJSON scaricati:", data); // Vedi la struttura principale dei dati
        geojsonLayer = L.geoJSON(data, {
            style: function (feature) {
                return {color: "blue", fillColor: "lightblue", weight: 1, opacity: 1, fillOpacity: 0.7};
            },
            onEachFeature: function (feature, layer) {
                console.log("Feature corrente:", feature); // Vedi ogni singola feature
                var listItem = document.createElement('li');
                listItem.textContent = "Fonte Idrica (Area: " + feature.properties.area_hectares.toFixed(2) + " ha)";
                listItem.addEventListener('click', function() {
                    map.flyTo(layer.getBounds().getCenter(), 12);
                    layer.openPopup();
                });

                if (feature.properties && feature.properties.area_hectares) {
                    layer.bindPopup("Area: " + feature.properties.area_hectares.toFixed(2) + " ettari");
                } else {
                    console.warn("La feature non ha la proprietà 'area_hectares':", feature); // Avvisa se manca la proprietà
                }
                resourceList.appendChild(listItem);
            }
        }).addTo(map);
    })
    .catch(error => {
        console.error("Errore nel caricamento del GeoJSON:", error);
    });
