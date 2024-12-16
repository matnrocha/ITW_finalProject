var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Venues');
    self.displayName = 'Paris 2024 Torch Route';
    self.records = ko.observableArray([]);
    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getRoutes...');
        var composedUri = self.baseUri();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.records(data);
        });
    };

    //--- start ....
    self.activate(1);
    console.log("VM initialized!");
}

//--- Internal functions
function ajaxHelper(uri, method, data) {
    return $.ajax({
        type: method,
        url: uri,
        dataType: 'json',
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : null,
        error: function (jqXHR, textStatus, errorThrown) {
            alert("AJAX Call[" + uri + "] Fail...");
        }
    });
}

function venueDetails(id){
    var composedUrl = 'http://192.168.160.58/Paris2024/api/Venues/' + id
    $.ajax({
        url: composedUrl,
        method: 'GET',
        dataType: 'json',
        success: function (venue) {
            console.log("detalhes de ", venue);
            $('#VenueTitle').text('Detalhes sobre ' + venue.Name)
            $('#VenueId').text(venue.Id);
            $('#VenueName').text(venue.Name);
            $('#VenueDateStart').text(venue.DateStart);
            $('#VenueDateEnd').text(venue.DateEnd);
            $('#VenueTag').text(venue.Tag);
            $('#VenueUrl').attr('href', venue.Url);
            $('#VenueLat').text(venue.Lat);
            $('#VenueLon').text(venue.Lon);
            if (venue.Sports.length > 0){
                var htmlCode = '<div class="row">';
                for (var i = 0; i < venue.Sports.length; i++) {
                    var imagesrc = 'https://gstatic.olympics.com/s1/t_original/static/light/pictograms-paris-2024/olympics/' + venue.Sports[i].Id + '_small.svg';
                    console.log(imagesrc);
                    fullHtml = '<div class="col-auto"> <img src="' + imagesrc + '" style="width:100px; height: 100px"></br><small>' + venue.Sports[i].Name + '</small></div>';
                    htmlCode += fullHtml;
                    console.log(htmlCode);
                };
                htmlCode += "</div>";
                $('#VenueSports').html(htmlCode);
            }
            else{
                $('#VenueSports').text("Não existem modalidades associadas a este espaço")
            }
        },
    })
    
}

$('document').ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm(),);

    $(document).on('click', '#table-body tr button', function () {
        const venueId = $(this).val();
        //.data('id');
        console.log("buscando detalhes de",venueId)
        venueDetails(venueId);
    });
});
