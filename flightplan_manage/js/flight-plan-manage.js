mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhd253dXBsdXMiLCJhIjoiY2p3bDd0MmljMDJuNjN5bWM0amE4Zjh1dyJ9.egOLl8lhG8LhBFktHTuIhw';
let map = new mapboxgl.Map({
    container: 'select-flight-path-map',
    style: 'mapbox://styles/mapbox/outdoors-v11',
    center: [120.870817, 23.679199],
    zoom: 7
});

let selectPathGeoJson = {
    'type': 'Feature',
    'geometry': {
        'type': 'LineString',
        'coordinates': []
    },
    'properties': {
        'icon': {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': []
            }
        }
    }

};

let pathCoordinate = {"coordinate": []};

function mouseSelectFlightPlanPath() {
    map.addSource('expected-paln-path-source', {
        'type': 'geojson',
        'data': selectPathGeoJson
    });
    map.addLayer({
        'id': 'expected-paln-path',
        'type': 'line',
        'source': 'expected-paln-path-source',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': '#666666',
            'line-width': 6
        }
    });

    map.loadImage('https://i.imgur.com/Q8dRejz.png', function (error, image) {
        if (error) throw error;
        map.addImage('uav', image);
        map.addLayer({
            "id": "drone",
            "type": "symbol",
            "source": "drone",
            "layout": {
                "icon-image": 'uav',
                'visibility': 'visible'
            }
        });
    });
    map.addSource('drone', {type: 'geojson', data: selectPathGeoJson.properties.icon});


    //左鍵選擇航點
    map.on('click', function (e) {
        let thisLngLat = JSON.parse(JSON.stringify(e.lngLat.wrap()));
        let lng = thisLngLat.lng;
        let lat = thisLngLat.lat;
        let coordinate = [lng, lat];
        pathCoordinate.coordinate.push(coordinate);
        updateSelectPathMap(pathCoordinate.coordinate);

    });

    //右鍵移除最新選的一點
    map.on('contextmenu', function (e) {
        if (pathCoordinate.coordinate.length != 0) {
            pathCoordinate.coordinate.pop();
            updateSelectPathMap(pathCoordinate.coordinate);
        }
    });

}

function updateSelectPathMap(planPathArray) {
    selectPathGeoJson.geometry.coordinates = planPathArray;
    selectPathGeoJson.properties.icon.geometry.coordinates = planPathArray[planPathArray.length - 1];

    map.getSource('expected-paln-path-source').setData(selectPathGeoJson);
    map.getSource('drone').setData(selectPathGeoJson.properties.icon);

    if (pathCoordinate.coordinate.length == 0) {
        map.setLayoutProperty('drone', 'visibility', 'none');
    } else {
        map.setLayoutProperty('drone', 'visibility', 'visible');
    }

    if (pathCoordinate.coordinate.length == 0) {
        document.getElementById('flight-plan-path').value = "Flight Plan Path";
    } else {
        if (planPathArray.length > 1) {
            document.getElementById('flight-plan-path').value = planPathArray.length + ' waypoints';
        } else {
            document.getElementById('flight-plan-path').value = JSON.stringify(planPathArray);
        }
    }
}


function setAllUavByPilot() {
    fetch(serverUrl + '/account/drones', {
        method: 'GET',
        headers: new Headers({
            'Authorization': token
        })
    }).then((response) => {
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(response => {
            let uavList = response.data;
            for (let i = 0; i < uavList.length; i++) {
                let uav = uavList[i];
                document.getElementById('uav-list').options[i] = new Option(uav['macAddress'], uav['macAddress'])
            }
        });
    });
}

map.on('load', function () {
    document.getElementById('apply-pilot-account').value = getToken('utm-pilotName');

    setForbidAirPortAreaLayer();
    setForbidMilitaryCampAreaLayer();
    setRestrictAreaAirportNearbyAreaLayer();

    setPrePareFlightPlanLayer();
    setExecutingFlightPlanLayer();
    setExpireFlightPlanLayer();


    setAllUavByPilot();
    mouseSelectFlightPlanPath();
});


const applyPlanForm = document.getElementById("apply-plan-form");
applyPlanForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const registerPlanFormData = new FormData(this);

    let uavMacAddress = registerPlanFormData.get('uav-macAddress');
    let expectedDate = registerPlanFormData.get('expected-date');
    let expectedTakeoffTime = registerPlanFormData.get('expected-start-time');
    let expectedArrivalsTime = registerPlanFormData.get('expected-end-time');
    let maxFlyingAltitude = registerPlanFormData.get('expected-flying-height');
    let description = registerPlanFormData.get('flight-description');

    let planForm = {
        "macAddress": uavMacAddress,
        "executionDate": expectedDate,
        "startTime": expectedTakeoffTime,
        "endTime": expectedArrivalsTime,
        "maxFlyingAltitude": maxFlyingAltitude,
        "flightPlanWayPoints": pathCoordinate,
        "description": description
    };

    fetch(serverUrl + '/flightPlan', {
        method: 'POST',
        body: JSON.stringify(planForm),
        headers: new Headers({
            'Authorization': token,
            'Content-Type': 'application/json'
        })
    }).then((response) => {
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            $("#Signup-Plan-Status-Modal").modal('show');
            if (res.status === 200) {
                $("#register-message").text("Register success");
            } else {
                $("#register-message").text(res.data.errors[0].message);
            }
        });
    });

});