// ViewModel for handling data and sorting logic
function ViewModel() {
    var self = this;

    // Base API URI
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/CountryMedals?page=1&pagesize=1000');
    self.records = ko.observableArray([]);

    // Fetch data from the API
    self.activate = function () {
        fetchData(self.baseUri())
            .done(function (data) {
                self.records(data); // Populate records
            });
    };

    // Sorting logic for different medal types
    self.sortBy = function (key) {
        const sorted = [...self.records()].sort((a, b) => b[key] - a[key]);
        self.records(sorted);
    };

    // Initialize data on ViewModel activation
    self.activate();
}

// AJAX Helper for API calls
function fetchData(uri) {
    return $.ajax({
        type: 'GET',
        url: uri,
        dataType: 'json',
        contentType: 'application/json',
        error: function (jqXHR, textStatus, errorThrown) {
            alert(`AJAX Call [${uri}] Failed`);
        }
    });
}

// Event listener for document ready
$(function () {
    var vmInstance = new ViewModel();
    ko.applyBindings(vmInstance);

    // Button handlers for sorting
    $('#total').click(() => vmInstance.sortBy('Total'));
    $('#ouro').click(() => vmInstance.sortBy('GoldMedal'));
    $('#prata').click(() => vmInstance.sortBy('SilverMedal'));
    $('#bronze').click(() => vmInstance.sortBy('BronzeMedal'));
});
