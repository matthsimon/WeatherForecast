const drowpdown = document.getElementById("city-select");
const weatherApiMap = {
    "clear": {
        "file": "clear.png",
        "display": "clear"
    },
    "pcloudy": {
        "file": "pcloudy.png",
        "display": "partly cloudy"
    },
    "mcloudy": {
        "file": "mcloudy.png",
        "display": "cloudy"
    },
    "cloudy": {
        "file": "cloudy.png",
        "display": "very cloudy"
    },
    "humid": {
        "file": "humid.png",
        "display": "humid"
    },
    "ishower": {
        "file": "ishower.png",
        "display": "isolated showers"
    },
    "lightrain": {
        "file": "lightrain.png",
        "display": "light rain"
    },
    "lightsnow": {
        "file": "lightsnow.png",
        "display": "light snow"
    },
    "oshower": {
        "file": "oshower.png",
        "display": "occasional shower"
    },
    "rain": {
        "file": "rain.png",
        "display": "rain"
    },
    "rainsnow": {
        "file": "rainsnow.png",
        "display": "mixed rain and snow"
    },
    "snow": { 
        "file": "snow.png",
        "display": "snow"
    },
    "ts": {
        "file": "tstorm.png",
        "display": "thunderstorm"
    },
    "tsrain": {
        "file": "tsrain.png",
        "display": "thunderstorm with rain"
    }
};

let cities = {};
fetch("city_coordinates.csv")
    .then((res) => res.text())
    .then((result) => {
        const lines = result.split('\n');
        for (let i = 1; i < lines.length; i++) {
            const data = lines[i].split(',');
            cities[data[2]] = {
                "city": data[2],
                "country": data[3],
                "latitude": data[0],
                "longitude": data[1]
            };
        }

        for (const obj of Object.values(cities)) {
            const elt = document.createElement("option");
            elt.setAttribute("value", obj.city);
            elt.textContent = obj.city + ", " + obj.country;
            drowpdown.appendChild(elt);
        }
    })
    .catch((err) => console.error("Failed to load csv file " + err));

drowpdown.onchange = async function() {
    // Get selected city
    const city = cities[drowpdown.value];

    // Clear result div
    const resultDiv = document.getElementById("result");
    while (resultDiv.firstChild) {
        resultDiv.removeChild(resultDiv.lastChild);
    }

    // Fetch weather API
    const data = await fetch(`http://www.7timer.info/bin/civillight.php?lon=${city.longitude}&lat=${city.latitude}&unit=metric&tzshift=0&output=json`)
        .then((resp) => resp.json())
        .catch((error) => {
            console.error("Failed to fetch weather API " + error);
        });

    for (const dayData of data.dataseries) {
        const col = document.createElement("div");
        col.classList.add("col");
        col.classList.add("align-items-stretch");
        col.classList.add("d-flex");
        resultDiv.appendChild(col);

        const card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("mb-4");
        card.classList.add("rounded-7");
        card.classList.add("shadow-sm");
        col.appendChild(card);

        const cardHeader = document.createElement("div");
        cardHeader.classList.add("card-header");
        cardHeader.classList.add("py-3");
        card.appendChild(cardHeader);

        const dateTitle = document.createElement("h4");
        dateTitle.classList.add("my-0");
        dateTitle.classList.add("fw-normal");
        cardHeader.appendChild(dateTitle);

        const cardBody = document.createElement("div");
        cardBody.classList.add("cord-body");
        card.appendChild(cardBody);

        const img = document.createElement("img");
        cardBody.appendChild(img);

        const weatherName = document.createElement("h4");
        weatherName.classList.add("card-title");
        cardBody.appendChild(weatherName);

        const minMaxBox = document.createElement("p");
        cardBody.appendChild(minMaxBox);

        const year = Math.floor(dayData.date / 10000);
        const month = Math.floor((dayData.date - year * 10000) / 100);
        const day = dayData.date - year * 10000 - month * 100;
        const date = new Date(year, month - 1, day);
        dateTitle.textContent = date.toDateString();

        img.setAttribute("src", "images/" + weatherApiMap[dayData.weather].file);
        weatherName.textContent = weatherApiMap[dayData.weather].display;
        minMaxBox.innerHTML = `High: ${dayData.temp2m.max}&#176C<br />Low: ${dayData.temp2m.min}&#176C`;
    }
}