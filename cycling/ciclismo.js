$(function () {
    const apiEndpoint = "http://192.168.160.58/Paris2024/api/Cycling_Tracks/Events";
    const $tbody = $('#table-body');
    const $eventSelect = $("#selectEvento");
    const $stageSelect = $("#selectFase");
    let stagesByEvent = {};

    const updateTableContent = (items) => {
        $tbody.empty();
        items.forEach(({ Id, ParticipantType, Sex, ParticipantName, CountryName, ParticipantCode }) => {
            $tbody.append(`
                <tr data-id="${Id}">
                    <td class="align-middle">${Id}</td>
                    <td class="align-middle">${ParticipantType}</td>
                    <td class="align-middle">${Sex}</td>
                    <td class="align-middle">${ParticipantName}</td>
                    <td class="align-middle">${CountryName}</td>
                    <td class="align-middle">${ParticipantCode}</td>
                </tr>
            `);
        });
    };

    const loadCyclingStage = (eventId, stageId) => {
        console.log(`Fetching cycling stage for EventId: ${eventId}, StageId: ${stageId}`);
        $.getJSON(`http://192.168.160.58/Paris2024/api/Cycling_Tracks?EventId=${eventId}&StageId=${stageId}`, updateTableContent);
    };

    $.ajax({
        type: "GET",
        url: apiEndpoint,
        success: (response) => {
            response.forEach(({ EventId, EventName, Stages }) => {
                stagesByEvent[EventId] = Stages;
                $eventSelect.append(new Option(EventName, EventId));
            });
        },
        complete: () => {
            $eventSelect.on('change', () => {
                const selectedEvent = $eventSelect.val();
                console.log("Selected event:", selectedEvent);
                $stageSelect.empty();
                if (selectedEvent) {
                    const stages = stagesByEvent[selectedEvent];
                    stages.forEach(({ StageId, StageName }) => {
                        $stageSelect.append(new Option(StageName, StageId));
                    });
                    loadCyclingStage(selectedEvent, stages[0].StageId);
                } else {
                    $stageSelect.append(new Option("---Seleciona uma fase---", ""));
                    $tbody.empty();
                }
            });
        }
    });

    $stageSelect.on('change', () => {
        const selectedEvent = $eventSelect.val();
        const selectedStage = $stageSelect.val();
        console.log("Selected event and stage:", selectedEvent, selectedStage);
        if (selectedEvent) {
            loadCyclingStage(selectedEvent, selectedStage);
        }
    });
});
