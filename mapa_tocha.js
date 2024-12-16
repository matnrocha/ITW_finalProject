var markers = [];
var popUps = [];
var cities = [];
var markersElems = [];
console.log("Mapa adicionado")
var map = L.map('map').setView([43.2961743, 5.3699525], 5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
//alterar os popups para ter tudo
//serach bar pela cidade e meter popup vermelho com autocomplete1
$.ajax({
    type: "GET",
    url: "http://192.168.160.58/Paris2024/api/Torch_route",
    success: function (data){
        console.log(data);
        for(var i = 0; i < data.length; i++){
            //console.log("cycle")
            //console.log(data[i])
            //console.log([parseFloat(data[i].Lat), parseFloat(data[i].Lon)]);
            if (data[i].Tag != "relay-in-greece"){
                console.log("added")
                var popupInfo = `Fase:${data[i].Stage_number}</br>Título:${data[i].Title}</br>Cidade:${data[i].City}`;
                markers.push([parseFloat(data[i].Lat), parseFloat(data[i].Lon)]);
                cities.push(data[i].City);
                popUps.push(popupInfo);
                var marker = L.marker([parseFloat(data[i].Lat), parseFloat(data[i].Lon)]).addTo(map).bindPopup(popupInfo);
                markersElems.push(marker);
            };
        }
    },
    complete: function(){
        console.log(markers);
        var polyline = L.polyline(markers, {color: 'red'}).addTo(map);
        map.fitBounds(polyline.getBounds());
        $("#autocomplete").autocomplete({
            source: cities
        });
    }
});
$("#button-addon1").click(function(){
    console.log("botão carregado")
    var city = $("#autocomplete").val();
    console.log(city);
    console.log(cities);
    if (cities.includes(city)){
        console.log("cidade encontrada")
        var coords = cities.indexOf(city);
        map.setView(markers[coords], 15);
        markersElems[coords].openPopup();
    }
    else{
        alert("Cidade não pertence ao percurso da tocha");
    };
})
