var token = getToken('utm-token');
let serverUrl = getServerUrl();

mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhd253dXBsdXMiLCJhIjoiY2p3bDd0MmljMDJuNjN5bWM0amE4Zjh1dyJ9.egOLl8lhG8LhBFktHTuIhw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v11',
    center: [119.885922, 23.543487],
    zoom: 7.4
});

var trajectoryFeature = {
    'type': 'Feature',
    'geometry': {
        'type': 'LineString',
        'coordinates': []
    },
    "properties": {}
};

var wayPointFeature = {
    'type': 'Feature',
    'geometry': {
        'type': 'LineString',
        'coordinates': []
    },
    "properties": {}
};

function setTrajectoryFeatureLayer() {
    map.addSource('trajectory', {
        'type': 'geojson',
        'data': trajectoryFeature
    });
    map.addLayer({
        'id': 'trajectory',
        'type': 'line',
        'source': 'trajectory',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': 'rgba(0,0,0,1)',
            'line-width': 5.5
        }
    });
}

function setFlightPlanWayPoints() {
    map.addSource('wayPoints', {
        'type': 'geojson',
        'data': wayPointFeature
    });
    map.addLayer({
        'id': 'wayPoints',
        'type': 'line',
        'source': 'wayPoints',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': '#7971ea',
            'line-dasharray': [3, 1],
            'line-width': 6
        }
    });
}

function uploadTrajectoryFile() {
    const trajectoryFile = document.getElementById("trajectory_file");

    const formData = new FormData;

    formData.append("file", trajectoryFile.files[0]);
    document.getElementById("trajectory_file_name").textContent = trajectoryFile.files[0].name;

    fetch(serverUrl + '/analysis/file/trajectory', {
        method: 'POST',
        body: formData,
        headers: new Headers({
            'Authorization': token
        })
    }).then(
        response => response.json()
    ).then(
        trajectory => {
            trajectoryCoordinate = [];

            var i;
            for (i = 0; i < trajectory.length; i++) {
                trajectoryCoordinate.push([trajectory[i][1], trajectory[i][0]]);
            }

            trajectoryFeature.geometry.coordinates = trajectoryCoordinate;
            map.getSource('trajectory').setData(trajectoryFeature);

            let mid = parseInt(trajectory.length / 2);

            console.log(trajectory[mid][1]);
            console.log(trajectory[mid][0]);

            map.flyTo({
                center: [
                    trajectory[mid][1],
                    trajectory[mid][0]
                ],
                zoom: 18,
                essential: true
            });
        }
    ).catch(
        error => console.log(error)
    );
}

function uploadWayPointsFile() {
    const wayPointsFile = document.getElementById("wayPointFile");
    const formData = new FormData;

    formData.append("file", wayPointsFile.files[0]);

    document.getElementById("waypoints_file_name").textContent = wayPointsFile.files[0].name;

    fetch(serverUrl + '/analysis/file/wayPoints', {
        method: 'POST',
        body: formData,
        headers: new Headers({
            'Authorization': token
        })
    }).then(
        response => response.json()
    ).then(
        success => {
            planCoordinate = [];
            var i;
            for (i = 0; i < success.length; i++) {
                planCoordinate.push([success[i][1], success[i][0]]);
            }
            wayPointFeature.geometry.coordinates = planCoordinate;
            map.getSource('wayPoints').setData(wayPointFeature);
            let mid = parseInt(success.length / 2);
            map.flyTo({
                center: [
                    success[mid][1],
                    success[mid][0]
                ],
                zoom: 18,
                essential: true
            });
        }
    ).catch(
        error => console.log(error)
    );
}

function submit_analysis() {
    const wayPointsFile = document.getElementById("wayPointFile");
    const trajectoryFile = document.getElementById("trajectory_file");
    const formData = new FormData;

    formData.append("file", trajectoryFile.files[0]);
    formData.append("file", wayPointsFile.files[0]);

    console.log(formData);

    fetch(serverUrl + '/analysis/stability', {
        method: 'POST',
        body: formData,
        headers: new Headers({
            'Authorization': token
        })
    }).then(
        response => response.json()
    ).then(
        success => {
            console.log(+success);
            alert("穩定度為:" + success);

            document.getElementById('stability_value').textContent = success;
        }
    ).catch(
        error => console.log(error)
    );
}

function selectWayPointsFile() {
    document.getElementById('wayPointFile').click();
}

function selectTrajectoryFile() {
    document.getElementById('trajectory_file').click();
}

map.on('load', function () {
    setTrajectoryFeatureLayer();
    setFlightPlanWayPoints();
});