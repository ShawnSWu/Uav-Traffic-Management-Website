function openNav() {
    document.getElementById("side-bar").style.width = "250px";
}

function closeNav() {
    document.getElementById("side-bar").style.width = "0px";
}


//close side-bar when click other place
document.body.addEventListener("click", function (e) {
    var cilckPlace = e.target;
    var divName = cilckPlace.id;

    var widthWithPx = document.getElementById("side-bar").style.width;
    var width = parseInt(widthWithPx,10);
    console.log(divName);

    judgeSideBarOpenClose(divName, width);

})

function judgeSideBarOpenClose(divName, width){
    if(!isNaN(width)){
        if(width>10){
            if (divName == "" || divName == "header-bar" || divName == "wrapper") {
                closeNav();
            }
        }
    }
}
