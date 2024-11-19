const urlGender = "https://api.genderize.io/?name=";
const urlNationality = "https://api.nationalize.io/?name=";
const urlCountries = "https://restcountries.com/v3.1/all";

const genderTranslation = {
    female: "Femenino",
    male: "Masculino"
};

window.onload = function () {
        document.getElementById("welcome-message").innerText = "¡Bienvenid@!";
};

document.getElementById("clear-button").addEventListener("click", clearResults);

async function getGender(name) {
    let fullURLGender = urlGender + name;
    console.log("URL de la solicitud de género:", fullURLGender);

    try {
        let response = await fetch(fullURLGender);
        let data = await response.json();

        console.log("Respuesta completa de la API de Género:", data);

        if (data.gender && data.probability) {
            let gender = genderTranslation[data.gender] || data.gender;
            let probability = (data.probability * 100).toFixed(2);
            console.log(`Género predicho para ${name}: ${gender} con una probabilidad del ${probability}%`);

            document.getElementById("gender-result").innerHTML =
            `<span id="gender-title">Género predicho:</span> ${gender} (Probabilidad: ${probability}%)`;        
        } else {
            console.warn(`No se pudo determinar el género para ${name}.`);
            document.getElementById("gender-result").innerHTML =
                "<span id='gender-title'>Género predicho:</span> No se pudo determinar el género.";
        }
    } catch (error) {
        console.error("Error al obtener el género:", error);
        document.getElementById("gender-result").innerHTML =
            "<span id='gender-title'>Género predicho:</span> Ocurrió un error al obtener el género.";
    }
}

async function getNationality(name) {
    let fullURLNationality = urlNationality + name;
    console.log("URL de la solicitud de nacionalidad:", fullURLNationality);

    try {
        let response = await fetch(fullURLNationality);
        let data = await response.json();

        console.log("Respuesta completa de la API de Nacionalidad:", data);

        if (data.country && data.country.length > 0) {
            let nationalityResults = await Promise.all(data.country.slice(0, 3).map(async (countryData, index) => {
                let countryName = await getCountryName(countryData.country_id);
                return {
                    rank: index + 1,
                    country: countryName,
                    probability: (countryData.probability * 100).toFixed(2)
                };
            }));

            console.log("Resultados de nacionalidad:", nationalityResults);

            let resultsContainer = document.getElementById("nationality-results");
            resultsContainer.innerHTML = nationalityResults
                .map(result => `<li>${result.rank}. País: ${result.country} - ${result.probability}%</li>`)
                .join("");
        } else {
            console.warn(`No se pudo determinar la nacionalidad para ${name}.`);
            document.getElementById("nationality-results").innerHTML =
                "<li>No se pudo determinar la nacionalidad.</li>";
        }
    } catch (error) {
        console.error("Error al obtener la nacionalidad:", error);
        document.getElementById("nationality-results").innerHTML =
            "<li>Ocurrió un error al obtener la nacionalidad.</li>";
    }
}


async function getCountryName(countryCode) {
    try {
        let response = await fetch(urlCountries);
        let countries = await response.json();

        let country = countries.find(c => c.cca2 === countryCode);

        if (country) {
            return country.name.common;
        } else {
            return "País desconocido";
        }
    } catch (error) {
        console.error("Error al obtener el nombre del país:", error);
        return "Error al obtener el país";
    }
}

function clearResults() {
    document.getElementById("gender-result").innerText = "";
    document.getElementById("nationality-results").innerHTML = "";

    document.getElementById("name").value = "";

    document.getElementById("gender-result").innerText = "Esperando nombre...";
    document.getElementById("nationality-results").innerHTML = "<li>Esperando nombre...</li>";
}

function handleConsultation(event) {
    event.preventDefault();
    let name = document.getElementById("name").value.trim();
    if (!name) {
        console.warn("Nombre no válido ingresado.");
        return;
    }
    console.log("Nombre ingresado:", name);

    getGender(name);
    getNationality(name);
}
