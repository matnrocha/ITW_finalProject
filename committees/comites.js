$(document).ready(function () {
    console.log('Script inicializado!');

    const $committeeContainer = $('#committee-container'); // Container dos comitês
    const $paginationContainer = $('#pagination'); // Container de paginação
    const $committeeModal = $('#committeeModal'); // Modal do comitê
    let committeeList = []; // Lista de comitês
    let activePage = 1; // Página ativa
    const itemsPerPage = 16; // Itens por página

    // ViewModel para exibição no modal
    const modalViewModel = {
        CommitteeName: ko.observable(''),
        Description: ko.observable(''),
        Chairperson: ko.observable(''),
    };
    ko.applyBindings(modalViewModel, document.getElementById('committeeModal'));

    // Função para exibir os cards dos comitês
    function displayCommitteeCards(committeeList) {
        $committeeContainer.empty(); // Limpa o container
        committeeList.forEach(function (committee) {
            const cardHtml = `
                <div class="col">
                    <div class="card committee-card" data-id="${committee.Id}" style="cursor:pointer;">
                        <img src="${committee.Photo || '../images/placeholder.jpg'}" class="card-img-top" alt="${committee.Name}">
                        <div class="card-body">
                            <h5 class="card-title">${committee.Name || 'N/A'}</h5>
                            <p class="card-text">
                                <strong>País:</strong> ${committee.Country || 'N/A'}<br>
                                <strong>Região:</strong> ${committee.Region || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            `;
            $committeeContainer.append(cardHtml); // Adiciona o card ao container
        });
    }

    // Função para buscar comitês da API
    function fetchCommittees(page) {
        console.log('Carregando comitês para a página:', page);
        $.ajax({
            url: `http://192.168.160.58/Paris2024/api/NOCs?page=${page}&pagesize=${itemsPerPage}`,
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                console.log('Resposta da API:', response);
                committeeList = response.NOCs || []; // Atualiza a lista de comitês
                const totalPageCount = response.TotalPages || 1; // Número total de páginas

                displayCommitteeCards(committeeList); // Exibe os cards
                updatePagination(totalPageCount, page); // Atualiza a paginação
            },
            error: function (error) {
                console.error('Erro ao carregar os comitês:', error);
            }
        });
    }

    // Função para atualizar os botões de paginação
    function updatePagination(totalPages, currentPage) {
        $paginationContainer.empty(); // Limpa a paginação

        // Botão anterior
        const prevDisabled = currentPage === 1 ? 'disabled' : '';
        $paginationContainer.append(`
            <li class="page-item ${prevDisabled}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">&laquo;</a>
            </li>
        `);

        // Botões de páginas
        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            $paginationContainer.append(`
                <li class="page-item ${activeClass}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `);
        }

        // Botão próximo
        const nextDisabled = currentPage === totalPages ? 'disabled' : '';
        $paginationContainer.append(`
            <li class="page-item ${nextDisabled}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">&raquo;</a>
            </li>
        `);

        // Evento de clique nos botões de página
        $paginationContainer.find('a').on('click', function (e) {
            e.preventDefault();
            const page = parseInt($(this).data('page'));
            if (!isNaN(page) && page !== currentPage) {
                activePage = page;
                fetchCommittees(activePage); // Recarrega os comitês para a nova página
            }
        });
    }

    // Função para buscar os detalhes de um comitê
    function fetchCommitteeDetails(id) {
        $.ajax({
            url: `http://192.168.160.58/Paris2024/api/NOCs/${id}`,
            method: 'GET',
            dataType: 'json',
            success: function (committee) {
                modalViewModel.CommitteeName(committee.Name || 'N/A');
                modalViewModel.Description(committee.Description || 'N/A');
                modalViewModel.Chairperson(committee.Chairperson || 'N/A');

                $committeeModal.modal('show'); // Exibe o modal com as informações do comitê
            },
            error: function (error) {
                console.error('Erro ao carregar os detalhes do comitê:', error);
            }
        });
    }

    // Evento para abrir os detalhes de um comitê ao clicar no card
    $(document).on('click', '.committee-card', function () {
        const committeeId = $(this).data('id');
        fetchCommitteeDetails(committeeId); // Carrega os detalhes do comitê
    });

    // Carregamento inicial dos comitês
    fetchCommittees(activePage);
});