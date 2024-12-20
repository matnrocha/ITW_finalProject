// Função para preencher a tabela com os dados dos atletas
function renderAthleteTable(athletes) {
    const $tableContainer = $('#table-body');
    $tableContainer.empty(); // Limpar a tabela

    athletes.forEach((athlete) => {
        const rowTemplate = `
            <tr data-id="${athlete.Id}">
                <td class="align-middle">${athlete.Id}</td>
                <td class="align-middle">${athlete.ParticipantType}</td>
                <td class="align-middle">${athlete.Sex}</td>
                <td class="align-middle">${athlete.ParticipantName}</td>
                <td class="align-middle">${athlete.CountryName}</td>
                <td class="align-middle">${athlete.ParticipantCode}</td>
            </tr>
        `;
        $tableContainer.append(rowTemplate);
    });
}

// Função para buscar os dados da fase e evento
function fetchStageData(eventId, stageId) {
    console.log('Buscando dados para o evento:', eventId, 'e fase:', stageId);

    $.ajax({
        url: `http://192.168.160.58/Paris2024/api/Athletics?EventId=${eventId}&StageId=${stageId}`,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            renderAthleteTable(response);
        },
        error: function (error) {
            console.error('Erro ao buscar dados da fase:', error);
        }
    });
}

$(document).ready(function () {
    const apiEndpoint = "http://192.168.160.58/Paris2024/api/Athletics/Events";
    const eventStageMap = {};
    const eventDropdown = document.getElementById("selectEvento");
    const stageDropdown = document.getElementById("selectFase");

    // Buscar eventos e preencher o dropdown
    $.ajax({
        type: "GET",
        url: apiEndpoint,
        success: function (events) {
            events.forEach((event) => {
                eventStageMap[event.EventId] = event.Stages;

                const eventOption = document.createElement('option');
                eventOption.value = event.EventId;
                eventOption.textContent = event.EventName;

                console.log('Adicionando evento:', eventOption);
                eventDropdown.appendChild(eventOption);
            });

            console.log('Mapa de eventos e fases carregado:', eventStageMap);
        },
        complete: function () {
            // Evento de mudança no dropdown de eventos
            $('#selectEvento').on('change', function () {
                const selectedEventId = $(this).val();
                console.log('Evento selecionado:', selectedEventId);

                $(stageDropdown).empty();

                if (selectedEventId) {
                    const stages = eventStageMap[selectedEventId];
                    stages.forEach((stage) => {
                        const stageOption = document.createElement('option');
                        stageOption.value = stage.StageId;
                        stageOption.textContent = stage.StageName;

                        console.log('Adicionando fase:', stageOption);
                        stageDropdown.appendChild(stageOption);
                    });

                    // Buscar dados automaticamente para a primeira fase
                    fetchStageData(selectedEventId, stages[0]?.StageId);
                } else {
                    const defaultOption = document.createElement('option');
                    defaultOption.value = "";
                    defaultOption.textContent = "---Selecione uma fase---";

                    console.log('Adicionando opção padrão:', defaultOption);
                    stageDropdown.appendChild(defaultOption);

                    $('#table-body').empty(); // Limpar tabela
                }
            });
        },
    });

    // Evento de mudança no dropdown de fases
    $('#selectFase').on('change', function () {
        const selectedEventId = $(eventDropdown).val();
        const selectedStageId = $(this).val();

        console.log('Evento e fase selecionados:', selectedEventId, selectedStageId);

        if (selectedEventId && selectedStageId) {
            fetchStageData(selectedEventId, selectedStageId);
        }
    });
});
