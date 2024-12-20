        const searchInput = document.getElementById('mySearch');
        const menu = document.getElementById('myMenu');

        const items = [
            { name: "Athletes", link:"../athletes/atletas.html" },
            { name: "Coaches", link: "../coaches/treinadores.html" },
            { name: "Competitions", link: "../competitions/competicoes.html" },
            { name: "Committees", link: "../committees/comites.html" },
            { name: "All sports", link: "../all_sports/modalidades.html" },
            { name: "Track and Field", link: "../atletism/atletismo.html" },
            { name: "Basketball", link: "../basketball/basquetebol.html" },
            { name: "Sprint Canoeing", link: "../canoeing/canoagem.html" },
            { name: "Track Cycling", link: "../cycling/ciclismo.html" },
            { name: "Football", link: "../football/futebol.html" },
            { name: "Swimming", link: "../swimming/natacao.html" },
            { name: "Medals", link: "../medals/medalheiro.html" },
            { name: "Torch route", link: "../torch/tocha.html" },
            { name: "Stadiums", link: "../stadiums/estadios.html" },
        ];
    

searchInput.addEventListener('keyup', () => {
    const filter = searchInput.value.toLowerCase();
    menu.innerHTML = ''; // Clear previous suggestions

    if (filter) {
        const filteredItems = items.filter(item => item.name.toLowerCase().includes(filter));

        if (filteredItems.length > 0) {
            menu.style.display = 'block';
            filteredItems.forEach(item => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.innerHTML = `<a href="${item.link}">${item.name}</a>`;
                menu.appendChild(listItem);
            });
        } else {
            menu.style.display = 'none';
        }
    } else {
        menu.style.display = 'none';
    }
});

function openDetailsModal() {
    var selectedSport = this;  // 'this' refers to the sport clicked
    self.selectedSportDetails(selectedSport);  // 'selectedSportDetails' is the observable in your view model
}


// Redirect when pressing enter
function handleSearch(event) {
    event.preventDefault();
    const filter = searchInput.value.toLowerCase();
    filter = "../" + filter;
    const match = items.find(item => item.name.toLowerCase() === filter);
    if (match) {
        window.location.href = match.link;
    } else {
        alert('No matching page found.');
    }
}

// Hide menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== searchInput) {
        menu.style.display = 'none';
    }
});
