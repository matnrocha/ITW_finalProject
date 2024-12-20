$(document).ready(() => {
    const apiBase = "http://192.168.160.58/Paris2024/api/Footballs/Events";
    const $tbBody = $('#table-body');
    const $eventoSelect = $("#selectEvento");
    const $faseSelect = $("#selectFase");
    let stagesByEvent = {};

    const updateTable = (data) => {
        $tbBody.empty();
        data.forEach(({ Id, ParticipantType, Sex, ParticipantName, CountryName, ParticipantCode }) => {
            const row = `
                <tr data-id="${Id}">
                    <td class="align-middle">${Id}</td>
                    <td class="align-middle">${ParticipantType}</td>
                    <td class="align-middle">${Sex}</td>
                    <td class="align-middle">${ParticipantName}</td>
                    <td class="align-middle">${CountryName}</td>
                    <td class="align-middle">${ParticipantCode}</td>
                </tr>
            `;
            $tbBody.append(row);
        });
    };

    const loadFootballStage = (eventId, stageId) => {
        console.log('Loading football stage for EventId:', eventId, 'StageId:', stageId);
        $.ajax({
            url: `http://192.168.160.58/Paris2024/api/Footballs?EventId=${eventId}&StageId=${stageId}`,
            method: 'GET',
            dataType: 'json',
            success: updateTable
        });
    };

    $.ajax({
        type: "GET",
        url: apiBase,
        success: (events) => {
            events.forEach(({ EventId, EventName, Stages }) => {
                stagesByEvent[EventId] = Stages;
                $eventoSelect.append(new Option(EventName, EventId));
            });
            console.log(stagesByEvent);
        },
        complete: () => {
            $eventoSelect.on('change', () => {
                const selectedEvent = $eventoSelect.val();
                console.log("Selected event:", selectedEvent);
                $faseSelect.empty();
                if (selectedEvent) {
                    const eventStages = stagesByEvent[selectedEvent];
                    eventStages.forEach(({ StageId, StageName }) => {
                        $faseSelect.append(new Option(StageName, StageId));
                    });
                    loadFootballStage(selectedEvent, eventStages[0].StageId);
                } else {
                    $faseSelect.append(new Option("---Seleciona uma fase---", ""));
                    $tbBody.empty();
                }
            });
        }
    });

    $faseSelect.on('change', () => {
        const selectedEvent = $eventoSelect.val();
        const selectedStage = $faseSelect.val();
        console.log("Selected phase and event:", selectedStage, selectedEvent);
        if (selectedEvent) {
            loadFootballStage(selectedEvent, selectedStage);
        }
    });
});
