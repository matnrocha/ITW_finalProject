var vm = function () {
    console.log('ViewModel initiated...');
    var self = this;

    // Base API URI
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/CountryMedals?page=1&pagesize=1000');
    self.records = ko.observableArray([]);

    // Fetch data from the API
    self.activate = function () {
        console.log('CALL: getRoutes...');
        ajaxHelper(self.baseUri(), 'GET').done(function (data) {
            console.log(data);
            self.records(data); // Populate records
        });
    };

    // Sorting logic
    self.sortBy = function (key) {
        var sorted = self.records().slice().sort((a, b) => b[key] - a[key]);
        self.records(sorted);
    };

    // Start the ViewModel
    self.activate();
};

// AJAX Helper
function ajaxHelper(uri, method, data) {
    return $.ajax({
        type: method,
        url: uri,
        dataType: 'json',
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : null,
        error: function (jqXHR, textStatus, errorThrown) {
            alert(`AJAX Call [${uri}] Failed`);
        }
    });
}

$('document').ready(function () {
    console.log("Ready!");
    var vmInstance = new vm();
    ko.applyBindings(vmInstance);

    // Button handlers for sorting
    $('#total').click(() => vmInstance.sortBy('Total'));
    $('#ouro').click(() => vmInstance.sortBy('GoldMedal'));
    $('#prata').click(() => vmInstance.sortBy('SilverMedal'));
    $('#bronze').click(() => vmInstance.sortBy('BronzeMedal'));
});
