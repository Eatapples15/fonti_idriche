const dataTableContainer = document.getElementById('data-table-container');

fetch('https://fonti-idriche-basilicata-web-data.s3.us-west-2.amazonaws.com/fonti_idriche_basilicata_scale100_v3.csv')
    .then(response => response.text())
    .then(csvData => {
        const lines = csvData.split('\n').map(line => line.trim());
        const header = lines[0].split(',');
        const dataRows = lines.slice(1);

        let tableHTML = '<table><thead><tr>';
        header.forEach(col => {
            tableHTML += `<th>${col}</th>`;
        });
        tableHTML += '</tr></thead><tbody>';

        dataRows.forEach(row => {
            const values = row.split(',');
            if (values.length === header.length) {
                tableHTML += '<tr>';
                header.forEach((col, index) => {
                    let cellValue = values[index];
                    if (col.toLowerCase() === 'latitudine' && values[header.indexOf('Longitudine')]) {
                        const lat = values[index];
                        const lon = values[header.indexOf('Longitudine')];
                        cellValue = `<span class="coordinate" onclick="copyToClipboard('${lat}, ${lon}')" title="Clicca per copiare le coordinate">${lat}, ${lon}</span> <button onclick="openStreetMapSearch('${lat}', '${lon}')">Cerca su OSM</button>`;
                    }
                    tableHTML += `<td>${cellValue}</td>`;
                });
                tableHTML += '</tr>';
            }
        });

        tableHTML += '</tbody></table>';
        dataTableContainer.innerHTML = tableHTML;
        console.log("Tabella CSV creata e inserita.");
    })
    .catch(error => {
        console.error("Errore nel caricamento del file CSV:", error);
    });
