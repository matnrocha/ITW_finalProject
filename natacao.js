function populateTable(athletes) {
    const $tableBody = $('#table-body');
    $tableBody.empty(); // Limpar a tabela

    athletes.forEach((athlete) => {
        const row = 
            `<tr data-id="${athlete.Id}">
                <td class="align-middle">${athlete.Id}</td>
                <td class="align-middle">${athlete.ParticipantType}</td>
                <td class="align-middle">${athlete.Sex}</td>
                <td class="align-middle">${athlete.ParticipantName}</td>
                <td class="align-middle">${athlete.CountryName}</td>
                <td class="align-middle">${athlete.ParticipantCode}</td>
            </tr>`;
        $tableBody.append(row);
    });
}

function fetchSwimmingStage(EventId, StageId) {
    console.log('fetchSwimmingStage chamada para a página:', EventId, StageId);

    $.ajax({
        url: `http://192.168.160.58/Paris2024/api/Swimmings?EventId=${EventId}&StageId=${StageId}`,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            populateTable(data);
        }
    });
}

$(document).ready(function () {
    var baseUri = "http://192.168.160.58/Paris2024/api/Swimmings/Events";
    var eventos = {};
    var selectEvento = document.getElementById("selectEvento");
    var selectFase = document.getElementById("selectFase");

    $.ajax({
        type: "GET",
        url: baseUri,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                eventos[data[i].EventId] = data[i].Stages;
                var newOption = document.createElement('option');
                newOption.value = data[i].EventId;
                newOption.innerHTML = data[i].EventName;
                selectEvento.appendChild(newOption);
            }
        },
        complete: function (data) {
            $('#selectEvento').change(function () {
                var eventoSelecionado = $("#selectEvento option:selected").val();
                $("#selectFase").empty();
                if (eventoSelecionado != "") {
                    var fases = eventos[eventoSelecionado];
                    for (var i = 0; i < fases.length; i++) {
                        var newOption = document.createElement('option');
                        newOption.value = fases[i].StageId;
                        newOption.innerHTML = fases[i].StageName;
                        selectFase.appendChild(newOption);
                    }
                    fetchSwimmingStage(eventoSelecionado, fases[0].StageId);
                } else {
                    var newOption = document.createElement('option');
                    newOption.value = "";
                    newOption.innerHTML = "---Selecionar uma fase---";
                    selectFase.appendChild(newOption);
                    const $tableBody = $('#table-body');
                    $tableBody.empty(); // Limpar a tabela
                }
            });
        }
    });

    $('#selectFase').change(function () {
        var eventoSelec = $("#selectEvento option:selected").val();
        var faseSelec = $("#selectFase option:selected").val();
        if (eventoSelec != "") {
            fetchSwimmingStage(eventoSelec, faseSelec);
        }
    });
});
