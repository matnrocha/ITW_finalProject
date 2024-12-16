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

    function populateCards(techs){
        // Limpar e preencher os cards
        $container.empty();
        techs.forEach(tech => {
            const card = `
                <div class="col">
                    <div class="card tech-card" data-id="${tech.Id}" style="cursor:pointer;">
                        <div class="card-body">
                            <h5 class="card-title">${tech.Name}</h5>
                        </div>
                    </div>
                </div>
            `;
            $container.append(card);
        });
    }

    function populateTable(techs){
        const $tableBody = $('#table-body');
        $tableBody.empty(); // Limpar a tabela

            techs.forEach((tech, index) => {
                const row = `
                    <tr data-id="${tech.Id}" style="cursor:pointer;">
                        <td>${index + 1}</td>
                        <td>${tech.Name}</td>
                        <td>${tech.Sex}</td>
                        <td>${tech.BirthDate || 'N/A'}</td>
                    </tr>
                `;
                $tableBody.append(row);
            })
    }

    function fetchTechs(page) {
        console.log('fetchTechs chamada para a página:', page);

        $.ajax({
            url: `http://192.168.160.58/Paris2024/api/Technical_officials?page=${page}&pagesize=${pageSize}`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log('Dados da API:', data); 
                const techs = data.Technical_officials;
                const totalPages = data.TotalPages;
                techsList = techs

                // Atualizar a paginação
                renderPagination(totalPages, page);

                if (isTableView){
                    populateTable(techs)
                }
                else{
                    populateCards(techsList)
                }
            },
            error: function (err) {
                console.error('Erro ao buscar juízes:', err);
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
            $button.text('Switch to Table');
            populateCards(techsList);
        } else {
            $cards.hide();
            $table.show();
            $button.text('Switch to Cards');
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
