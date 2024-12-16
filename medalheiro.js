var total = [["País", "Total"]];
var ouro = [["País","Ouro"]]
var prata = [["País", "Prata"]]
var bronze = [["País", "Bronze"]]


var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/CountryMedals?page=1&pagesize=1000');
    self.displayName = 'Paris 2024 Medals by COuntry';
    self.records = ko.observableArray([]);

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getRoutes...');
        var composedUri = self.baseUri();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.records(data);
            for(var i=0; i<data.length; i++){
                total.push([data[i].CountryName, data[i].Total])
                ouro.push([data[i].CountryName, data[i].GoldMedal])
                prata.push([data[i].CountryName, data[i].SilverMedal])
                bronze.push([data[i].CountryName, data[i].BronzeMedal])
            }
            google.load("visualization", "1", { packages: ["corechart"] });
            google.setOnLoadCallback(drawChart);
            function drawChart() {
                var data = google.visualization.arrayToDataTable(total);
                var options = {
                    'title': 'Total de medalhas por país',
                    'width': 800,
                    'height': 800,
                };
                var chart = new google.visualization.PieChart(document.getElementById('chart'));
                chart.draw(data, options);
            }
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

$('document').ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());

    $('#total').click(function () {
        google.load("visualization", "1", { packages: ["corechart"] });
        google.setOnLoadCallback(drawChart);
        function drawChart() {
            var data = google.visualization.arrayToDataTable(total);
            var options = {
                'title': 'Total de medalhas por país',
            };
            var chart = new google.visualization.PieChart(document.getElementById('chart'));
            chart.draw(data, options);
        }
    })


    $('#ouro').click(function(){
        google.load("visualization", "1", { packages: ["corechart"] });
        google.setOnLoadCallback(drawChart);
        function drawChart() {
            var data = google.visualization.arrayToDataTable(ouro);
            var options = {
                'title': 'Total de medalhas de ouro por país',
            };
            var chart = new google.visualization.PieChart(document.getElementById('chart'));
            chart.draw(data, options);
        }
    })

    $('#prata').click(function () {
        google.load("visualization", "1", { packages: ["corechart"] });
        google.setOnLoadCallback(drawChart);
        function drawChart() {
            var data = google.visualization.arrayToDataTable(prata);
            var options = {
                'title': 'Total de medalhas de prata por país',
            };
            var chart = new google.visualization.PieChart(document.getElementById('chart'));
            chart.draw(data, options);
        }
    })

    $('#bronze').click(function () {
        google.load("visualization", "1", { packages: ["corechart"] });
        google.setOnLoadCallback(drawChart);
        function drawChart() {
            var data = google.visualization.arrayToDataTable(bronze);
            var options = {
                'title': 'Total de medalhas de bronze por país',
            };
            var chart = new google.visualization.PieChart(document.getElementById('chart'));
            chart.draw(data, options);
        }
    })
    
});