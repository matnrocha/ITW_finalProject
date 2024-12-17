$(document).ready(function () {
    console.log('Script carregado e pronto!');

    const $container = $('#tech-container');
    const $pagination = $('#pagination');
    const $modal = $('#techModal');
    var techsList = []
     
    var viewModel = {
        techPhoto: ko.observable(''),
        techName: ko.observable(''),
        BirthDate: ko.observable(''),
        Sex: ko.observable(''),
        Function: ko.observable(''),
        Category: ko.observable(''),
        OrganisationLong: ko.observable(''),
        OrganizationCode: ko.observable(''),
        Organisation: ko.observable(''),
        Sports: ko.observable([]),
    };

    ko.applyBindings(viewModel, document.getElementById('techModal'));

    let currentPage = 1;
    const pageSize = 16;

    // Função para popular os cards
    function populateCards(committees){
        $container.empty();
        committees.forEach(committee => {
            const card = `
                <div class="col">
                    <div class="card committee-card" data-id="${committee.Id}" style="cursor:pointer;">
                        <img src="${committee.Photo || 'placeholder.jpg'}" class="card-img-top" alt="${committee.Name}">
                        <div class="card-body">
                            <h5 class="card-title">${committee.Name}</h5>
                            <p class="card-text">
                                <strong>Country:</strong> ${committee.Country || 'N/A'}<br>
                                <strong>Region:</strong> ${committee.Region || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            `;
            $container.append(card)
        })
    }

    // Função para buscar os dados da API de comitês
    function fetchCommittees(page) {
        console.log('fetchCommittees chamada para a página:', page);

        $.ajax({
            url: `http://192.168.160.58/Paris2024/api/NOCs?page=${page}&pagesize=${pageSize}`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log('Dados da API:', data);
                const committees = data.NOCs; // Ajuste de acordo com o formato da resposta
                const totalPages = data.TotalPages; // Ajuste de acordo com o formato da resposta
                committeesList = committees;

                // Atualizar paginação
                renderPagination(totalPages, page);

                // Atualizar a exibição de dados conforme a visualização
                if (isTableView) {
                    populateTable(committees);
                } else {
                    populateCards(committeesList);
                }
            },
            error: function (err) {
                console.error('Erro ao buscar comitês:', err);
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
                    populateTable(techsList);
                }
                fetchTechs(currentPage); // Atualiza os atletas
            }
        });
    }

    function fetchTechDetails(id) {
        $.ajax({
            url: `http://192.168.160.58/Paris2024/api/Technical_officials/${id}`,
            method: 'GET',
            dataType: 'json',
            success: function (tech) {
                console.log(viewModel)
                console.log('Image URL:', tech.Photo);
                viewModel.techPhoto(tech.Photo || 'placeholder.jpg');
                viewModel.techName(tech.Name || 'N/A');
                viewModel.Sex(tech.Sex || 'N/A');
                viewModel.BirthDate(tech.BirthDate || 'N/A');
                viewModel.Category(tech.Category || 'N/A');
                viewModel.Function(tech.Function || 'N/A');
                viewModel.Organisation(tech.Organisation || 'N/A');
                viewModel.OrganizationCode(tech.OrganizationCode || 'N/A');
                viewModel.OrganisationLong(tech.OrganisationLong || 'N/A');
                viewModel.Sports(tech.Sports ? tech.Sports.map(sport => sport.Name) : ["No sports listed"]);

                console.log('model data', viewModel);

            // Show the modal using Bootstrap's modal method
            $('#techModal').modal('show');
            },

            error: function (err) {
                console.error('Erro ao buscar detalhes do atleta:', err);
            }
    });
    }

    let isTableView = false; // card or tabela
    $('#toggleViewBtn').on('click', function () {
        const $cards = $('#tech-container');
        const $table = $('#tech-table');
        const $button = $(this);

        if (isTableView) {
            $cards.show();
            $table.hide();
            $button.text('Switch view');
            populateCards(techsList);
        } else {
            $cards.hide();
            $table.show();
            $button.text('Switch view');
            populateTable(techsList); // Populate table literalmente
        }
        isTableView = !isTableView;
    });
    
    fetchTechs(currentPage);

    // abrir os detalhes do atleta
    $(document).on('click', '.tech-card', function () {
        const techId = $(this).data('id');
        fetchTechDetails(techId);
    });

    $(document).on('click', '#table-body tr', function () {
        const techId = $(this).data('id');
        fetchTechDetails(techId);
    });
});
