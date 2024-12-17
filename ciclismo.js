function populateTable(participants) {
    const $tableBody = $('#table-body');
    $tableBody.empty(); // Clear the table

    participants.forEach((participant) => {
        const row = `
            <tr data-id="${participant.Id}">
                <td class="align-middle">${participant.Id}</td>
                <td class="align-middle">${participant.ParticipantType}</td>
                <td class="align-middle">${participant.Sex}</td>
                <td class="align-middle">${participant.ParticipantName}</td>
                <td class="align-middle">${participant.CountryName}</td>
                <td class="align-middle">${participant.ParticipantCode}</td>
            </tr>
        `;
        $tableBody.append(row);
    });
}

function fetchCyclingStage(EventId, StageId) {
    console.log('fetchCyclingStage chamada para a página:', EventId, StageId);

    $.ajax({
        url: `http://192.168.160.58/Paris2024/api/Cycling_Tracks?EventId=${EventId}&StageId=${StageId}`,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            populateTable(data);
        }
    })
}

$(document).ready(function () {
    var baseUri = "http://192.168.160.58/Paris2024/api/Cycling_Tracks/Events";
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
        complete: function () {
            $('#selectEvento').change(function () {
                var eventoSelecionado = $("#selectEvento option:selected").val();
                console.log("evento selecionado", eventoSelecionado);
                $("#selectFase").empty();
                if (eventoSelecionado != "") {
                    var fases = eventos[eventoSelecionado];
                    for (var i = 0; i < fases.length; i++) {
                        var newOption = document.createElement('option');
                        newOption.value = fases[i].StageId;
                        newOption.innerHTML = fases[i].StageName;
                        selectFase.appendChild(newOption);
                    }
                    fetchCyclingStage(eventoSelecionado, fases[0].StageId);
                } else {
                    var newOption = document.createElement('option');
                    newOption.value = "";
                    newOption.innerHTML = "---Seleciona uma fase---";
                    selectFase.appendChild(newOption);
                    const $tableBody = $('#table-body');
                    $tableBody.empty(); // Clear the table
                }
            });
        }
    });

    $('#selectFase').change(function () {
        var eventoSelec = $("#selectEvento option:selected").val();
        var faseSelec = $("#selectFase option:selected").val();
        console.log("fase e evento: ", faseSelec, eventoSelec);
        if (eventoSelec != "") {
            fetchCyclingStage(eventoSelec, faseSelec);
        }
    });
});
