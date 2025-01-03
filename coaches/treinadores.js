$(document).ready(function () {

    const $container = $('#coach-container');
    const $pagination = $('#pagination');
    const $modal = $('#coachModal');
    var coachesList = []
     
    var viewModel = {
        coachPhoto: ko.observable(''),
        coachName: ko.observable(''),
        BirthDate: ko.observable(''),
        Sex: ko.observable(''),
        Function: ko.observable(''),
        Url: ko.observable(''),
        CountryCode: ko.observable(''),
        Country: ko.observable(''),
        Sports: ko.observable([]),
    };

    ko.applyBindings(viewModel, document.getElementById('coachModal'));

    let currentPage = 1;
    const pageSize = 16;

    function populateCards(coaches){
        $container.empty();
        coaches.forEach(coach => {
            const photoUrl = coach.Photo ? coach.Photo : '../images/placeholder.jpg';
            const card = `
                <div class="col">
                    <div class="card coach-card" data-id="${coach.Id}" style="cursor:pointer;">
                        <img src="${photoUrl}" class="card-img-top" alt="${coach.Name}" 
                             onerror="this.src='../images/placeholder.jpg';">
                        <div class="card-body">
                            <h5 class="card-title">${coach.Name || 'N/A'}</h5>
                            <p class="card-text">
                                <strong>Function:</strong> ${coach.Function || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            `;
            $container.append(card);
        });
    }
    

    function populateTable(coaches){
        const $tableBody = $('#table-body');
        $tableBody.empty(); // Limpar a tabela

            coaches.forEach((coach, index) => {
                const row = `
                    <tr data-id="${coach.Id}" style="cursor:pointer;">
                        <td>${index + 1}</td>
                        <td>${coach.Name}</td>
                        <td>${coach.Sex}</td>
                        <td>${coach.Function || 'N/A'}</td>
                    </tr>
                `;
                $tableBody.append(row);
            })
    }

    function fetchCoachs(page) {

        $.ajax({
            url: `http://192.168.160.58/Paris2024/api/Coaches?page=${page}&pageSize=${pageSize}`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                const coaches = data.Coaches;
                const totalPages = data.TotalPages;
                coachesList = coaches
                
                // Atualizar a paginação
                renderPagination(totalPages, page);

                if (isTableView){
                    populateTable(coaches)
                }
                else{
                    populateCards(coachesList)
                }
            },
            error: function (err) {
            }
        });
    }

    function renderPagination(totalPages, currentPage) {
        $pagination.empty(); 
        
        const windowSize = 9;
        const startPage = Math.max(1, currentPage - Math.floor(windowSize / 2));
        const endPage = Math.min(totalPages, startPage + windowSize - 1);

        if (startPage > 1) {
            $pagination.append(`
                <li class="page-item">
                    <a class="page-link" href="#" data-page="1">&#x2190</a>
                </li>
            `);
        }

        const prevDisabled = currentPage === 1 ? 'disabled' : '';
        $pagination.append(`
            <li class="page-item ${prevDisabled}">
                <a class="page-link" href="#" aria-label="Previous" data-page="${currentPage - 1}">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        `);

        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            $pagination.append(`
                <li class="page-item ${activeClass}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `);
        }

        const nextDisabled = currentPage === totalPages ? 'disabled' : '';
        $pagination.append(`
            <li class="page-item ${nextDisabled}">
                <a class="page-link" href="#" aria-label="Next" data-page="${currentPage + 1}">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        `);

        if (endPage < totalPages) {
            $pagination.append(`
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${totalPages}">&#x2192</a>
                </li>
            `);
        }

        $pagination.find('a').on('click', function (e) {
            e.preventDefault();
            const page = parseInt($(this).data('page'));
            if (!isNaN(page) && page !== currentPage) {
                currentPage = page;
                if (isTableView) {
                    populateTable(coachesList);
                }
                fetchCoachs(currentPage); 
            }
        });
    }


    function fetchCoachDetails(id) {
        $.ajax({
            url: `http://192.168.160.58/Paris2024/api/Coaches/${id}`,
            method: 'GET',
            dataType: 'json',
            success: function (coach) {

                viewModel.coachPhoto(coach.Photo || '../images/placeholder.jpg');
                viewModel.coachName(coach.Name || 'N/A');
                viewModel.Sex(coach.Sex || 'N/A');
                viewModel.BirthDate(coach.BirthDate || 'N/A');
                viewModel.Function(coach.Function || 'N/A');
                viewModel.Country(coach.Country || 'N/A');
                viewModel.CountryCode(coach.Country_code || 'N/A');
                viewModel.Sports(coach.Sports ? coach.Sports.map(sport => sport.Name) : ["No sports listed"]);

            $('#coachModal').modal('show');
            },

            error: function (err) {
                console.error(err);
            }
    });
    }
    
    let isTableView = false; 
    $('#toggleViewBtn').on('click', function () {
        const $cards = $('#coach-container');
        const $table = $('#coach-table');
        const $button = $(this);

        if (isTableView) {
            $cards.show();
            $table.hide();
            $button.text('Switch view');
            populateCards(coachesList);
        } else {
            $cards.hide();
            $table.show();
            $button.text('Switch view');
            populateTable(coachesList); 
        }
        isTableView = !isTableView;
    });

    fetchCoachs(currentPage);

    $(document).on('click', '.coach-card', function () {
        const coachId = $(this).data('id');
        fetchCoachDetails(coachId);
    });

    $(document).on('click', '#table-body tr', function () {
        const coachId = $(this).data('id');
        fetchCoachDetails(coachId);
    });
});
