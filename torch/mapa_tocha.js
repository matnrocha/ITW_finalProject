var markerList = [];
var popupContents = [];
var cityList = [];
var markerElements = [];

// Initialize the map
var mapInstance = L.map('map').setView([43.2961743, 5.3699525], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mapInstance);

// Fetch data via AJAX
$.ajax({
    type: "GET",
    url: "http://192.168.160.58/Paris2024/api/Torch_route",
    success: function (data) {
        data.forEach(item => {
            if (item.Tag != "relay-in-greece") {
                var popupInfo = `Stage:${item.Stage_number}</br>Title:${item.Title}</br>City:${item.City}`;
                markerList.push([parseFloat(item.Lat), parseFloat(item.Lon)]);
                cityList.push(item.City);
                popupContents.push(popupInfo);

                var newMarker = L.marker([parseFloat(item.Lat), parseFloat(item.Lon)])
                    .addTo(mapInstance)
                    .bindPopup(popupInfo);

                markerElements.push(newMarker);
            }
        });
    },
    complete: function () {
        var routePolyline = L.polyline(markerList, { color: 'green' }).addTo(mapInstance);
        mapInstance.fitBounds(routePolyline.getBounds());

        $("#autocomplete").autocomplete({
            source: cityList
        });
    }
});

// Search button functionality
$("#button-addon1").click(function () {
    var selectedCity = $("#autocomplete").val();
    if (cityList.includes(selectedCity)) {
        var cityIndex = cityList.indexOf(selectedCity);
        mapInstance.setView(markerList[cityIndex], 15);
        markerElements[cityIndex].openPopup();
    } else {
        alert("City does not belong to the torch route");
    }
});
