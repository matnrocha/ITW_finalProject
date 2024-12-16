$(document).ready(function () {
    console.log('Script carregado e pronto!');

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
        // Limpar e preencher os cards
        $container.empty();
        coaches.forEach(coach => {
            const card = `
                <div class="col">
                    <div class="card coach-card" data-id="${coach.Id}" style="cursor:pointer;">
                        <img src="${coach.Photo || 'placeholder.jpg'}" class="card-img-top" alt="${coach.Name}">
                        <div class="card-body">
                            <h5 class="card-title">${coach.Name}</h5>
                            <p class="card-text">
                                <strong>Fuction:</strong> ${coach.Function || 'N/A'}
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
        console.log('fetchCoachs chamada para a página:', page);

        $.ajax({
            url: `http://192.168.160.58/Paris2024/api/Coaches?page=${page}&pageSize=${pageSize}`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log('Dados da API:', data); 
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
                console.error('Erro ao buscar treinadores:', err);
            }
        });
    }

    // Renderizar a paginação
    function renderPagination(totalPages, currentPage) {
        console.log('renderPagination chamada. Total de páginas:', totalPages, 'Página atual:', currentPage);
        $pagination.empty(); 
        
        const windowSize = 9;
        const startPage = Math.max(1, currentPage - Math.floor(windowSize / 2));
        const endPage = Math.min(totalPages, startPage + windowSize - 1);

        // Botão para ir à primeira página, se não estiver visível
        if (startPage > 1) {
            $pagination.append(`
                <li class="page-item">
                    <a class="page-link" href="#" data-page="1">&#x2190</a>
                </li>
            `);
        }

        // Botão de voltar
        const prevDisabled = currentPage === 1 ? 'disabled' : '';
        $pagination.append(`
            <li class="page-item ${prevDisabled}">
                <a class="page-link" href="#" aria-label="Previous" data-page="${currentPage - 1}">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        `);

        // Números das páginas
        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            $pagination.append(`
                <li class="page-item ${activeClass}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `);
        }

        // Botão de próximo
        const nextDisabled = currentPage === totalPages ? 'disabled' : '';
        $pagination.append(`
            <li class="page-item ${nextDisabled}">
                <a class="page-link" href="#" aria-label="Next" data-page="${currentPage + 1}">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        `);

        // Botão para ir à última página, se não estiver visível
        if (endPage < totalPages) {
            $pagination.append(`
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${totalPages}">&#x2192</a>
                </li>
            `);
        }

        // Clicar nos botões de paginação
        $pagination.find('a').on('click', function (e) {
            e.preventDefault();
            const page = parseInt($(this).data('page'));
            if (!isNaN(page) && page !== currentPage) {
                currentPage = page;
                if (isTableView) {
                    populateTable(coachesList);
                }
                fetchCoachs(currentPage); // Atualiza os atletas
            }
        });
    }


    function fetchCoachDetails(id) {
        $.ajax({
            url: `http://192.168.160.58/Paris2024/api/Coaches/${id}`,
            method: 'GET',
            dataType: 'json',
            success: function (coach) {
                console.log(viewModel)

                viewModel.coachPhoto(coach.Photo || 'placeholder.jpg');
                viewModel.coachName(coach.Name || 'N/A');
                viewModel.Sex(coach.Sex || 'N/A');
                viewModel.BirthDate(coach.BirthDate || 'N/A');
                viewModel.Function(coach.Function || 'N/A');
                viewModel.Country(coach.Country || 'N/A');
                viewModel.CountryCode(coach.Country_code || 'N/A');
                viewModel.Sports(coach.Sports ? coach.Sports.map(sport => sport.Name) : ["No sports listed"]);
                

                console.log('model data', viewModel);

            // Show the modal using Bootstrap's modal method
            $('#coachModal').modal('show');
            },

            error: function (err) {
                console.error('Erro ao buscar detalhes do atleta:', err);
            }
    });
    }
    
    let isTableView = false; // card or tabela
    $('#toggleViewBtn').on('click', function () {
        const $cards = $('#coach-container');
        const $table = $('#coach-table');
        const $button = $(this);

        if (isTableView) {
            $cards.show();
            $table.hide();
            $button.text('Switch to Table');
            populateCards(coachesList);
        } else {
            $cards.hide();
            $table.show();
            $button.text('Switch to Cards');
            populateTable(coachesList); // Populate table literalmente
        }
        isTableView = !isTableView;
    });

    fetchCoachs(currentPage);

    // detalhes
    $(document).on('click', '.coach-card', function () {
        const coachId = $(this).data('id');
        fetchCoachDetails(coachId);
    });

    $(document).on('click', '#table-body tr', function () {
        const coachId = $(this).data('id');
        fetchCoachDetails(coachId);
    });
});
