var map = L.map('mapid').setView([40.33, 16.67], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

var resourceList = document.getElementById('resources');

fetch('https://fonti-idriche-basilicata-web-data.s3.us-west-2.amazonaws.com/fonti_idriche_basilicata_scale100_v3.csv') // Sostituisci con l'URL del tuo file CSV
    .then(response => response.text())
    .then(csvData => {
        console.log("Dati CSV scaricati:", csvData); // Mostra i dati CSV grezzi
        const lines = csvData.split('\n').map(line => line.trim());
        const header = lines[0].split(',');
        const dataRows = lines.slice(1);

        dataRows.forEach(row => {
            const values = row.split(',');
            if (values.length === header.length) {
                const record = {};
                header.forEach((col, index) => {
                    record[col] = values[index];
                });

                const lat = parseFloat(record.Latitudine);
                const lon = parseFloat(record.Longitudine);
                const areaHa = parseFloat(record.Area_ha);
                 const nomeFonte = record.Nome || "Fonte Idrica";

                if (!isNaN(lat) && !isNaN(lon)) {
                    const marker = L.circleMarker([lat, lon], {
                        radius: Math.sqrt(areaHa) * 5, // Esempio: raggio proporzionale alla radice dell'area
                        color: 'blue',
                        fillColor: 'lightblue',
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.7
                    }).addTo(map);

                    marker.bindPopup(`${nomeFonte}<br>Area: ${areaHa.toFixed(2)} ettari`);

                    const listItem = document.createElement('li');
                     listItem.textContent = `${nomeFonte} (Area: ${areaHa.toFixed(2)} ha)`;
                    listItem.addEventListener('click', function() {
                        map.flyTo([lat, lon], 12);
                        marker.openPopup();
                    });
                    resourceList.appendChild(listItem);
                } else {
                    console.warn("Coordinate non valide trovate nel CSV:", record);
                }
            }
        });
        console.log("Dati CSV caricati e visualizzati.");
    })
    .catch(error => {
        console.error("Errore nel caricamento del file CSV:", error);
    });
