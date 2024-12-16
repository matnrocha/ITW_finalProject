//buscar todos os eventos e colocá-los nos selects
function populateTable(athletes) {
    const $tableBody = $('#table-body');
    $tableBody.empty(); // Limpar a tabela

    athletes.forEach((athlete) => {
        const row = `
                    <tr data-id="${athlete.Id}">
                        <td class="align-middle">${athlete.Id}</td>
                        <td class="align-middle">${athlete.ParticipantType}</td>
                        <td class="align-middle">${athlete.Sex}</td>
                        <td class="align-middle">${athlete.ParticipantName}</td>
                        <td class="align-middle">${athlete.CountryName}</td>
                        <td class="align-middle">${athlete.ParticipantCode}</td>
                    </tr>
                `;
        $tableBody.append(row);
    });
}

function fetchAthleticsStage(EventId, StageId){
    console.log('fetchAthleticsStage chamada para a página:', EventId, StageId);

    $.ajax({
        url: `http://192.168.160.58/Paris2024/api/Athletics?EventId=${EventId}&StageId=${StageId}`,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            populateTable(data);
        }
    })
}

$(document).ready(function(){
    var baseUri = "http://192.168.160.58/Paris2024/api/Athletics/Events"
    var eventos = {};
    var selectEvento = document.getElementById("selectEvento");
    var selectFase = document.getElementById("selectFase");
    $.ajax({
        type: "GET",
        url: baseUri,
        success: function (data) {
            for(var i=0; i<data.length; i++){
                eventos[data[i].EventId] = data[i].Stages
                var newOption = document.createElement('option');
                newOption.value = data[i].EventId;
                newOption.innerHTML = data[i].EventName;
                console.log(newOption);
                selectEvento.appendChild(newOption);
            }
            console.log(eventos)
        },
        complete: function (data) {
            $('#selectEvento').change(function () {
                var eventoSelecionado = $("#selectEvento option:selected").val();
                console.log("evento selecionado", eventoSelecionado)
                $("#selectFase").empty();
                if (eventoSelecionado != ""){
                    var fases = eventos[eventoSelecionado]
                    for (var i = 0; i < fases.length; i++) {
                        var newOption = document.createElement('option');
                        newOption.value = fases[i].StageId;
                        newOption.innerHTML = fases[i].StageName;
                        console.log(newOption);
                        selectFase.appendChild(newOption);
                    }
                    fetchAthleticsStage(eventoSelecionado, fases[0].StageId)
                }
                else{
                    var newOption = document.createElement('option');
                    newOption.value = "";
                    newOption.innerHTML = "---Seleciona uma fase---";
                    console.log(newOption);
                    selectFase.appendChild(newOption);
                    const $tableBody = $('#table-body');
                    $tableBody.empty(); // Limpar a tabela
                }
            });
        }
    })

    $('#selectFase').change(function(){
        var eventoSelec = $("#selectEvento option:selected").val();
        var faseSelec = $("#selectFase option:selected").val();
        console.log("fase e evento: ", faseSelec, eventoSelec)
        if (eventoSelec != ""){
            fetchAthleticsStage(eventoSelec, faseSelec);
        }
        
    })

    
});
