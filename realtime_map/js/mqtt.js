fetch(serverUrl + '/mqttConnectionParameter', {
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

        let reconnectTimeout = 5;
        let host = res.data['host'];
        let port = parseInt(res.data['port']);
        let username = res.data['username'];
        let password = res.data['password'];

        let clientId = '04ce817bb87146398667e975d01d8b18';

        let accountId = getToken('utm-accountId');
        let client = new Paho.MQTT.Client(host, port, clientId);

        let trajectoryTopic = String("/realTime/uav/trajectory/" + accountId);
        let stabilityTopic = String("/realTime/uav/stability/" + accountId);

        let options = {
            invocationContext: {
                host: host,
                port: port,
                path: client.path,
                clientId: clientId
            },
            userName: username,
            password: password,
            timeout: reconnectTimeout,

            onSuccess: function () {
                console.log("onConnected");
                console.log("trajectory-topic:" + trajectoryTopic);
                client.subscribe(trajectoryTopic);
                console.log("stabilityTopic-topic:" + stabilityTopic);
                client.subscribe(stabilityTopic);
            },
            onFailure: function (e) {
                console.log("connect fail");
                console.log(e);
            }
        };

        try {
            client.connect(options);
        } catch (e) {
            console.log(e.message);
        }


        client.onMessageArrived = function (message) {
            if (message.destinationName === trajectoryTopic) {
                console.log("executing trajectory:");
                console.log(message.payloadString);
                updateExecutingFlightTrajectoryLayer(JSON.parse(message.payloadString.trim()));
            } else {
                console.log("executing trajectory stability：");
                console.log(message.payloadString);
                updateExecutingFlightPlanStabilityList(JSON.parse(message.payloadString));
            }
        };


    })
});
