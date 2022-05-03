mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map',
    projection: 'albers',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 3.5,
    center: [-100, 40]
});

const caseGrades = [100, 1000, 10000, 100000],
    deathGrades = [10, 50, 100, 500, 1000],
    colors = ['rgb(255,255,212)', 'rgb(254,217,142)', 'rgb(254,153,41)', 'rgb(204,76,2)', 'rgb(153,52,4)'],
    radii = [5, 10, 15, 20, 25];

map.on('load', () => {

    map.addSource('counts', {
        type: 'geojson',
        data: 'assets/us-covid-2020-counts.json'
    });

    map.addLayer({
        'id': 'Cases',
        'type': 'circle',
        'source': 'counts',
        'minzoom': 2,
        'paint': {

            'circle-radius': {
                'property': 'cases',
                'stops': [
                    [{
                        zoom: 1,
                        value: caseGrades[0]
                    }, radii[0]],
                    [{
                        zoom: 1,
                        value: caseGrades[1]
                    }, radii[1]],
                    [{
                        zoom: 1,
                        value: caseGrades[2]
                    }, radii[2]],
                    [{
                        zoom: 1,
                        value: caseGrades[3]
                    }, radii[3]]
                ]
            },
            'circle-color': {
                'property': 'cases',
                'stops': [
                    [caseGrades[0], colors[0]],
                    [caseGrades[1], colors[1]],
                    [caseGrades[2], colors[2]],
                    [caseGrades[3], colors[3]]
                ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': 0.6
        }
    });

    map.addLayer({
        'id': 'Deaths',
        'type': 'circle',
        'source': 'counts',
        'minzoom': 2,
        'paint': {
            'circle-radius': {
                'property': 'deaths',
                'stops': [
                    [{
                        zoom: 1,
                        value: deathGrades[0]
                    }, radii[0]],
                    [{
                        zoom: 1,
                        value: deathGrades[1]
                    }, radii[1]],
                    [{
                        zoom: 1,
                        value: deathGrades[2]
                    }, radii[2]],
                    [{
                        zoom: 1,
                        value: deathGrades[3]
                    }, radii[3]],
                    [{
                        zoom: 1,
                        value: deathGrades[4]
                    }, radii[4]]
                ]
            },
            'circle-color': {
                'property': 'deaths',
                'stops': [
                    [deathGrades[0], colors[0]],
                    [deathGrades[1], colors[1]],
                    [deathGrades[2], colors[2]],
                    [deathGrades[3], colors[3]],
                    [deathGrades[3], colors[4]]
                ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': 0.6
        }
    });

    map.on('click', 'Cases', (event) => {
        map.flyTo({
            center: event.features[0].geometry.coordinates,
            zoom: 6
        });
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`<strong>County:</strong> ${event.features[0].properties.county}<br>
                                <strong>Cases:</strong> ${event.features[0].properties.cases}`)
            .addTo(map);
    });

    map.on('click', 'Deaths', (event) => {
        map.flyTo({
            center: event.features[0].geometry.coordinates,
            zoom: 6
        });
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`<strong>County:</strong> ${event.features[0].properties.county}<br>
                                <strong>Deaths:</strong> ${event.features[0].properties.deaths}`)
            .addTo(map);
    });

    createLegend('Cases');
    createLegend('Deaths');

});

map.on('idle', () => {
    // Enumerate ids of the layers.
    const toggleableLayerIds = ['Cases', 'Deaths'];

    // Set up the corresponding toggle button for each layer.
    for (const id of toggleableLayerIds) {
        // Skip layers that already have a button set up.
        if (document.getElementById(id)) {
            continue;
        }
        map.setLayoutProperty('Deaths', 'visibility', 'none');

        // Create a link.
        const link = document.createElement('a');
        link.id = id;
        link.href = '#';
        link.textContent = id;
        if (id === 'Deaths') {
            link.className = '';
            document.getElementById('deathsLegend').className = 'hidden';
        } else {
            link.className = 'active';
        }
        

        // Show or hide layer when the toggle is clicked.
        link.onclick = function (e) {
            const clickedLayer = this.textContent;
            e.preventDefault();
            e.stopPropagation();

            const visibility = map.getLayoutProperty(
                clickedLayer,
                'visibility'
            );

            // Toggle layer visibility by changing the layout object's visibility property.
            if (visibility === 'visible') {
                map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                this.className = '';
                document.getElementById(clickedLayer.toLowerCase() + 'Legend').className = 'hidden';
            } else {
                this.className = 'active';
                map.setLayoutProperty(
                    clickedLayer,
                    'visibility',
                    'visible'
                );
                document.getElementById(clickedLayer.toLowerCase() + 'Legend').className = '';
            }
        };

        const layers = document.getElementById('menu');
        layers.appendChild(link);
    }
});


function createLegend(type) {
    var legend;
    var grades = [];
    if (type == "Cases") {
        legend = document.getElementById('casesLegend');
        grades = caseGrades;
    } else {
        legend = document.getElementById('deathsLegend');
        grades = deathGrades;
    }

    var labels = ['<strong>' + type + '</strong>'],
        vbreak;

    

    for (var i = 0; i < grades.length; i++) {
        vbreak = grades[i];


        dot_radii = 2 * radii[i];
        labels.push(
            '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
            'px; height: ' +
            dot_radii + 'px; margin-right: 50px"></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
            '</span></p>');

    }

    const source =
        '<p style="color: white; text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">The New York Times</a></p>';

    legend.innerHTML = labels.join('') + source;
}