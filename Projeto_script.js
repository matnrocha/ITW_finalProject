        const searchInput = document.getElementById('mySearch');
        const menu = document.getElementById('myMenu');

        const items = [
            { name: "Athletes", link:"athletes.html" },
            { name: "Coaches", link: "" },
            { name: "Competitions", link: "" },
            { name: "Committees", link: "" },
            { name: "All sports", link: "" },
            { name: "Track and Field", link: "" },
            { name: "Basketball", link: "" },
            { name: "Sprint Canoeing", link: "" },
            { name: "Track Cycling", link: "" },
            { name: "Football", link: "" },
            { name: "Swimming", link: "" },
            { name: "Medals", link: "" },
            { name: "Torch route", link: "" },
            { name: "Stadiums", link: "" },
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

// Redirect when pressing enter
function handleSearch(event) {
    event.preventDefault();
    const filter = searchInput.value.toLowerCase();
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
