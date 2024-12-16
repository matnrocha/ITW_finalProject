$(document).ready(function () {
    console.log('Script carregado e pronto!');

    const $container = $('#NOC-container');
    const $pagination = $('#pagination');
    const $modal = $('#NOCModal');
    var NocsList = []
     
    var viewModel = {
        NocPhoto: ko.observable(''),
        NocName: ko.observable(''),
        NocID: ko.observable(''),
        NocNote: ko.observable(''),
        NocAthletes: ko.observable([]),
        NocCoaches: ko.observable([]),
        NocMedals: ko.observable([]),
        NocTeams: ko.observable([]),
    };

    ko.applyBindings(viewModel, document.getElementById('NOCModal'));

    let currentPage = 1;
    const pageSize = 16;

    function populateCards(nocs){
        $container.empty();
        nocs.forEach(noc => {
            const card = `
                <div class="col">
                    <div class="card noc-card" data-id="${noc.Id}" style="cursor:pointer;">
                        <img src="${noc.Photo || 'placeholder.jpg'}" class="card-img-top" alt="${noc.Country}">
                        <div class="card-body">
                            <h5 class="card-title">${noc.Country}</h5>
                            <p class="card-text">
                                <strong>Country:</strong> ${noc.Athletes || 'N/A'}
                            </p>
                            <p class="card-text">
                                <strong>Country:</strong> ${noc.Coaches || 'N/A'}
                            </p>
                            <p class="card-text">
                                <strong>Country:</strong> ${noc.Medals || 'N/A'}
                            </p>
                            <p class="card-text">
                                <strong>Country:</strong> ${noc.Teams || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            `;
            $container.append(card)
        })
    }

    // function populateTable(nocs){
    //     const $tableBody = $('#table-body');
    //     $tableBody.empty(); // Limpar a tabela

    //         techs.forEach((noc, index) => {
    //             const row = `
    //                 <tr data-id="${tech.Id}" style="cursor:pointer;">
    //                     <td>${index + 1}</td>
    //                     <td>${tech.Name}</td>
    //                     <td>${tech.Sex}</td>
    //                     <td>${tech.BirthDate || 'N/A'}</td>
    //                 </tr>
    //             `;
    //             $tableBody.append(row);
    //         })
    // }

    function fetchNOCs(page) {
        console.log('fetchNocs chamada para a página:', page);

        $.ajax({
            url: `http://192.168.160.58/Paris2024/api/NOCs?page=${page}&pagesize=${pageSize}`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log('Dados da API:', data); 
                const nocs = data.NOCs;
                const totalPages = data.TotalPages;
                NocsList = nocs

                // Atualizar a paginação
                renderPagination(totalPages, page);

                if (isTableView){
                    populateTable(nocs)
                }
                else{
                    populateCards(NocsList)
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
                    populateTable(NocsList);
                }
                fetchNOCs(currentPage); // Atualiza os atletas
            }
        });
    }

    function fetchNOCDetails(id) {
        $.ajax({
            url: `http://192.168.160.58/Paris2024/api/NOCs/${id}`,
            method: 'GET',
            dataType: 'json',
            success: function (noc) {
                console.log(viewModel)
                viewModel.NocPhoto(noc.Photo || 'placeholder.jpg');
                viewModel.NocName(noc.Name || 'N/A');
                viewModel.NocNote(noc.Note || 'N/A');
                viewModel.NocAthletes(noc.Athletes ? noc.Athletes.map(athlete => athlete.Name) : ["No sports listed"]);
                viewModel.NocMedals(noc.Medals ? noc.Medals.map(medals => sport.Name) : ["No sports listed"]);
                viewModel.NocCoaches(noc.Coaches ? noc.Coaches.map(coach => coach.Name) : ["No sports listed"]);
                viewModel.NocTeams(noc.Teams ? noc.Teams.map(sport => sport.Name) : ["No sports listed"]);

                console.log('model data', viewModel);

            // Show the modal using Bootstrap's modal method
            $('#NocModal').modal('show');
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
            populateCards(NocsList);
        } else {
            $cards.hide();
            $table.show();
            $button.text('Switch to Cards');
            populateTable(NocsList); // Populate table literalmente
        }
        isTableView = !isTableView;
    });
    
    fetchNOCs(currentPage);

    // abrir os detalhes do atleta
    $(document).on('click', '.tech-card', function () {
        const nocId = $(this).data('id');
        fetchTechDetails(nocId);
    });

    $(document).on('click', '#table-body tr', function () {
        const nocId = $(this).data('id');
        fetchTechDetails(nocId);
    });
});
