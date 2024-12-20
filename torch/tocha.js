// ViewModel for KnockOut
class TorchRouteViewModel {
    constructor() {
        this.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Torch_route');
        this.displayName = 'Paris 2024 Torch Route';
        this.records = ko.observableArray([]);
    }

    // Activate the view model and fetch data
    activate() {
        const composedUri = this.baseUri();
        this.fetchRoutes(composedUri);
    }

    // Fetch routes data via AJAX
    fetchRoutes(uri) {
        this.ajaxHelper(uri, 'GET').done((data) => {
            this.records(data);
        });
    }

    // Generic AJAX helper function
    ajaxHelper(uri, method, data = null) {
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: () => {
                alert(`AJAX Call to ${uri} failed...`);
            }
        });
    }
}

// Initialize and apply KnockOut bindings
$(document).ready(() => {
    const viewModelInstance = new TorchRouteViewModel();
    viewModelInstance.activate();  // Start data fetch
    ko.applyBindings(viewModelInstance);  // Bind the ViewModel to the DOM
});
