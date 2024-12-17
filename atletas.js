$(document).ready(function () {
    const $container = $('#athlete-container');
    const $pagination = $('#pagination');
    const $modal = $('#athleteModal');
    var athletesList = [];

    // ViewModel
    var viewModel = {
        AthletePhoto: ko.observable(''),
        AthleteName: ko.observable(''),
        BirthCountry: ko.observable(''),
        BirthDate: ko.observable(''),
        BirthPlace: ko.observable(''),
        Sex: ko.observable(''),
        Height: ko.observable(''),
        Weight: ko.observable(''),
        Language: ko.observable(''),
        Occupation: ko.observable(''),
        Education: ko.observable(''),
        Nickname: ko.observable(''),
        Hobbies: ko.observable(''),
        CountryCode: ko.observable(''),
        ResidencePlace: ko.observable(''),
        ResidenceCountry: ko.observable(''),
        Hero: ko.observable(''),
        Influence: ko.observable(''),
        Philosophy: ko.observable(''),
        SportingRelatives: ko.observable(''),
        Ritual: ko.observable(''),
        OtherSports: ko.observable(''),
        Country: ko.observable(''),
        Medals: ko.observable([]),
        Sports: ko.observable([]),
        Competitions: ko.observable([])
    };

    // Aplicar bindings uma única vez
    ko.applyBindings(viewModel, document.getElementById('athleteModal'));

    let currentPage = 1;
    const pageSize = 16;

    function populateTable(athletes) {
        const $tableBody = $('#table-body');
        $tableBody.empty(); // Limpar a tabela
    
            athletes.forEach((athlete, index) => {
                const row = `
                    <tr data-id="${athlete.Id}" style="cursor:pointer;">
                        <td>${index + 1}</td>
                        <td>${athlete.Name}</td>
                        <td>${athlete.Sex}</td>
                        <td>${athlete.BirthCountry || 'N/A'}</td>
                        <td>${athlete.BirthDate ? new Date(athlete.BirthDate).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                `;
                $tableBody.append(row);
            });
    }

    function populateCards(athletes){
        $container.empty();
        athletes.forEach(athlete => {
            const card = `
                <div class="col">
                    <div class="card athlete-card" data-id="${athlete.Id}" style="cursor:pointer;">
                        <img src="${athlete.Photo || 'placeholder.jpg'}" class="card-img-top" alt="${athlete.Name}">
                        <div class="card-body">
                            <h5 class="card-title">${athlete.Name}</h5>
                            <p class="card-text">
                                <strong>Country:</strong> ${athlete.BirthCountry || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            `;
            $container.append(card)
        })
    }
    
    function fetchAthletes(page) {
        console.log('fetchAthletes chamada para a página:', page);

        $.ajax({
            url: `http://192.168.160.58/Paris2024/api/Athletes?page=${page}&pageSize=${pageSize}`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log('Dados da API:', data);
                const athletes = data.Athletes;
                const totalPages = data.TotalPages;
                athletesList = athletes 
    
                // Atualizar paginação
                renderPagination(totalPages, page);
    
                // Populate Table 
                if (isTableView) {
                    populateTable(athletes);
                }
                else{
                    populateCards(athletesList)
                }
            },
            error: function (err) {
                console.error('Erro ao buscar atletas:', err);
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
                    populateTable(athletesList);
                }
                fetchAthletes(currentPage); // Atualiza os atletas
            }
        });
    }

    function fetchAthleteDetails(id) {
        $.ajax({
            url: `http://192.168.160.58/Paris2024/api/Athletes/${id}`,
            method: 'GET',
            dataType: 'json',
            success: function (athlete) {
                console.log('Dados do atleta:', athlete);

                //viewModel com os dados do atleta
                viewModel.AthletePhoto(athlete.Photo || 'placeholder.jpg');
                viewModel.AthleteName(athlete.Name || 'N/A');
                viewModel.BirthCountry(athlete.BirthCountry || 'N/A');
                viewModel.BirthDate(athlete.BirthDate ? new Date(athlete.BirthDate).toLocaleDateString() : 'N/A');
                viewModel.BirthPlace(athlete.BirthPlace || 'N/A');
                viewModel.Sex(athlete.Sex || 'N/A');
                viewModel.Height(athlete.Height || 'N/A');
                viewModel.Weight(athlete.Weight || 'N/A');
                viewModel.Language(athlete.Lang || 'N/A');
                viewModel.Occupation(athlete.Occupation || 'N/A');
                viewModel.Education(athlete.Education || 'N/A');
                viewModel.Nickname(athlete.Nickname || 'N/A');
                viewModel.Hobbies(athlete.Hobbies || 'N/A');
                viewModel.CountryCode(athlete.Country_code || 'N/A');
                viewModel.ResidencePlace(athlete.Residence_place || 'N/A');
                viewModel.ResidenceCountry(athlete.Residence_country || 'N/A');
                viewModel.Hero(athlete.Hero || 'N/A');
                viewModel.Influence(athlete.Influence || 'N/A');
                viewModel.Philosophy(athlete.Philosophy || 'N/A');
                viewModel.SportingRelatives(athlete.SportingRelatives || 'N/A');
                viewModel.Ritual(athlete.Ritual || 'N/A');
                viewModel.OtherSports(athlete.OtherSports || 'N/A');
                viewModel.Country(athlete.Country || 'N/A');
                viewModel.Medals(athlete.Medals ? athlete.Medals.map(medal =>
                    `${medal.Medal_Type} - ${medal.Sport_name}, ${medal.Competition_name}, ${medal.Team_name}`) : []);
                viewModel.Sports(athlete.Sports ? athlete.Sports.map(sport => sport.Name) : ["No sports listed"]);
                viewModel.Competitions(athlete.Competitions ? athlete.Competitions.map(comp => `${comp.Name} (${comp.Tag})`) : ["No competitions available"]);

                // Mostrar o modal
                $('#athleteModal').modal('show');
            },
            error: function (err) {
                console.error('Erro ao buscar detalhes do atleta:', err);
            }
            
        });
    }

    
        
    let isTableView = false; // card or tabela
    $('#toggleViewBtn').on('click', function () {
        const $cards = $('#athlete-container');
        const $table = $('#athlete-table');
        const $button = $(this);

        if (isTableView) {
            $cards.show();
            $table.hide();
            $button.text('Switch to Table');
            populateCards(athletesList);
        } else {
            $cards.hide();
            $table.show();
            $button.text('Switch to Cards');
            populateTable(athletesList); // Populate table literalmente
        }
        isTableView = !isTableView;
    });

    
    
    fetchAthletes(currentPage);

    // detalhes 
    $(document).on('click', '.athlete-card', function () {
        const athleteId = $(this).data('id');
        fetchAthleteDetails(athleteId);
    });
    
    $(document).on('click', '#table-body tr', function () {
           const athleteId = $(this).data('id');
        fetchAthleteDetails(athleteId);
    });
});