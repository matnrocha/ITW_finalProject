$(document).ready(function () {
    console.log('Script carregado e pronto!');

    const $container = $('#committee-container'); // Fixed container ID
    const $pagination = $('#pagination');
    const $modal = $('#committeeModal');
    let committeesList = [];
    let currentPage = 1;
    const pageSize = 16;

    var viewModel = {
        CommitteeName: ko.observable(''),
        Description: ko.observable(''),
        Chairperson: ko.observable(''),
    };
    ko.applyBindings(viewModel, document.getElementById('committeeModal'));

    // Function to populate cards
    function populateCards(committees) {
        $container.empty(); // Clear the container
        committees.forEach(committee => {
            const card = `
                <div class="col">
                    <div class="card committee-card" data-id="${committee.Id}" style="cursor:pointer;">
                        <img src="${committee.Photo || '../images/placeholder.jpg'}" class="card-img-top" alt="${committee.Name}">
                        <div class="card-body">
                            <h5 class="card-title">${committee.Name || 'N/A'}</h5>
                            <p class="card-text">
                                <strong>Country:</strong> ${committee.Country || 'N/A'}<br>
                                <strong>Region:</strong> ${committee.Region || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            `;
            $container.append(card);
        });
    }

    // Fetch committees from API
    function fetchCommittees(page) {
        console.log('Fetching committees for page:', page);
        $.ajax({
            url: `http://192.168.160.58/Paris2024/api/NOCs?page=${page}&pagesize=${pageSize}`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log('API Response:', data);
                committeesList = data.NOCs || [];
                const totalPages = data.TotalPages || 1;

                populateCards(committeesList);
                renderPagination(totalPages, page);
            },
            error: function (err) {
                console.error('Error fetching committees:', err);
            }
        });
    }

    // Function to render pagination
    function renderPagination(totalPages, currentPage) {
        $pagination.empty();

        // Previous button
        const prevDisabled = currentPage === 1 ? 'disabled' : '';
        $pagination.append(`
            <li class="page-item ${prevDisabled}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">&laquo;</a>
            </li>
        `);

        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            $pagination.append(`
                <li class="page-item ${activeClass}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `);
        }

        // Next button
        const nextDisabled = currentPage === totalPages ? 'disabled' : '';
        $pagination.append(`
            <li class="page-item ${nextDisabled}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">&raquo;</a>
            </li>
        `);

        $pagination.find('a').on('click', function (e) {
            e.preventDefault();
            const page = parseInt($(this).data('page'));
            if (!isNaN(page) && page !== currentPage) {
                currentPage = page;
                fetchCommittees(currentPage);
            }
        });
    }

    // Fetch committee details
    function fetchCommitteeDetails(id) {
        $.ajax({
            url: `http://192.168.160.58/Paris2024/api/NOCs/${id}`,
            method: 'GET',
            dataType: 'json',
            success: function (committee) {
                viewModel.CommitteeName(committee.Name || 'N/A');
                viewModel.Description(committee.Description || 'N/A');
                viewModel.Chairperson(committee.Chairperson || 'N/A');

                $('#committeeModal').modal('show');
            },
            error: function (err) {
                console.error('Error fetching committee details:', err);
            }
        });
    }

    // Event to open committee details
    $(document).on('click', '.committee-card', function () {
        const committeeId = $(this).data('id');
        fetchCommitteeDetails(committeeId);
    });

    // Initial fetch
    fetchCommittees(currentPage);
});
