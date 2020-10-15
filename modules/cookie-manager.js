function saveTokenToCookie(tokenName, token){
    var days = 1;//cookie儲存1天
    var date = new Date();
    date.setTime(date.getTime() + days*24*60*60*1000);
    var expires = "expires="+date.toGMTString();
    var utmTokenName = tokenName;
    var utmTokenValue = token;
    document.cookie = utmTokenName + "=" + utmTokenValue + "; " + expires;
}

function updateToken(tokenName, content) {
    document.cookie = tokenName+"="+content+"; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function checkTokenExpired(response) {
    if (response.status === 403){
        updateToken('utm-token','expired');
        window.location.href="/index.html";
    }
}

function getToken(tokenName){
    var name = tokenName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}