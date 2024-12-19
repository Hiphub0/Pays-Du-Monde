let countries = [];

// Récupération des données des pays
async function fetchCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,population,capital,area,flags,languages,translations');
        const countriesData = await response.json();

        countries = countriesData.map(country => ({
            name: country.translations.fra.common, // Nom du pays en français
            population: country.population.toLocaleString(),
            capital: country.capital ? country.capital[0] : 'N/A',
            area: country.area ? country.area.toLocaleString() + ' km²' : 'N/A',
            flag: country.flags.svg,
            languages: country.languages ? Object.values(country.languages).join(', ') : 'N/A',
            monuments: getMonuments(country.translations.fra.common), // Monuments (ajouté localement)
            dishes: getDishes(country.translations.fra.common), // Plats typiques (ajouté localement)
        }));

        displayCountries(countries);
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

// Ajout de la liste des pays dans la table
function displayCountries(countriesList) {
    const listContainer = document.getElementById("countries-list");
    listContainer.innerHTML = "";

    countriesList.forEach(country => {
        const countryRow = document.createElement("tr");
        countryRow.innerHTML = `
            <td><img src="${country.flag}" alt="Drapeau de ${country.name}" class="flag-img"></td>
            <td><button onclick="openModal('${country.name}')">${country.name}</button></td>
            <td>${country.capital}</td>
            <td>${country.population}</td>
            <td>${country.area}</td>
            <td><button onclick="viewOnMap('${country.name}')">Voir sur la carte</button></td>
        `;
        listContainer.appendChild(countryRow);
    });
}

// Ouverture de la modale pour afficher les détails du pays
function openModal(countryName) {
    const country = countries.find(c => c.name === countryName);

    if (country) {
        document.getElementById("country-name").innerText = country.name;
        document.getElementById("country-flag").src = country.flag;
        document.getElementById("country-capital").innerText = country.capital;
        document.getElementById("country-population").innerText = country.population;
        document.getElementById("country-area").innerText = country.area;
        document.getElementById("country-languages").innerText = country.languages;
        document.getElementById("country-monuments").innerText = country.monuments.join(', ');
        document.getElementById("country-dishes").innerText = country.dishes.join(', ');

        document.getElementById("country-modal").style.display = "block";
    }
}

// Fermeture de la modale
function closeModal() {
    document.getElementById("country-modal").style.display = "none";
}

// Liste de monuments célèbres (ajout manuel)
function getMonuments(countryName) {
    const monumentsData = {
        France: ["Tour Eiffel", "Cathédrale Notre-Dame", "Château de Versailles"],
        Italie: ["Colisée", "Tour de Pise", "Vatican"],
        Japon: ["Mont Fuji", "Temple Kinkaku-ji", "Château de Himeji"],
        // Ajouter plus de pays ici
    };
    return monumentsData[countryName] || ["Données non disponibles"];
}

// Liste de plats typiques (ajout manuel)
function getDishes(countryName) {
    const dishesData = {
        France: ["Baguette", "Croissant", "Ratatouille"],
        Italie: ["Pizza", "Pâtes", "Tiramisu"],
        Japon: ["Sushi", "Ramen", "Okonomiyaki"],
        // Ajouter plus de pays ici
    };
    return dishesData[countryName] || ["Données non disponibles"];
}

// Initialisation des données
fetchCountries();
