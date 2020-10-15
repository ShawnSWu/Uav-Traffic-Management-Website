if(getToken('utm-token') !== "" && getToken('utm-token') !== 'expired'){
    window.location.href = '/Uav-Traffic-Management-Website/realtime_map/html/drone-map.html';
}

let serverUrl = getServerUrl();

const loginFormElement = document.getElementById("login-form");
loginFormElement.addEventListener('submit', function (e) {
    e.preventDefault();

    const loginFormData = new FormData(this);
    let loginBody = {
        "pilotAccount": loginFormData.get('pilotAccount'),
        "password": loginFormData.get('password')
    };
    document.getElementById("password-error-message").textContent = '';
    fetch(serverUrl + '/account/login', {
        method: 'POST',
        body: JSON.stringify(loginBody),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }).then((response) => {
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(response => {
            switch (response.status) {

                case 200:
                    let token = response.data['token'];
                    let accountId = response.data.pilot['id'];
                    let pilotName = response.data.pilot['name'];
                    saveTokenToCookie('utm-token', token);
                    saveTokenToCookie('utm-accountId', accountId);
                    saveTokenToCookie('utm-pilotName', pilotName);
                    window.location.href = "/Uav-Traffic-Management-Website/realtime_map/html/drone-map.html";
                    break;

                default:
                    var errorMessage = response.data.message;
                    setPasswordErrorMessage(errorMessage);
                    break
            }

        });
    }).catch(reason => {
        setPasswordErrorMessage('Server is not responding, please try again later.');
    });

});

function setPasswordErrorMessage(message) {
    document.getElementById("password-error-message").textContent = message;
    document.getElementById("password-error-message").style.display = "block";
    document.getElementById("password").style.backgroundColor = "#fcfdc6";
}




