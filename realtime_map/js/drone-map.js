let todayDate = new Date();
let dd = String(todayDate.getDate()).padStart(2, '0');
let mm = String(todayDate.getMonth() + 1).padStart(2, '0');
let yyyy = todayDate.getFullYear();
let today = yyyy + '-' + mm + '-' + dd;

let token = getToken('utm-token');
document.getElementById('pilot-name').textContent = getToken('utm-pilotName');
let serverUrl = getServerUrl();


mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhd253dXBsdXMiLCJhIjoiY2p3bDd0MmljMDJuNjN5bWM0amE4Zjh1dyJ9.egOLl8lhG8LhBFktHTuIhw';
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v10',
    center: [119.885922, 23.543487],
    zoom: 7.4
});

function isTokenExpire(status) {
    if (status === 403) {
        window.location.replace("/index.html");
    }
}

function setExecutingFlightPlanLayer() {
    fetch(serverUrl + '/realTime/flightPlan/executing/', {
        method: 'GET',
        headers: new Headers({
            'Authorization': token,
            'Content-Type': 'application/json'
        })
    }).then(response => {
        response.json()
            .then(data => ({
                    data: data,
                    status: response.status
                })
            ).then(res => {
            isTokenExpire(res.status);
            map.addSource('executing-flight-plan-source', {
                type: 'geojson',
                data: res.data
            });
            map.addLayer({
                "id": "executing-flight-plan-layer",
                "type": "line",
                "source": "executing-flight-plan-source",
                "paint": {
                    "line-color": "#7971ea",
                    'line-dasharray': [3, 1],
                    "line-width": 6
                }
            });
            setExecutingStartPointAndEndPointIcon(res.data);
        })
    });
}


function setExecutingStartPointAndEndPointIcon(data) {
    let startPointList = [];
    for (let i = 0; i < data.features.length; i++) {
        let startPoint = data.features[i].properties['startPoint'];
        startPointList.push([JSON.parse(startPoint)[1], JSON.parse(startPoint)[0]]);
    }
    let startPointFeature = {
        "type": "Feature",
        "geometry": {
            "type": "MultiPoint",
            "coordinates": startPointList
        },
        "properties": {}
    };

    map.loadImage('/realtime_map/img/executing_plan_start_point.png', function (error, image) {
        if (error) throw error;
        map.addImage('executingStartPointIcon', image);
        map.addLayer({
            "id": "executingStartPointIcon-layer",
            "type": "symbol",
            "source": "executingStartPointIcon-source",
            "layout": {
                "icon-image": "executingStartPointIcon"
            }
        });
    });
    map.addSource('executingStartPointIcon-source', {type: 'geojson', data: startPointFeature});


    let endPointList = [];
    for (let i = 0; i < data.features.length; i++) {
        let endPoint = data.features[i].properties['endPoint'];
        endPointList.push([JSON.parse(endPoint)[1], JSON.parse(endPoint)[0]]);
    }
    let endPointFeature = {
        "type": "Feature",
        "geometry": {
            "type": "MultiPoint",
            "coordinates": endPointList
        },
        "properties": {}
    };
    map.loadImage('/realtime_map/img/executing_plan_end_point.png', function (error, image) {
        if (error) throw error;
        map.addImage('executingEndPointIcon', image);
        map.addLayer({
            "id": "executingEndPointIcon-layer",
            "type": "symbol",
            "source": "executingEndPointIcon-source",
            "layout": {
                "icon-image": "executingEndPointIcon"
            }
        });
    });
    map.addSource('executingEndPointIcon-source', {type: 'geojson', data: endPointFeature});
}

function setExpireFlightPlanLayer() {
    fetch(serverUrl + '/realTime/flightPlan/expired/', {
        method: 'GET',
        headers: new Headers({
            'Authorization': token,
            'Content-Type': 'application/json'
        })
    }).then(response => {
        response.json()
            .then(data => ({
                    data: data,
                    status: response.status
                })
            ).then(res => {
            isTokenExpire(res.status);
            map.addSource('expired-flight-plan-source', {
                type: 'geojson',
                data: res.data
            });
            map.addLayer({
                "id": "expired-flight-plan-layer",
                "type": "line",
                "source": "expired-flight-plan-source",
                "paint": {
                    "line-color": "#000000",
                    'line-dasharray': [3, 1],
                    'line-opacity': 0.5,
                    "line-width": 4
                }
            });
            setExpireStartPointAndEndPointIcon(res.data);
        })
    });
}

function setExpireStartPointAndEndPointIcon(data) {
    let startPointList = [];
    for (let i = 0; i < data.features.length; i++) {
        let startPoint = data.features[i].properties['startPoint'];
        startPointList.push([JSON.parse(startPoint)[1], JSON.parse(startPoint)[0]]);
    }
    let startPointFeature = {
        "type": "Feature",
        "geometry": {
            "type": "MultiPoint",
            "coordinates": startPointList
        },
        "properties": {}
    };

    map.loadImage('/realtime_map/img/expire_plan_start_point.png', function (error, image) {
        if (error) throw error;
        map.addImage('expireStartPointIcon', image);
        map.addLayer({
            "id": "expireStartPoint-layer",
            "type": "symbol",
            "source": "expireStartPointIcon-source",
            "layout": {
                "icon-image": "expireStartPointIcon"
            }
        });
    });
    map.addSource('expireStartPointIcon-source', {type: 'geojson', data: startPointFeature});


    let endPointList = [];
    for (let i = 0; i < data.features.length; i++) {
        let endPoint = data.features[i].properties['endPoint'];
        endPointList.push([JSON.parse(endPoint)[1], JSON.parse(endPoint)[0]]);
    }
    let endPointFeature = {
        "type": "Feature",
        "geometry": {
            "type": "MultiPoint",
            "coordinates": endPointList
        },
        "properties": {}
    };
    map.loadImage('/realtime_map/img/expire_plan_end_point.png', function (error, image) {
        if (error) throw error;
        map.addImage('expireEndPointIcon', image);
        map.addLayer({
            "id": "expireEndPoint-layer",
            "type": "symbol",
            "source": "expireEndPointIcon-source",
            "layout": {
                "icon-image": "expireEndPointIcon"
            }
        });
    });
    map.addSource('expireEndPointIcon-source', {type: 'geojson', data: endPointFeature});
}


function setPrePareFlightPlanLayer() {
    fetch(serverUrl + '/realTime/flightPlan/prepare/', {
        method: 'GET',
        headers: new Headers({
            'Authorization': token,
            'Content-Type': 'application/json'
        })
    }).then(response => {
        response.json()
            .then(data => ({
                    data: data,
                    status: response.status
                })
            ).then(res => {
            isTokenExpire(res.status);
            map.addSource('prepare-flight-plan-source', {
                type: 'geojson',
                data: res.data
            });
            map.addLayer({
                "id": "prepare-flight-plan-layer",
                "type": "line",
                "source": "prepare-flight-plan-source",
                "paint": {
                    "line-color": "#ffffff",
                    'line-dasharray': [3, 1],
                    "line-width": 6
                }
            });
            setPrepareStartPointAndEndPointIcon(res.data);
        })
    });
}

function setPrepareStartPointAndEndPointIcon(data) {
    let startPointList = [];
    for (let i = 0; i < data.features.length; i++) {
        let startPoint = data.features[i].properties['startPoint'];
        startPointList.push([JSON.parse(startPoint)[1], JSON.parse(startPoint)[0]]);
    }
    let startPointFeature = {
        "type": "Feature",
        "geometry": {
            "type": "MultiPoint",
            "coordinates": startPointList
        },
        "properties": {}
    };

    map.loadImage('/realtime_map/img/prepare_plan_start_point.png', function (error, image) {
        if (error) throw error;
        map.addImage('prepareStartPointIcon', image);
        map.addLayer({
            "id": "prepareStartPoint-layer",
            "type": "symbol",
            "source": "prepareStartPointIcon-source",
            "layout": {
                "icon-image": "prepareStartPointIcon"
            }
        });
    });
    map.addSource('prepareStartPointIcon-source', {type: 'geojson', data: startPointFeature});


    let endPointList = [];
    for (let i = 0; i < data.features.length; i++) {
        let endPoint = data.features[i].properties['endPoint'];
        endPointList.push([JSON.parse(endPoint)[1], JSON.parse(endPoint)[0]]);
    }
    let endPointFeature = {
        "type": "Feature",
        "geometry": {
            "type": "MultiPoint",
            "coordinates": endPointList
        },
        "properties": {}
    };
    map.loadImage('/realtime_map/img/prepare_plan_end_point.png', function (error, image) {
        if (error) throw error;
        map.addImage('prepareEndPointIcon', image);
        map.addLayer({
            "id": "prepareEndPoint-layer",
            "type": "symbol",
            "source": "prepareEndPointIcon-source",
            "layout": {
                "icon-image": "prepareEndPointIcon"
            }
        });
    });
    map.addSource('prepareEndPointIcon-source', {type: 'geojson', data: endPointFeature});
}

function setForbidAirPortAreaLayer() {
    fetch(serverUrl + '/mapGeography/forbidArea/airport/', {
        method: 'GET',
        headers: new Headers({
            'Authorization': token,
            'Content-Type': 'application/json'
        })
    }).then(response => {
        response.json()
            .then(data => ({
                    data: data,
                    status: response.status
                })
            ).then(res => {
            isTokenExpire(res.status);
            map.addSource('forbidArea-airport-source', {
                type: 'geojson',
                data: res.data
            });
            map.addLayer({
                'id': 'forbidArea-airport',
                'type': 'fill',
                'source': 'forbidArea-airport-source',
                'paint': {
                    'fill-color': '#ad0000',
                    'fill-opacity': 0.5
                }
            });
        })
    });
}

function setForbidMilitaryCampAreaLayer() {
    fetch(serverUrl + '/mapGeography/forbidArea/militaryCamp/', {
        method: 'GET',
        headers: new Headers({
            'Authorization': token,
            'Content-Type': 'application/json'
        })
    }).then(response => {
        response.json()
            .then(data => ({
                    data: data,
                    status: response.status
                })
            ).then(res => {
            isTokenExpire(res.status);
            map.addSource('forbidArea-militaryCamp-source', {
                type: 'geojson',
                data: res.data
            });
            map.addLayer({
                'id': 'forbidArea-militaryCamp',
                'type': 'fill',
                'source': 'forbidArea-militaryCamp-source',
                'paint': {
                    'fill-color': '#ad0000',
                    'fill-opacity': 0.5
                }
            });
        })
    });
}

function setRestrictAreaAirportNearbyAreaLayer() {
    fetch(serverUrl + '/mapGeography/restrictArea/airportNearby/', {
        method: 'GET',
        headers: new Headers({
            'Authorization': token,
            'Content-Type': 'application/json'
        })
    }).then(response => {
        response.json()
            .then(data => ({
                    data: data,
                    status: response.status
                })
            ).then(res => {
            isTokenExpire(res.status);
            map.addSource('restrictArea-airportNearby-source', {
                type: 'geojson',
                data: res.data
            });
            map.addLayer({
                'id': 'restrictArea-airportNearby',
                'type': 'fill',
                'source': 'restrictArea-airportNearby-source',
                'paint': {
                    'fill-color': '#8f8f00',
                    'fill-opacity': 0.5
                }
            });
        })
    });
}

function setExpireTrajectoryLayer() {
    fetch(serverUrl + '/realTime/trajectory/executed', {
        method: 'GET',
        headers: new Headers({
            'Authorization': token,
            'Content-Type': 'application/json'
        })
    }).then(response => {
        response.json()
            .then(data => ({
                    data: data,
                    status: response.status
                })
            ).then(res => {
            isTokenExpire(res.status);
            map.addSource('trajectory-expire-source', {
                type: 'geojson',
                data: res.data
            });
            map.addLayer({
                "id": "trajectory-expired-layer",
                "type": "line",
                "source": "trajectory-expire-source",
                "paint": {
                    "line-color": "#000000",
                    'line-opacity': 0.5,
                    "line-width": 6
                }
            });
        })
    });
}


function setExecutingTrajectoryLayer() {
    fetch(serverUrl + '/realTime/trajectory/executing', {
        method: 'GET',
        headers: new Headers({
            'Authorization': token,
            'Content-Type': 'application/json'
        })
    }).then(response => {
        response.json()
            .then(data => ({
                    data: data,
                    status: response.status
                })
            ).then(res => {
            isTokenExpire(res.status);
            map.addSource('trajectory-executing-source', {
                type: 'geojson',
                data: res.data
            });
            map.addLayer({
                "id": "trajectory-executing-layer",
                "type": "line",
                "source": "trajectory-executing-source",
                "paint": {
                    "line-color": "#8138ff",
                    "line-width": 6
                }
            });
            setPredictTrajectory(res.data);
            setCurrentDroneIcon(res.data);
        })
    });
}


function setCurrentDroneIcon(data) {
    let currentLocationList = [];
    for (let i = 0; i < data.features.length; i++) {
        let currentLocation = data.features[i].properties['currentLocation'];
        currentLocationList.push(JSON.parse(currentLocation));
    }
    let currentLocationFeature = {
        "type": "Feature",
        "geometry": {
            "type": "MultiPoint",
            "coordinates": currentLocationList
        },
        "properties": {}
    };
    map.loadImage('/realtime_map/img/uav.png', function (error, image) {
        if (error) throw error;
        map.addImage('currentDroneLocationIcon', image);
        map.addLayer({
            "id": "currentDroneLocation-layer",
            "type": "symbol",
            "source": "currentDroneLocation-source",
            "layout": {
                "icon-image": "currentDroneLocationIcon"
            }
        });
    });
    map.addSource('currentDroneLocation-source', {type: 'geojson', data: currentLocationFeature});
}

let predictMultiLineString = {
    "type": "MultiLineString",
    "coordinates": []
};


function setPredictTrajectory(data) {
    let predictLineSegmentList = [];
    let size = data.features.length;

    for (let i = 0; i < size; i++) {
        let currentLocation = JSON.parse(data.features[i].properties.currentLocation);
        let predictNextLocation = JSON.parse(data.features[i].properties.predictNextLocation);
        predictLineSegmentList.push([currentLocation, predictNextLocation]);
    }
    predictMultiLineString.coordinates = predictLineSegmentList;

    map.addSource('predict-trajectory-source', {
        type: 'geojson',
        data: predictMultiLineString
    });
    map.addLayer({
        "id": "predict-trajectory-layer",
        "type": "line",
        "source": "predict-trajectory-source",
        "paint": {
            "line-color": "#e9001c",
            "line-width": 6
        }
    });
}


function updateExecutingFlightPlanLayer(data) {
    map.getSource('executing-flight-plan-source').setData(data);
}

function updateExpireFlightPlanLayer(data) {
    map.getSource('expired-flight-plan-source').setData(data);
}


function updatePrePareFlightPlanLayer(data) {
    map.getSource('prepare-flight-plan-source').setData(data);
}

function updateExpireFlightTrajectoryLayer(data) {
    map.getSource('trajectory-expire-source').setData(data);
}

function updateExecutingFlightTrajectoryLayer(data) {
    map.getSource('trajectory-executing-source').setData(data);
    updatePredictTrajectoryLayer(data);
    updateExecutingFlightTrajectoryDroneIconLayer(data);
}


function updateExecutingFlightTrajectoryDroneIconLayer(data) {
    let currentLocationList = [];
    for (let i = 0; i < data.features.length; i++) {
        let currentLocation = data.features[i].properties['currentLocation'];
        currentLocationList.push(JSON.parse(currentLocation));
    }
    let currentLocationFeature = {
        "type": "Feature",
        "geometry": {
            "type": "MultiPoint",
            "coordinates": currentLocationList
        },
        "properties": {}
    };
    map.getSource('currentDroneLocation-source').setData(currentLocationFeature);
}

function updateExecutingStartPointAndEndPointIcon(data) {
    let startPointList = [];
    console.log(data.features.length);
    for (let i = 0; i < data.features.length; i++) {
        let startPoint = data.features[i].properties['startPoint'];
        startPointList.push([JSON.parse(startPoint)[1], JSON.parse(startPoint)[0]]);
    }
    let startPointFeature = {
        "type": "Feature",
        "geometry": {
            "type": "MultiPoint",
            "coordinates": startPointList
        },
        "properties": {}
    };

    let endPointList = [];
    for (let i = 0; i < data.features.length; i++) {
        let endPoint = data.features[i].properties['endPoint'];
        endPointList.push([JSON.parse(endPoint)[1], JSON.parse(endPoint)[0]]);
    }
    let endPointFeature = {
        "type": "Feature",
        "geometry": {
            "type": "MultiPoint",
            "coordinates": endPointList
        },
        "properties": {}
    };
    map.getSource('executingStartPointIcon-source').setData(startPointFeature);
    map.getSource('executingEndPointIcon-source').setData(endPointFeature);
}

function updatePrepareStartPointAndEndPointIcon(data) {
    let startPointList = [];
    console.log(data.features.length);
    for (let i = 0; i < data.features.length; i++) {
        let startPoint = data.features[i].properties['startPoint'];
        startPointList.push([JSON.parse(startPoint)[1], JSON.parse(startPoint)[0]]);
    }
    let startPointFeature = {
        "type": "Feature",
        "geometry": {
            "type": "MultiPoint",
            "coordinates": startPointList
        },
        "properties": {}
    };

    let endPointList = [];
    for (let i = 0; i < data.features.length; i++) {
        let endPoint = data.features[i].properties['endPoint'];
        endPointList.push([JSON.parse(endPoint)[1], JSON.parse(endPoint)[0]]);
    }
    let endPointFeature = {
        "type": "Feature",
        "geometry": {
            "type": "MultiPoint",
            "coordinates": endPointList
        },
        "properties": {}
    };
    map.getSource('prepareStartPointIcon-source').setData(startPointFeature);
    map.getSource('prepareEndPointIcon-source').setData(endPointFeature);
}


function updateExpireStartPointAndEndPointIcon(data) {
    let startPointList = [];
    console.log(data.features.length);
    for (let i = 0; i < data.features.length; i++) {
        let startPoint = data.features[i].properties['startPoint'];
        startPointList.push([JSON.parse(startPoint)[1], JSON.parse(startPoint)[0]]);
    }
    let startPointFeature = {
        "type": "Feature",
        "geometry": {
            "type": "MultiPoint",
            "coordinates": startPointList
        },
        "properties": {}
    };

    let endPointList = [];
    for (let i = 0; i < data.features.length; i++) {
        let endPoint = data.features[i].properties['endPoint'];
        endPointList.push([JSON.parse(endPoint)[1], JSON.parse(endPoint)[0]]);
    }
    let endPointFeature = {
        "type": "Feature",
        "geometry": {
            "type": "MultiPoint",
            "coordinates": endPointList
        },
        "properties": {}
    };
    map.getSource('expireStartPointIcon-source').setData(startPointFeature);
    map.getSource('expireEndPointIcon-source').setData(endPointFeature);
}


function updatePredictTrajectoryLayer(data) {
    let predictLineSegmentList = [];
    let size = data.features.length;

    for (let i = 0; i < size; i++) {
        let currentLocation = JSON.parse(data.features[i].properties.currentLocation);
        let predictNextLocation = JSON.parse(data.features[i].properties.predictNextLocation);
        predictLineSegmentList.push([currentLocation, predictNextLocation]);
    }
    predictMultiLineString.coordinates = predictLineSegmentList;
    map.getSource('predict-trajectory-source').setData(predictMultiLineString);
}

function clearAllLayerData() {
    let empty = {
        "type": "FeatureCollection",
        "features": []
    };
    map.getSource('executing-flight-plan-source').setData(empty);
    map.getSource('expired-flight-plan-source').setData(empty);
    map.getSource('prepare-flight-plan-source').setData(empty);
    map.getSource('trajectory-expire-source').setData(empty);
    map.getSource('trajectory-executing-source').setData(empty);
}

function getAndUpdatePrePareFlightPlanLayer() {
    fetch(serverUrl + '/realTime/flightPlan/prepare/', {
        method: 'GET',
        headers: new Headers({
            'Authorization': token,
            'Content-Type': 'application/json'
        })
    }).then(response => {
        response.json()
            .then(data => ({
                    data: data,
                    status: response.status
                })
            ).then(res => {
            isTokenExpire(res.status);
            updatePrePareFlightPlanLayer(res.data);
            updatePrepareStartPointAndEndPointIcon(res.data);
        })
    });
}

function getAndUpdateExecutingFlightPlanLayer() {
    fetch(serverUrl + '/realTime/flightPlan/executing/', {
        method: 'GET',
        headers: new Headers({
            'Authorization': token,
            'Content-Type': 'application/json'
        })
    }).then(response => {
        response.json()
            .then(data => ({
                    data: data,
                    status: response.status
                })
            ).then(res => {
            isTokenExpire(res.status);
            updateExecutingFlightPlanLayer(res.data);
            updateExecutingStartPointAndEndPointIcon(res.data);
        })
    });
}

function getAndUpdateExpireFlightPlanLayer() {
    fetch(serverUrl + '/realTime/flightPlan/expired', {
        method: 'GET',
        headers: new Headers({
            'Authorization': token,
            'Content-Type': 'application/json'
        })
    }).then(response => {
        response.json()
            .then(data => ({
                    data: data,
                    status: response.status
                })
            ).then(res => {
            isTokenExpire(res.status);
            updateExpireFlightPlanLayer(res.data);
        })
    });
}

function getAndUpdateExecutingFlightTrajectoryLayer() {
    fetch(serverUrl + '/realTime/trajectory/executing', {
        method: 'GET',
        headers: new Headers({
            'Authorization': token,
            'Content-Type': 'application/json'
        })
    }).then(response => {
        response.json()
            .then(data => ({
                    data: data,
                    status: response.status
                })
            ).then(res => {
            isTokenExpire(res.status);
            updateExecutingFlightTrajectoryLayer(res.data);
        })
    });
}

function getAndUpdateExpireFlightTrajectoryLayer() {
    fetch(serverUrl + '/realTime/trajectory/executed', {
        method: 'GET',
        headers: new Headers({
            'Authorization': token,
            'Content-Type': 'application/json'
        })
    }).then(response => {
        response.json()
            .then(data => ({
                    data: data,
                    status: response.status
                })
            ).then(res => {
            isTokenExpire(res.status);
            updateExpireFlightTrajectoryLayer(res.data);
        })
    });
}

function getAndUpdateFlightPlanByDate(selectDate, today) {
    let s = Date.parse(selectDate);
    let d = Date.parse(today);
    fetch(serverUrl + '/flightPlan/date/' + selectDate, {
        method: 'GET',
        headers: new Headers({
            'Authorization': token
        })
    }).then((response) => {
        checkTokenExpired(response);
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            isTokenExpire(res.status);
            if (s.toString() < d.toString()) {
                updateExpireFlightPlanLayer(res.data);
                updateExpireStartPointAndEndPointIcon(res.data);
                hiddenPrepareLayer();
                showExpireLayer();
            } else if (s.toString() > d.toString()) {
                updatePrePareFlightPlanLayer(res.data);
                updatePrepareStartPointAndEndPointIcon(res.data);
                showPrepareLayer();
                hiddenExpireLayer();
            }
            hiddenExecutingLayer();
        });
    });
}

function getAndUpdateFlightTrajectoryByDate(selectDate, today) {
    let s = Date.parse(selectDate);
    let d = Date.parse(today);
    fetch(serverUrl + '/flightPlan/trajectory/date/' + selectDate, {
        method: 'GET',
        headers: new Headers({
            'Authorization': token
        })
    }).then((response) => {
        checkTokenExpired(response);
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            isTokenExpire(res.status);
            updateExpireFlightTrajectoryLayer(res.data);
        });
    });
}

function changeDataAndUpdateFlightPlanList() {
    let selectDate = document.getElementById('select-date').value;
    let s = Date.parse(selectDate);
    let d = Date.parse(today);
    clearAllLayerData();
    if (s === d) {
        getAndUpdatePrePareFlightPlanLayer();
        getAndUpdateExecutingFlightPlanLayer();
        getAndUpdateExpireFlightPlanLayer();

        getAndUpdateExecutingFlightTrajectoryLayer();
        getAndUpdateExpireFlightTrajectoryLayer();
        showExecutingLayer();
        showPrepareLayer();
        showExpireLayer();

        showNoPlanStabilityList();
        updateExecutingFlightStability();
    } else {
        getAndUpdateFlightPlanByDate(selectDate, today);
        getAndUpdateFlightTrajectoryByDate(selectDate, today);
        showNoPlanMessage();
    }

}

function showNoPlanMessage() {
    document.getElementById('no-plan-message').style.display = 'block';
    document.getElementById('plan-stability-list').style.display = 'none';
}

function showNoPlanStabilityList() {
    document.getElementById('no-plan-message').style.display = 'none';
    document.getElementById('plan-stability-list').style.display = 'block';
}

function updateExecutingFlightPlanStabilityList(stabilityList) {
    console.log(stabilityList);
    console.log(stabilityList.length);
    if (stabilityList.length > 0) {
        showNoPlanStabilityList();
        let ul = document.getElementById('plan-stability-list');
        ul.innerHTML = "";
        for (let i = 0; i < stabilityList.length; i++) {
            let plan = stabilityList[i]['planId'].toString();
            let stability = (stabilityList[i]['stability'] * 100).toString();
            const stabilityMessage = "FlightPlan -> " + plan + " ; Stability -> " + stability + "%";
            let li = document.createElement("Li");
            li.appendChild(document.createTextNode(stabilityMessage));
            ul.appendChild(li);
        }
    } else {
        showNoPlanMessage();
    }
}

function updateExecutingFlightStability() {
    fetch(serverUrl + '/realTime/stability/', {
        method: 'GET',
        headers: new Headers({
            'Authorization': token,
            'Content-Type': 'application/json'
        })
    }).then(response => {
        response.json()
            .then(data => ({
                    data: data,
                    status: response.status
                })
            ).then(res => {
            isTokenExpire(res.status);
            updateExecutingFlightPlanStabilityList(res.data)
        })
    });

}

function updateMap() {
    getAndUpdatePrePareFlightPlanLayer();
    getAndUpdateExecutingFlightPlanLayer();
    getAndUpdateExpireFlightPlanLayer();

    getAndUpdateExecutingFlightTrajectoryLayer();
    getAndUpdateExpireFlightTrajectoryLayer();

    updateExecutingFlightStability();
}

window.setInterval(function () {
    updateMap();
}, 60000 * 5);

function hiddenExecutingLayer() {
    map.setLayoutProperty('executing-flight-plan-layer', 'visibility', 'none');
    map.setLayoutProperty('trajectory-executing-layer', 'visibility', 'none');
    map.setLayoutProperty('executingStartPointIcon-layer', 'visibility', 'none');
    map.setLayoutProperty('executingEndPointIcon-layer', 'visibility', 'none');
    map.setLayoutProperty('predict-trajectory-layer', 'visibility', 'none');
    map.setLayoutProperty('currentDroneLocation-layer', 'visibility', 'none');
}


function showExecutingLayer() {
    map.setLayoutProperty('executing-flight-plan-layer', 'visibility', 'visible');
    map.setLayoutProperty('trajectory-executing-layer', 'visibility', 'visible');
    map.setLayoutProperty('executingStartPointIcon-layer', 'visibility', 'visible');
    map.setLayoutProperty('executingEndPointIcon-layer', 'visibility', 'visible');
    map.setLayoutProperty('predict-trajectory-layer', 'visibility', 'visible');
    map.setLayoutProperty('currentDroneLocation-layer', 'visibility', 'visible');
}

function hiddenPrepareLayer() {
    map.setLayoutProperty('prepare-flight-plan-layer', 'visibility', 'none');
    map.setLayoutProperty('prepareStartPoint-layer', 'visibility', 'none');
    map.setLayoutProperty('prepareEndPoint-layer', 'visibility', 'none');
}

function showPrepareLayer() {
    map.setLayoutProperty('prepare-flight-plan-layer', 'visibility', 'visible');
    map.setLayoutProperty('prepareStartPoint-layer', 'visibility', 'visible');
    map.setLayoutProperty('prepareEndPoint-layer', 'visibility', 'visible');
}

function hiddenExpireLayer() {
    map.setLayoutProperty('expired-flight-plan-layer', 'visibility', 'none');
    map.setLayoutProperty('trajectory-expired-layer', 'visibility', 'none');
    map.setLayoutProperty('expireStartPoint-layer', 'visibility', 'none');
    map.setLayoutProperty('expireEndPoint-layer', 'visibility', 'none');
}

function showExpireLayer() {
    map.setLayoutProperty('expired-flight-plan-layer', 'visibility', 'visible');
    map.setLayoutProperty('trajectory-expired-layer', 'visibility', 'visible');
    map.setLayoutProperty('expireStartPoint-layer', 'visibility', 'visible');
    map.setLayoutProperty('expireEndPoint-layer', 'visibility', 'visible');
}

map.on('load', function () {
    setForbidAirPortAreaLayer();
    setForbidMilitaryCampAreaLayer();
    setRestrictAreaAirportNearbyAreaLayer();

    setPrePareFlightPlanLayer();
    setExecutingFlightPlanLayer();
    setExpireFlightPlanLayer();

    setExpireTrajectoryLayer();
    setExecutingTrajectoryLayer();
});

function popUpFlightPlanDescription(e) {
    let dialogCoordinate = [e.lngLat.lng, e.lngLat.lat];
    let flightPlanProperties = e.features[0].properties;
    new mapboxgl.Popup()
        .setLngLat(dialogCoordinate)
        .setHTML('<h4>Flight Plan</h4>' +
            `<table style="width:100%">
                    <tr>
                        <th>Plan ID:</th>
                        <th>${flightPlanProperties['planId']}</th>
                    </tr>

                    <tr>
                    <th>UAV ID:</th>
                    <th>${flightPlanProperties['macAddress']}</th>
                    </tr>

                    <tr>
                    <td>Takeoff Date:</td>
                    <td>${flightPlanProperties['startDate']}</td>
                    </tr>

                    <tr>
                    <td>Takeoff Time:</td>
                    <td>${flightPlanProperties['startTime']}</td>
                    </tr>

                    <tr>
                        <td>Arrival Time:</td>
                        <td>${flightPlanProperties['endTime']}</td>
                    </tr>

                    <tr>
                    <td>Description:</td>
                    <td>${flightPlanProperties['description']}</td>
                    </tr>
                </table>`).addTo(map);
}

map.on('mousemove', 'executing-flight-plan-layer', function () {
    map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'executing-flight-plan-layer', function () {
    map.getCanvas().style.cursor = '';
});
map.on('click', 'executing-flight-plan-layer', function (e) {
    popUpFlightPlanDescription(e);
});


map.on('mousemove', 'prepare-flight-plan-layer', function () {
    map.getCanvas().style.cursor = 'pointer';

});
map.on('mouseleave', 'prepare-flight-plan-layer', function () {
    map.getCanvas().style.cursor = '';
});
map.on('click', 'prepare-flight-plan-layer', function (e) {
    popUpFlightPlanDescription(e);

});


map.on('mouseenter', 'expired-flight-plan-layer', function () {
    map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'expired-flight-plan-layer', function () {
    map.getCanvas().style.cursor = '';
});
map.on('click', 'expired-flight-plan-layer', function (e) {
    popUpFlightPlanDescription(e);
});