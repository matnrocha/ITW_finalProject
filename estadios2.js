$(document).ready(function () {
    const $container = $('#athlete-container');
    const $pagination = $('#pagination');
    const $modal = $('#venueModal');
    var venueList = [];

    // ViewModel
    var viewModel = {
        VenueId: ko.observable(''),
        VenueName: ko.observable(''),
        VenueSports: ko.observableArray([]),
        VenueDateStart: ko.observable(''),
        VenueDataEnd: ko.observable(''),
        VenueTag: ko.observable(''),
        VenueUrl: ko.observable(''),
        VenueLat: ko.observable(''),
        VenueLon: ko.observable('')
    };

    // Aplicar bindings uma única vez
    ko.applyBindings(viewModel, document.getElementById('venueModal'));

    function populateTable(venues) {
        const $tableBody = $('#table-body');
        $tableBody.empty(); // Limpar a tabela

        venues.forEach((venue) => {
            const row = `
                    <tr data-id="${venue.Id}" style="cursor:pointer;">
                    <td class="align-middle">${venue.Id}</td>
                    <td class="align-middle">${venue.DateStart}</td>
                    <td class="align-middle">${venue.DateEnd}</td>
                    <td class="align-middle">${venue.Name}</td>
                    <td class="align-middle">${venue.NumSports}</td>
                `;
            $tableBody.append(row);
        });
    }

    function fetchVenues() {
        console.log('fetchVenues chamada');

        $.ajax({
            url: `http://192.168.160.58/Paris2024/api/Venues`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log('Dados da API:', data);
                populateTable(data);
            },
            error: function (err) {
                console.error('Erro ao buscar atletas:', err);
            }
        });
    }

    function fetchAthleteDetails(id) {
        $.ajax({
            url: `http://192.168.160.58/Paris2024/api/Venues/${id}`,
            method: 'GET',
            dataType: 'json',
            success: function (venue) {
                console.log("detalhes de ", venue)
                //viewModel com os dados do atleta
                viewModel.VenueId(venue.Id);
                viewModel.VenueName(venue.Name);
                viewModel.VenueSports(venue.Sports);
                viewModel.VenueDateStart(venue.DateStart);
                viewModel.VenueDateEnd(venue.DateEnd);
                viewModel.VenueTag(venue.Tag);
                viewModel.VenueUrl(venue.Url);
                viewModel.VenueLat(venue.Lat);
                viewModel.VenueLat(venue.Lon);
                // Mostrar o modal
                $('#venueModal').modal('show');
            },
            error: function (err) {
                console.error('Erro ao buscar detalhes do espaço:', err);
            }

        });
    }

    fetchVenues();

    // detalhes 
    $(document).on('click', '#table-body tr', function () {
        const venueId = $(this).data('id');
        fetchAthleteDetails(venueId);
    });
});