var markers = [];
var popUps = [];
var venues = [];
var markersElems = [];
console.log("Mapa adicionado")
var map = L.map('map').setView([17.633122, -61.785271], 3);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
//alterar os popups para ter tudo
//serach bar pela cidade e meter popup vermelho com autocomplete1
$.ajax({
    type: "GET",
    url: "http://192.168.160.58/Paris2024/api/Venues",
    success: function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            //console.log("cycle")
            console.log(data[i])
            console.log(data[i].Lat)
            //console.log([parseFloat(data[i].Lat), parseFloat(data[i].Lon)]);
            if (data[i].NumSports > 0) {
                console.log("added")
                var popupInfo = `ID:${data[i].Id}</br>Nome:${data[i].Name}</br>Número de desportos:${data[i].NumSports}`;
                markers.push([parseFloat(data[i].Lat), parseFloat(data[i].Lon)]);
                venues.push(data[i].Name);
                popUps.push(popupInfo);
                var marker = L.marker([parseFloat(data[i].Lat), parseFloat(data[i].Lon)]).addTo(map).bindPopup(popupInfo);
                markersElems.push(marker);
            }

        }
    },
    complete: function () {
        console.log(markers);
        //markerBounds = L.bounds(markers);
        //map.fitBounds(markerBounds)
        $("#autocomplete").autocomplete({
            source: venues
        });
    }
});
$("#button-addon1").click(function () {
    console.log("botão carregado")
    var venue = $("#autocomplete").val();
    console.log(venue);
    console.log(venues);
    if (venues.includes(venue)) {
        console.log("estádio encontrada")
        var coords = venues.indexOf(venue);
        map.setView(markers[coords], 15);
        markersElems[coords].openPopup();
    }
    else {
        alert("O estádio não foi encontardo");
    };
})
