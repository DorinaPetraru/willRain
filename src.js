'use strict';
/* Botón de inicio */
const willRainButton = document.querySelector('body > header > button');
/* Funcion de geolocalización */
function getNavGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert('Geolocation cannot be obtained');
    }
}
let lat;
let lon;

/**********************
 * Función de posición *
 ***********************/

function success(geolocationPosition) {
    let coords = geolocationPosition.coords;
    lat = coords.latitude;
    lon = coords.longitude;
    getDataOWM(lat, lon);
}
function error(err) {
    alert('Geolocation cannot be obtained');
    document.querySelector('#error').innerHTML = err.message;
}

/******************************
 * Obteniendo datos de la API *
 ******************************/

async function getDataOWM(lat, lon) {
    clock();
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=daily&appid=c7e776fc30298b8b9d4ca96e930fa43b`
        );
        const data = await response.json();
        console.log(data);
        /*********************************
         *Datos del día y momento actual *
         **********************************/
        let {
            clouds: currentClouds,
            feels_like: currentFeels_like,
            humidity: currentHumidity,
            temp: currentTemp,
        } = data.current;
        let { main: currentMain, icon: currentIcon } = data.current.weather[0];
        let { timezone } = data;
        let sectionCurrent = document.querySelector('section#current');
        let currentArticle = document.createElement('article');
        let currentHeader = document.createElement('header');
        let currentImg = document.createElement('img');
        let iconSrc = `http://openweathermap.org/img/wn/${currentIcon}@2x.png`;
        currentImg.setAttribute('src', iconSrc);
        currentImg.setAttribute('alt', `${currentMain} icon`);
        let h2 = document.createElement('h2');
        h2.textContent = timezone;
        let h3 = document.createElement('h3');
        h3.textContent = `${(currentTemp - 273.15).toFixed(1)}°C`;
        let h4 = document.createElement('h4');
        h4.textContent = currentMain;
        currentHeader.append(currentImg, h2, h3, h4);
        let currentSectionChild = document.createElement('section');
        let currentP1 = document.createElement('p');
        currentP1.textContent = `Cloudiness: ${currentClouds}%`;
        let currentP2 = document.createElement('p');
        currentP2.textContent = `Temperature sensation: ${(
            currentFeels_like - 273.15
        ).toFixed(1)}°C`;
        let currentP3 = document.createElement('p');
        currentP3.textContent = `Humidity: ${currentHumidity}%`;
        currentSectionChild.append(currentP1, currentP2, currentP3);
        currentArticle.append(currentHeader, currentSectionChild);
        sectionCurrent.append(currentArticle);

        /*********************************
         * Datos de las siguientes horas *
         ********************************/

        let sectionNext = document.querySelector('section#next');
        let frag = document.createDocumentFragment();

        for (let hour = 1; hour < 9; hour++) {
            let { dt: nextHour, temp: nextTemp } = data.hourly[hour];
            let { main: nextMain, icon: nextIcon } =
                data.hourly[hour].weather[0];
            let articleNext = document.createElement('article');
            let h2nextHour = document.createElement('h2');
            h2nextHour.textContent =
                new Date(nextHour * 1000).getHours() + ':00';
            let nextImg = document.createElement('img');
            let iconSrc = `http://openweathermap.org/img/wn/${nextIcon}@2x.png`;
            nextImg.setAttribute('src', iconSrc);
            nextImg.setAttribute('alt', `${nextMain} icon`);
            let nextH2 = document.createElement('h2');
            nextH2.textContent = nextMain;
            let nextH3 = document.createElement('h3');
            nextH3.textContent = `${(nextTemp - 273.15).toFixed(1)}°C`;
            frag.append(h2nextHour, nextImg, nextH2, nextH3);
            articleNext.append(frag);
            sectionNext.append(articleNext);
        }

        let h1Header = document.querySelector('body > header > h1');

        if (
            data.hourly[1].weather[0].main === 'Rain' ||
            data.hourly[2].weather[0].main === 'Rain' ||
            data.hourly[3].weather[0].main === 'Rain' ||
            data.hourly[4].weather[0].main === 'Rain' ||
            data.hourly[5].weather[0].main === 'Rain' ||
            data.hourly[6].weather[0].main === 'Rain' ||
            data.hourly[7].weather[0].main === 'Rain' ||
            data.hourly[8].weather[0].main === 'Rain'
        ) {
            h1Header.textContent = `Rain in the next 8 hours`;
        } else {
            h1Header.textContent = `No rain in the next 8 hours`;
        }
    } catch (error) {
        console.error(error);
    }
}

/****************************************************
 * Formato de numero para horas, minutos y segundos *
 ****************************************************/

const formatNum = (num) => {
    return num < 10 ? '0' + num : num;
};

/**************************
 * Función de hora y fecha *
 ***************************/

function clock() {
    let currentDate = new Date();
    let currentDay = currentDate.getDate();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let currentHour = currentDate.getHours();
    let currentMinute = currentDate.getMinutes();
    let currentSeconds = currentDate.getSeconds();
    let monthsList = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    let clockH2 = document.createElement('h2');
    clockH2.textContent = `${formatNum(currentHour)} : ${formatNum(
        currentMinute
    )} : ${formatNum(currentSeconds)}`;
    let dateH3 = document.createElement('h3');
    dateH3.textContent = `${monthsList[currentMonth]} ${currentDay}, ${currentYear}`;
    let currentDiv = document.createElement('div');
    currentDiv.append(clockH2, dateH3);
    let currentSection = document.querySelector('section#current');
    currentSection.append(currentDiv);

    /**************************************
     * Cambiando background según la hora *
     **************************************/

    let day = './videos/dia.mp4';
    let afternoom = './videos/atardecer.mp4';
    let night = './videos/noche.mp4';
    let video = document.querySelector('body > video');
    let source = document.createElement('source');
    if (currentHour >= 7 && currentHour < 14) {
        source.removeAttribute(night);
        source.setAttribute('src', day);
    } else if (currentHour >= 14 && currentHour < 20) {
        source.removeAttribute(day);
        source.setAttribute('src', afternoom);
    } else if (currentHour >= 20 || currentHour < 7) {
        source.removeAttribute(afternoom);
        source.setAttribute('src', night);
    }
    video.append(source);
}

/*****************************
 * Asignando evento al botón *
 * ***************************/

willRainButton.addEventListener('click', () => {
    willRainButton.style.display = 'none';
    getNavGeolocation();
});
