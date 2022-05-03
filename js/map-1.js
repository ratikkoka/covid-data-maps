mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map',
    projection: 'albers',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 3.5,
    center: [-100, 40]
});

const layers = [
    '0-9',
    '10-19',
    '20-49',
    '50-99',
    '100-199',
    '200-499',
    '500-999',
    '1000 and more'
];
const colors = [
    '#FFEDA070',
    '#FED97670',
    '#FEB24C70',
    '#FD8D3C70',
    '#FC4E2A70',
    '#E31A1C70',
    '#BD002670',
    '#80002670'
];



map.on('load', () => {

    map.addSource('rates', {
        type: 'geojson',
        data: 'assets/us-covid-2020-rates.json'
    });

    map.addLayer({
        'id': 'countyData',
        'type': 'fill',
        'source': 'rates',
        'paint': {
            'fill-color': [
                'step',
                ['get', 'rates'],
                '#FFEDA0',   // stop_output_0
                10,          // stop_input_0
                '#FED976',   // stop_output_1
                20,          // stop_input_1
                '#FEB24C',   // stop_output_2
                50,          // stop_input_2
                '#FD8D3C',   // stop_output_3
                100,         // stop_input_3
                '#FC4E2A',   // stop_output_4
                200,         // stop_input_4
                '#E31A1C',   // stop_output_5
                500,         // stop_input_5
                '#BD0026',   // stop_output_6
                1000,        // stop_input_6
                "#800026"    // stop_output_7
            ],
            'fill-outline-color': '#BBBBBB',
            'fill-opacity': 0.7,
        }
    });

    map.on('click', 'countyData', (event) => {
        map.flyTo({
            center: event.lngLat,
            zoom: 6
        });

        new mapboxgl.Popup()
            .setLngLat(event.lngLat)
            .setHTML(
            `<strong><em>County: </strong></em>${event.features[0].properties.county}<br>
            <strong><em>State: </strong></em>${event.features[0].properties.state}<br>
            <strong><em>Rate: </strong></em>${event.features[0].properties.rates}`)
            .addTo(map);
    });

});

const legend = document.getElementById('ratesLegend');
legend.innerHTML = "<b>Covid Rates<br>2020</b><br><br>";

layers.forEach((layer, i) => {
    const color = colors[i];
    const item = document.createElement('div');
    const key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    const value = document.createElement('span');
    value.innerHTML = `${layer}`;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
});

const source = document.createElement('div');

source.innerHTML = '<p style="text-align: right; font-size:10pt">Source: <a href="https://data.census.gov/cedsci/table?g=0100000US%24050000&d=ACS%205-Year%20Estimates%20Data%20Profiles&tid=ACSDP5Y2018.DP05&hidePreview=true">2018 ACS 5 year estimates</a></p>';
legend.appendChild(source);