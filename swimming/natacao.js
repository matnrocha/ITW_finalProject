// Function to populate the table with athlete data
function populateTable(athletes) {
    const $tableBody = $('#table-body');
    $tableBody.empty(); // Clear the table

    athletes.forEach(athlete => {
        const row = `
            <tr data-id="${athlete.Id}">
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

// Fetch data for the selected swimming stage and populate the table
function fetchSwimmingStage(eventId, stageId) {
    $.ajax({
        url: `http://192.168.160.58/Paris2024/api/Swimmings?EventId=${eventId}&StageId=${stageId}`,
        method: 'GET',
        dataType: 'json',
        success: populateTable,
        error: () => alert('Failed to fetch swimming stage data')
    });
}

// Populate event and stage options dynamically
function populateEventAndStageOptions(data) {
    const selectEvento = $("#selectEvento");
    const selectFase = $("#selectFase");
    const eventos = {};

    data.forEach(event => {
        eventos[event.EventId] = event.Stages;
        const option = new Option(event.EventName, event.EventId);
        selectEvento.append(option);
    });

    selectEvento.change(function () {
        const selectedEventId = selectEvento.val();
        selectFase.empty();

        if (selectedEventId) {
            const stages = eventos[selectedEventId];
            stages.forEach(stage => {
                const option = new Option(stage.StageName, stage.StageId);
                selectFase.append(option);
            });

            fetchSwimmingStage(selectedEventId, stages[0].StageId);
        } else {
            const placeholder = new Option('---Select a stage---', '');
            selectFase.append(placeholder);
            $('#table-body').empty(); // Clear the table
        }
    });
}

// Event listener for when the stage is changed
function onStageChange() {
    $('#selectFase').change(function () {
        const selectedEventId = $("#selectEvento").val();
        const selectedStageId = $(this).val();

        if (selectedEventId && selectedStageId) {
            fetchSwimmingStage(selectedEventId, selectedStageId);
        }
    });
}

// Initialize the application
$(document).ready(function () {
    const baseUri = "http://192.168.160.58/Paris2024/api/Swimmings/Events";

    // Fetch events and initialize the select options
    $.get(baseUri, function (data) {
        populateEventAndStageOptions(data);
    });

    onStageChange(); // Set up the event listener for stage change
});
