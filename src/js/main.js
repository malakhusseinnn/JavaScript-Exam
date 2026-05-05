// Global countries selection

let selectCountry = document.querySelector("#global-country");
let today = document.querySelector("#current-datetime");

let todayDate = new Date();

let options = {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
};
let formattedDate = todayDate.toLocaleString("en-US", options);

today.innerHTML = formattedDate;

async function getCountries() {
  let response = await fetch("https://date.nager.at/api/v3/AvailableCountries");
  let data = await response.json();
  return data;
}

async function loadCountries() {
  let countries = await getCountries();

  countries.forEach((country) => {
    selectCountry.innerHTML += `<option value="${country.countryCode}">${country.countryCode} - ${country.name}</option>`;
  });
}

loadCountries();

async function getCountryInfo(countryCode) {
  let response = await fetch(
    `https://restcountries.com/v3.1/alpha/${countryCode}`,
  );
  let info = await response.json();
  return info[0];
}

let city = document.querySelector("#global-city");
let dashboardInfo = document.querySelector("#dashboard-country-info");
let destination = document.querySelector("#selected-destination");

async function selectDisplay(countryCode) {
  let countryInfo = await getCountryInfo(countryCode);
  destination.innerHTML = `
             <div class="selected-flag">
                  <img id="selected-country-flag" src=${countryInfo.flags.svg} alt="${countryInfo.name.common}">
                </div>
                <div class="selected-info">
                  <span class="selected-country-name" id="selected-country-name">${countryInfo.name.common}</span>
                  <span class="selected-city-name" id="selected-city-name">• ${countryInfo.capital[0]}</span>
                </div>
                <button class="clear-selection-btn" id="clear-selection-btn">
                  <i class="fa-solid fa-xmark"></i>
                </button>`;
}

async function displayInfo(countryCode) {
  let countryInfo = await getCountryInfo(countryCode);
  let currencyName = Object.values(countryInfo.currencies)[0].name;
  let symbol = Object.values(countryInfo.currencies)[0].symbol;
  let { root, suffixes } = countryInfo.idd;
  dashboardInfo.innerHTML = `
         <div class="dashboard-country-header">
                  <img src=${countryInfo.flags.svg} alt="${countryInfo.name.common}" class="dashboard-country-flag" id="flag">
                  <div class="dashboard-country-title">
                    <h3 id="countryTitle">${countryInfo.name.common}</h3>
                    <p class="official-name" id="OfficialCountryName">${countryInfo.name.official}</p>
                    <span class="region" id="region"><i class="fa-solid fa-location-dot"></i>${countryInfo.region} • ${countryInfo.subregion}</span>
                  </div>
                </div>

                <div class="dashboard-local-time">
                  <div class="local-time-display">
                    <i class="fa-solid fa-clock"></i>
                    <span class="local-time-value" id="country-local-time">08:30:45 AM</span>
                    <span class="local-time-zone" id="localTimeZone">${countryInfo.timezones[0]}</span>
                  </div>
                </div>

                <div class="dashboard-country-grid">
                  <div class="dashboard-country-detail">
                    <i class="fa-solid fa-building-columns"></i>
                    <span class="label">Capital</span>
                    <span class="value" id="capital">${countryInfo.capital}</span>
                  </div>
                  <div class="dashboard-country-detail">
                    <i class="fa-solid fa-users"></i>
                    <span class="label">Population</span>
                    <span class="value" id="population">${countryInfo.population.toLocaleString()}</span>
                  </div>
                  <div class="dashboard-country-detail">
                    <i class="fa-solid fa-ruler-combined"></i>
                    <span class="label">Area</span>
                    <span class="value" id="area">${countryInfo.area.toLocaleString()} km²</span>
                  </div>
                  <div class="dashboard-country-detail">
                    <i class="fa-solid fa-globe"></i>
                    <span class="label">Continent</span>
                    <span class="value" id="continent">${countryInfo.continents}</span>
                  </div>
                  <div class="dashboard-country-detail">
                    <i class="fa-solid fa-phone"></i>
                    <span class="label">Calling Code</span>
                    <span class="value" id="callingCode">${root + suffixes[0]}</span>
                  </div>
                  <div class="dashboard-country-detail">
                    <i class="fa-solid fa-car"></i>
                    <span class="label">Driving Side</span>
                    <span class="value" id="drivingSide">${countryInfo.car.side.charAt(0).toUpperCase() + countryInfo.car.side.slice(1)}</span>
                  </div>
                  <div class="dashboard-country-detail">
                    <i class="fa-solid fa-calendar-week"></i>
                    <span class="label">Week Starts</span>
                    <span class="value" id="weekStarts">${countryInfo.startOfWeek.charAt(0).toUpperCase() + countryInfo.startOfWeek.slice(1)}</span>
                  </div>
                </div>

                <div class="dashboard-country-extras">
                  <div class="dashboard-country-extra">
                    <h4><i class="fa-solid fa-coins"></i> Currency</h4>
                    <div class="extra-tags" id="currency">
                      <span class="extra-tag">${currencyName} (${Object.keys(countryInfo.currencies)[0]} ${symbol})</span>
                    </div>
                  </div>
                  <div class="dashboard-country-extra">
                    <h4><i class="fa-solid fa-language"></i> Languages</h4>
                    <div class="extra-tags" id="languages">
                    </div>
                  </div>
                  <div class="dashboard-country-extra" id="neighbourContainer">
                    <h4><i class="fa-solid fa-map-location-dot"></i> Neighbors</h4>
                    <div class="extra-tags" id="neighbours">
                    </div>
                  </div>
                </div>

                <div class="dashboard-country-actions">
                  <a href=${countryInfo.maps.googleMaps} target="_blank" class="btn-map-link" id="mapLink">
                    <i class="fa-solid fa-map"></i> View on Google Maps
                  </a>
                </div>
        
        `;

  let languages = document.querySelector("#languages");
  let neighbours = document.querySelector("#neighbours");
  let neighbourContainer = document.querySelector("#neighbourContainer");

  Object.values(countryInfo.languages).forEach((value) => {
    languages.innerHTML += `<span class="extra-tag">${value}</span>`;
  });
  let neighbourss = countryInfo.borders ?? [];
  if (neighbourss.length == 0) {
    neighbourContainer.style.display = "none";
  } else {
    neighbourContainer.style.display = "block";
    neighbourss.map((border) => {
      let span = document.createElement("span");
      span.className = "extra-tag border-tag";
      span.textContent = border;

      span.addEventListener("click", () => {
        displayInfo(border);
      });

      neighbours.appendChild(span);
    });
  }
}

function showEmptyPlaceholder() {
  dashboardInfo.innerHTML = `
          <div class="country-info-placeholder">
                <div class="placeholder-icon">
                  <i data-fa-i2svg=""><svg class="svg-inline--fa fa-globe" aria-hidden="true" focusable="false"
                      data-prefix="fas" data-icon="globe" role="img" xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512" data-fa-i2svg="">
                      <path fill="currentColor"
                        d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z">
                      </path>
                    </svg></i>
                </div>
                <p>Select a country to view detailed information</p>
              </div>`;
}

showEmptyPlaceholder();

let exploreBtn = document.querySelector("#global-search-btn");

async function updateInfo() {
  let country = await getCountryInfo(selectCountry.value);
  city.innerHTML = `<option value="${country.capital[0]}" selected>${country.capital[0]} (Capital) </option>`;
}

exploreBtn.addEventListener("click", () => {
  let selectedCountry = selectCountry.value;
  displayInfo(selectedCountry);
});

// side bar
let dashboardPage = document.querySelector("#dashboardPage");
let holidaysPage = document.querySelector("#holidays");
let eventsPage = document.querySelector("#events");
let weatherPage = document.querySelector("#weather");
let longWeekendPage = document.querySelector("#longWeekends");
let currencyPage = document.querySelector("#currencyPage");
let sunTimesPage = document.querySelector("#sunTimes");
let myPlansPage = document.querySelector("#myPlans");
let views = document.querySelectorAll(".view");
let dashboardView = document.querySelector("#dashboard-view");
let holidayView = document.querySelector("#holidays-view");
let eventView = document.querySelector("#events-view");
let weatherView = document.querySelector("#weather-view");
let longWeekendsView = document.querySelector("#long-weekends-view");
let currencyView = document.querySelector("#currency-view");
let sunTimesView = document.querySelector("#sun-times-view");
let myPlansView = document.querySelector("#my-plans-view");
let navItems = document.querySelectorAll(".nav-item");

function showView(item, viewToShow) {
  views.forEach((view) => view.classList.remove("active"));
  navItems.forEach((item) => item.classList.remove("active"));
  viewToShow.classList.add("active");
  item.classList.add("active");
}
dashboardPage.addEventListener("click", () => {
  showView(dashboardPage, dashboardView);
});
holidaysPage.addEventListener("click", () => {
  showView(holidaysPage, holidayView);
});

eventsPage.addEventListener("click", () => {
  showView(eventsPage, eventView);
});

weatherPage.addEventListener("click", () => {
  showView(weatherPage, weatherView);
});

longWeekendPage.addEventListener("click", () => {
  showView(longWeekendPage, longWeekendsView);
});

currencyPage.addEventListener("click", () => {
  showView(currencyPage, currencyView);
});

sunTimesPage.addEventListener("click", () => {
  showView(sunTimesPage, sunTimesView);
});

myPlansPage.addEventListener("click", () => {
  showView(myPlansPage, myPlansView);
});

// holiday

let year = document.querySelector("#global-year");
let holidayContent = document.querySelector("#holidays-content");
let holidayHeader = document.querySelector("#holidays-selection");

async function getHolidays(year, countryCode) {
  let response = await fetch(
    `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`,
  );
  let data = await response.json();
  return data;
}
let holidayDate;
async function displayHolidays(year, countryCode) {
  holidayContent.innerHTML = "";

  if (!countryCode) {
    showHolidayPlaceHolder();
    return;
  }
  let country = await getCountryInfo(countryCode);
  holidayHeader.style.display = "block";
  holidayHeader.innerHTML = `
     <div class="current-selection-badge">
                <img src=${country.flags.svg} alt=${country.name.common} class="selection-flag">
                <span>${country.name.common}</span>
                <span class="selection-year">${year}</span>
    `;

  let count = 0;
  let holidays = await getHolidays(year, countryCode);
  holidays.map((holiday) => {
    count++;
    let dateStr = holiday.date;
    let date = new Date(dateStr);

    let day = date.getDate();
    let month = date.toLocaleString("en-US", { month: "short" });
    let weekday = date.toLocaleString("en-US", { weekday: "long" });
    holidayDate = date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    let types = holiday.types
      .map((type) => `<span class="holiday-type-badge">${type}</span>`)
      .join("");

    holidayContent.innerHTML += `
            <div class="holiday-card" data-id = ${count}>
              <div class="holiday-card-header">
                <div class="holiday-date-box"><span class="day">${day}</span><span class="month">${month}</span></div>
                <span class = 'holiday-date' style = 'display:none;'>${holidayDate}</span>
                <button class="holiday-action-btn holiday-icon" data-id = ${count}><i class="fa-regular fa-heart"></i></button>
              </div>
              <h3>${holiday.localName}</h3>
              <p class="holiday-name">${holiday.name}</p>
              <div class="holiday-card-footer">
                <span class="holiday-day-badge"><i class="fa-regular fa-calendar"></i> ${weekday}</span>
                <div>
                <div>
                ${types}
                </div>
                </div>
              </div>
            </div>
    `;
  });
}
function showHolidayPlaceHolder() {
  holidayContent.innerHTML = `
        <div class="empty-state">
              <div class="empty-icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-calendar-xmark" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar-xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M160 0c17.7 0 32 14.3 32 32V64H320V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H32V112c0-26.5 21.5-48 48-48h48V32c0-17.7 14.3-32 32-32zM32 192H480V464c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V192zM337 305c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47z"></path></svg></i></div>
              <h3>No Country Selected</h3>
              <p>Select a country from the dashboard to explore public holidays</p>
              <button class="btn btn-primary" id = "goToDashboardBtn1">
                <i data-fa-i2svg=""><svg class="svg-inline--fa fa-globe" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"></path></svg></i>
                Go to Dashboard
              </button>
            </div>
    `;
}
showHolidayPlaceHolder();

let toDashboard1 = document.querySelector("#goToDashboardBtn1");
toDashboard1.addEventListener("click", () => {
  showView(dashboardPage, dashboardView);
});

// events
let eventContent = document.querySelector("#events-content");
let eventHeader = document.querySelector("#eventHeader");

function showEventPlaceHolder() {
  eventContent.innerHTML = `<div class="empty-state">
              <div class="empty-icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-ticket" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ticket" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M64 64C28.7 64 0 92.7 0 128v64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320v64c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V320c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6V128c0-35.3-28.7-64-64-64H64zm64 112l0 160c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16V176c0-8.8-7.2-16-16-16H144c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V160z"></path></svg></i></div>
              <h3>No City Selected</h3>
              <p>Select a country and city from the dashboard to discover events</p>
              <button class="btn btn-primary" id = "goToDashboardBtn2">
                <i data-fa-i2svg=""><svg class="svg-inline--fa fa-globe" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"></path></svg></i>
                Go to Dashboard
              </button>
            </div>`;
}

showEventPlaceHolder();

let toDashboard2 = document.querySelector("#goToDashboardBtn2");
toDashboard2.addEventListener("click", () => {
  showView(dashboardPage, dashboardView);
});

async function getEvents(city, countryCode) {
  let response = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?apikey=VwECw2OiAzxVzIqnwmKJUG41FbeXJk1y&city=${city}&countryCode=${countryCode}&size=20`,
  );
  let data = await response.json();
  return data._embedded?.events || [];
}

function formatDateTime(localDate, localTime) {
  const dateTime = new Date(`${localDate}T${localTime}`);

  const datePart = dateTime.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timePart = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${datePart} at ${timePart}`;
}

async function showEventInfo(city, countryCode) {
  eventContent.innerHTML = "";

  if (!countryCode) {
    showEventPlaceHolder();
    return;
  }

  let events = await getEvents(city, countryCode);
  let country = await getCountryInfo(countryCode);

  eventHeader.style.display = "block";
  eventHeader.innerHTML = `
             <div class="current-selection-badge">
                <img src=${country.flags.svg} alt=${country.name.common} class="selection-flag">
                <span>${country.name.common}</span>
                <span class="selection-city">${country.capital[0]}</span>`;

  let count = 0;
  if (events.length) {
    events.forEach((event) => {
      count++;
      let localDate = event.dates.start.localDate;
      let localTime = event.dates.start.localTime;
      let date = formatDateTime(localDate, localTime);

      eventContent.innerHTML += ` <div class="event-card" data-id = ${count}>
              <div class="event-card-image">
                <img src=${event.images[0].url}
                  alt="${event.classifications[0].segment.name}">
                <span class="event-card-category">${event.classifications[0].segment.name}</span>
                <button class="event-card-save event-icon" data-id=${count}><i class="fa-regular fa-heart"></i></button>
              </div>
              <div class="event-card-body">
                <h3>${event.name}</h3>
                <div class="event-card-info">
                  <div class = 'date'><i class="fa-regular fa-calendar"></i>${date}</div>
                  <div class = 'location'><i class="fa-solid fa-location-dot"></i>${event._embedded.venues[0].name}, ${event._embedded.venues[0].city.name}</div>
                </div>
                <div class="event-card-footer">
                  <button class="btn-event"><i class="fa-regular fa-heart"></i> Save</button>
                  <a href="#" class="btn-buy-ticket"><i class="fa-solid fa-ticket"></i> Buy Tickets</a>
                </div>
              </div>
            </div>`;
    });
  } else {
    eventContent.innerHTML = `<div class="empty-state">
        <div class="empty-icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-ticket" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ticket" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M64 64C28.7 64 0 92.7 0 128v64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320v64c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V320c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6V128c0-35.3-28.7-64-64-64H64zm64 112l0 160c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16V176c0-8.8-7.2-16-16-16H144c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V160z"></path></svg></i></div>
        <h3>No Events Found</h3>
        <p>No events found for this location</p>
      </div>`;
  }
}

// weather

let weatherHeader = document.querySelector("#weatherHeader");
let weatherContent = document.querySelector("#weather-content");

async function getCityCoordinates(city, countryCode) {
  let response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&country=${countryCode}&count=1`,
  );
  let data = await response.json();
  return {
    latitude: data.results[0].latitude,
    longitude: data.results[0].longitude,
  };
}

function showWeatherPlaceHolder() {
  weatherContent.innerHTML = `<div class="empty-state">
              <div class="empty-icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-ticket" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ticket" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M64 64C28.7 64 0 92.7 0 128v64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320v64c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V320c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6V128c0-35.3-28.7-64-64-64H64zm64 112l0 160c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16V176c0-8.8-7.2-16-16-16H144c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V160z"></path></svg></i></div>
              <h3>No City Selected</h3>
              <p>Select a country and city from the dashboard to discover events</p>
              <button class="btn btn-primary" id = 'goToDashboardBtn3' >
                <i data-fa-i2svg=""><svg class="svg-inline--fa fa-globe" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"></path></svg></i>
                Go to Dashboard
              </button>
            </div>`;
}
showWeatherPlaceHolder();

let toDashboard3 = document.querySelector("#goToDashboardBtn3");
toDashboard3.addEventListener("click", () => {
  showView(dashboardPage, dashboardView);
});

const options2 = {
  weekday: "long",
  month: "short",
  day: "numeric",
};

let dateToday = todayDate.toLocaleString("en-US", options2);
async function getWeather(lat, lon) {
  let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`;

  let response = await fetch(url);
  let data = await response.json();
  return data;
}
let weatherCodeMap = {
  0: "Clear sky",

  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",

  45: "Fog",
  48: "Depositing rime fog",

  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",

  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",

  71: "Slight snowfall",
  73: "Moderate snowfall",
  75: "Heavy snowfall",

  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",

  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Severe thunderstorm with hail",
};

let weatherClassMap = {
  sunny: [0, 1],
  cloudy: [2, 3],
  foggy: [45, 48],
  rainy: [51, 53, 55, 61, 63, 65, 80, 81, 82],
  snowy: [71, 73, 75],
  stormy: [95, 96, 99],
};

function getState(code) {
  return weatherCodeMap[code];
}

function getWeatherClass(code) {
  for (const [className, codes] of Object.entries(weatherClassMap)) {
    if (codes.includes(code)) {
      return `weather-${className}`;
    }
  }
  return "weather-default";
}

function getWeatherIcon(code) {
  if (code === 0) return "fa-sun";
  if ([1, 2].includes(code)) return "fa-cloud-sun";
  if (
    [
      3, 45, 48, 51, 53, 55, 61, 63, 65, 71, 73, 75, 80, 81, 82, 95, 96, 99,
    ].includes(code)
  )
    return "fa-cloud";
  return "fa-sun";
}

async function showWeather(city, countryCode) {
  let lat = (await getCityCoordinates(city, countryCode)).latitude;
  let lon = (await getCityCoordinates(city, countryCode)).longitude;
  let country = await getCountryInfo(countryCode);

  if (!countryCode) {
    showWeatherPlaceHolder();
    return;
  }
  let data = await getWeather(lat, lon);
  let currentTemp = Math.round(data.current.temperature_2m);
  let maxTemp = Math.round(data.daily.apparent_temperature_max[0]);
  let minTemp = Math.round(data.daily.temperature_2m_min[0]);
  let feelsLike = Math.round(data.current.apparent_temperature);
  let codeString = getState(data.current.weather_code);
  let weatherClass = getWeatherClass(data.current.weather_code);
  let uvIndex = Math.round(data.daily.uv_index_max[0]);
  let windSpeed = Math.round(data.daily.wind_speed_10m_max[0]);

  weatherHeader.style.display = "block";
  weatherHeader.innerHTML = `<div class="current-selection-badge">
                <img src=${country.flags.svg} alt=${country.name.common} class="selection-flag">
                <span>${country.name.common}</span>
                <span class="selection-city"> ${city}</span>
              </div>`;

  let times = data.hourly.time;
  let temps = data.hourly.temperature_2m;
  let startIndex = times.findIndex((t) => new Date(t) >= todayDate);

  let hour;
  let itsTemp;

  let hourlyHTML = "";

  for (let i = startIndex - 1; i < startIndex + 24; i++) {
    let date = new Date(times[i]);
    let hours = date.getHours();
    let weatherIcon = getWeatherIcon(data.hourly.weather_code[i]);
    let amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    let temp = temps[i];

    hour = hours + " " + amPm;
    itsTemp = Math.round(temp);

    if (i == startIndex - 1) {
      hourlyHTML += `<div class="hourly-item now">
                  <span class="hourly-time">Now</span>
                  <div class="hourly-icon"><i class="fa-solid ${weatherIcon}"></i></div>
                  <span class="hourly-temp">${itsTemp}°</span>
                </div>`;
    } else {
      hourlyHTML += `<div class="hourly-item">
                  <span class="hourly-time">${hour}</span>
                  <div class="hourly-icon"><i class="fa-solid ${weatherIcon}"></i></div>
                  <span class="hourly-temp">${itsTemp}°</span>
                </div>`;
    }
  }

  let dailyHTML = "";
  for (let i = 0; i < 7; ++i) {
    let dailyMaxTemp = Math.round(data.daily.apparent_temperature_max[i]);
    let dailyMinTemp = Math.round(data.daily.apparent_temperature_min[i]);
    let precip = data.daily.precipitation_probability_max[i]
      ? `<div class="forecast-precip">
                        <i class="fa-solid fa-droplet"></i><span>${data.daily.precipitation_probability_max[i]}%</span>
                    </div>`
      : ``;

    let iconClass = getWeatherIcon(data.daily.weather_code[i]);
    let date = new Date(data.daily.time[i]);
    let dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    let dayNumber = date.getDate();
    let monthShort = date.toLocaleDateString("en-US", { month: "short" });

    if (i == 0) {
      dailyHTML = `<div class="forecast-day today">
                  <div class="forecast-day-name"><span class="day-label">Today</span><span class="day-date">${dayNumber}
                      ${monthShort}</span></div>
                  <div class="forecast-icon"><i class="fa-solid ${iconClass}"></i></div>
                  <div class="forecast-temps"><span class="temp-max">${dailyMaxTemp}°</span><span class="temp-min">${dailyMinTemp}°</span></div>
                  <div class="forecast-precip">
                  ${precip}
                  </div>
                </div>`;
    } else {
      dailyHTML += dailyHTML = `
                    <div class="forecast-day">
                    <div class="forecast-day-name">
                        <span class="day-label">${dayName}</span>
                        <span class="day-date">${dayNumber} ${monthShort}</span>
                    </div>
                    <div class="forecast-icon"><i class="fa-solid ${iconClass}"></i></div>
                    <div class="forecast-temps">
                        <span class="temp-max">${dailyMaxTemp}°</span>
                        <span class="temp-min">${dailyMinTemp}°</span>
                    </div>
                    ${precip}
                    </div>
                    `;
    }
  }

  weatherContent.innerHTML = `
        <div class="weather-hero-card ${weatherClass}">
              <div class="weather-location">
                <i class="fa-solid fa-location-dot"></i>
                <span>${city}</span>
                <span class="weather-time">${dateToday}</span>
              </div>
              <div class="weather-hero-main">
                <div class="weather-hero-left">
                  <div class="weather-hero-icon"><i class="fa-solid fa-sun"></i></div>
                  <div class="weather-hero-temp">
                    <span class="temp-value">${currentTemp}</span>
                    <span class="temp-unit">${data.current_units.apparent_temperature}</span>
                  </div>
                </div>
                <div class="weather-hero-right">
                  <div class="weather-condition">${codeString}</div>
                  <div class="weather-feels">Feels like ${feelsLike}°C</div>
                  <div class="weather-high-low">
                    <span class="high"><i class="fa-solid fa-arrow-up"></i> ${maxTemp}°</span>
                    <span class="low"><i class="fa-solid fa-arrow-down"></i> ${minTemp}°</span>
                  </div>
                </div>
              </div>
            </div>
    
             <div class="weather-details-grid">
              <div class="weather-detail-card">
                <div class="detail-icon humidity"><i class="fa-solid fa-droplet"></i></div>
                <div class="detail-info">
                  <span class="detail-label">Humidity</span>
                  <span class="detail-value">${data.current.relative_humidity_2m}%</span>
                </div>
              </div>
              <div class="weather-detail-card">
                <div class="detail-icon wind"><i class="fa-solid fa-wind"></i></div>
                <div class="detail-info">
                  <span class="detail-label">Wind</span>
                  <span class="detail-value">${windSpeed} km/h</span>
                </div>
              </div>
              <div class="weather-detail-card">
                <div class="detail-icon uv"><i class="fa-solid fa-sun"></i></div>
                <div class="detail-info">
                  <span class="detail-label">UV Index</span>
                  <span class="detail-value">${uvIndex}</span>
                </div>
              </div>
              <div class="weather-detail-card">
                <div class="detail-icon precip"><i class="fa-solid fa-cloud-rain"></i></div>
                <div class="detail-info">
                  <span class="detail-label">Precipitation</span>
                  <span class="detail-value">${data.daily.precipitation_probability_max[0]}%</span>
                </div>
              </div>
            </div>

             <div class="weather-section">
              <h3 class="weather-section-title"><i class="fa-solid fa-clock"></i> Hourly Forecast</h3>
              <div class="hourly-scroll" id="hourlyForcast">
              ${hourlyHTML}
              </div>
            </div>


            <div class="weather-section">
              <h3 class="weather-section-title"><i class="fa-solid fa-calendar-week"></i> 7-Day Forecast</h3>
              <div class="forecast-list" id = 'dailyForcast'>
              ${dailyHTML}
              </div>
            </div>

    `;
}

// long weekend

let longWeekend = document.querySelector("#longView");
let lwContent = document.querySelector("#lw-content");

async function getLongWeekend(year, countryCode) {
  let response = await fetch(
    `https://date.nager.at/api/v3/LongWeekend/${year}/${countryCode}`,
  );
  let data = await response.json();
  return data;
}

function showLongWeekendPlaceHolder() {
  lwContent.innerHTML = `<div class="empty-state">
              <div class="empty-icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-umbrella-beach" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="umbrella-beach" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M346.3 271.8l-60.1-21.9L214 448H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H282.1l64.1-176.2zm121.1-.2l-3.3 9.1 67.7 24.6c18.1 6.6 38-4.2 39.6-23.4c6.5-78.5-23.9-155.5-80.8-208.5c2 8 3.2 16.3 3.4 24.8l.2 6c1.8 57-7.3 113.8-26.8 167.4zM462 99.1c-1.1-34.4-22.5-64.8-54.4-77.4c-.9-.4-1.9-.7-2.8-1.1c-33-11.7-69.8-2.4-93.1 23.8l-4 4.5C272.4 88.3 245 134.2 226.8 184l-3.3 9.1L434 269.7l3.3-9.1c18.1-49.8 26.6-102.5 24.9-155.5l-.2-6zM107.2 112.9c-11.1 15.7-2.8 36.8 15.3 43.4l71 25.8 3.3-9.1c19.5-53.6 49.1-103 87.1-145.5l4-4.5c6.2-6.9 13.1-13 20.5-18.2c-79.6 2.5-154.7 42.2-201.2 108z"></path></svg></i></div>
              <h3>No Country Selected</h3>
              <p>Select a country from the dashboard to discover long weekend opportunities</p>
              <button class="btn btn-primary" id = 'goToDashboardBtn4'>
                <i data-fa-i2svg=""><svg class="svg-inline--fa fa-globe" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"></path></svg></i>
                Go to Dashboard
              </button>
            </div>`;
}
showLongWeekendPlaceHolder();

let toDashboard4 = document.querySelector("#goToDashboardBtn4");
toDashboard4.addEventListener("click", () => {
  showView(dashboardPage, dashboardView);
});

function formateDate(date) {
  const formattedDate = new Date(date);

  return formattedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getWeekendDays(startDate, endDate) {
  const result = [];
  let current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    result.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return result;
}

function getDayParts(date) {
  return {
    name: date.toLocaleDateString("en-US", { weekday: "short" }),
    num: date.getDate(),
  };
}

function isWeekend(date) {
  let day = date.getDay();
  return day === 0 || day === 6;
}

function getWeekendDaysSection(startDate, endDate) {
  let weekends = getWeekendDays(startDate, endDate);

  return weekends
    .map((date) => {
      let d = getDayParts(date);
      let weekendClass = isWeekend(date) ? "weekend" : "";

      return `
          <div class="lw-day ${weekendClass}">
            <span class="name">${d.name}</span>
            <span class="num">${d.num}</span>
          </div>
        `;
    })
    .join("");
}

async function showLongWeekends(year, countryCode) {
  let data = await getLongWeekend(year, countryCode);
  let country = await getCountryInfo(countryCode);
  lwContent.innerHTML = "";

  let count = 0;
  if (!countryCode) {
    showLongWeekendPlaceHolder();
    return;
  }

  longWeekend.style.display = "block";
  longWeekend.innerHTML = `<div class="current-selection-badge">
                <img src=${country.flags.svg} alt=${country.name.common} class="selection-flag">
                <span>${country.name.common}</span>
                <span class="selection-year">${year}</span>
              </div>`;

  data.forEach((element) => {
    count++;
    let extra;
    if (element.needBridgeDay) {
      extra = `<div class="lw-info-box warning"><i class="fa-solid fa-info-circle"></i> Requires taking a bridge day off</div>`;
    } else {
      extra = `<div class="lw-info-box success" id = 'extraOrNot'><i class="fa-solid fa-check-circle"></i> No extra days off needed!</div>`;
    }
    let startDate = formateDate(element.startDate);
    let endDate = formateDate(element.endDate);

    let weekends = getWeekendDaysSection(element.startDate, element.endDate);

    lwContent.innerHTML += `
            <div class="lw-card" data-id = ${count}>
              <div class="lw-card-header">
                <span class="lw-badge"><i class="fa-solid fa-calendar-days"></i> ${element.dayCount} Days</span>
                <button class="holiday-action-btn lw-icon" data-id=${count}><i class="fa-regular fa-heart"></i></button>
              </div>
              <h3>Long Weekend #${count}</h3>
              <div class="lw-dates"><i class="fa-regular fa-calendar"></i> ${startDate} - ${endDate}</div>
              ${extra}
              <div class="lw-days-visual" id = 'dates'>
                ${weekends}
              </div>
            </div>
        `;
  });
}

//currency

// let currencyFrom = document.querySelector("#currency-from");
// let currencyTo = document.querySelector("#currency-to");
// let convertBtn = document.querySelector("#convert-btn");
// let popularCurrencies = document.querySelector("#popular-currencies");
// let convertResult = document.querySelector("#currency-result");

// async function getCurrencies() {
//     let respnse = await fetch(`https://v6.exchangerate-api.com/v6/805842951e5953ad31497176/latest/USD`);
//     let data = await respnse.json();
//     console.log(data);
//     return data;
// }

// getCurrencies();

// sunrise

let sunTimesContent = document.querySelector("#sun-times-content");
let sunsetHeader = document.querySelector("#sunsetHeader");
function showSunsetPlaceHolder() {
  sunTimesContent.innerHTML = `<div class="empty-state">
              <div class="empty-icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-sun" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sun" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"></path></svg></i></div>
              <h3>No City Selected</h3>
              <p>Select a country and city from the dashboard to see sunrise and sunset times</p>
              <button class="btn btn-primary" onclick="navigateTo('dashboard')">
                <i data-fa-i2svg=""><svg class="svg-inline--fa fa-globe" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"></path></svg></i>
                Go to Dashboard
              </button>
            </div>`;
}
showSunsetPlaceHolder();

async function getSunset(lat, lon, date) {
  let url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&=${date}&formatted=0`;

  let response = await fetch(url);
  let data = await response.json();
  return data.results;
}

function formatTime12h(str) {
  let date = new Date(str);
  let hours = date.getHours();
  let minutes = String(date.getMinutes()).padStart(2, "0");
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

function formatDayLength(seconds) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function remaining(hours, minutes) {
  let totalMinutesInDay = 24 * 60;
  let usedMinutes = hours * 60 + minutes;

  let remainingMinutes = totalMinutesInDay - usedMinutes;

  let h = Math.floor(remainingMinutes / 60);
  let m = remainingMinutes % 60;

  return `${h}h ${m}m`;
}

function remainingOfDay(str) {
  let match = str.match(/(\d+)h\s*(\d+)m/);

  let hours = parseInt(match[1]);
  let minutes = parseInt(match[2]);

  return remaining(hours, minutes);
}

let formatted = todayDate.toISOString().split("T")[0];

async function showSunsetTimes(city, countryCode) {
  let lat = (await getCityCoordinates(city, countryCode)).latitude;
  let lon = (await getCityCoordinates(city, countryCode)).longitude;
  let country = await getCountryInfo(countryCode);

  let data = await getSunset(lat, lon, formatted);
  if (!countryCode) {
    showSunsetPlaceHolder();
    return;
  }

  let dawn = formatTime12h(data.civil_twilight_begin);
  let sunrise = formatTime12h(data.sunrise);
  let solarNoon = formatTime12h(data.solar_noon);
  let sunset = formatTime12h(data.sunset);
  let dusk = formatTime12h(data.civil_twilight_end);
  let dayLength = formatDayLength(data.day_length);
  let restDayLength = remainingOfDay(dayLength);

  let precent = ((data.day_length / 86400) * 100).toFixed(1);

  sunsetHeader.style.display = "block";
  sunsetHeader.innerHTML = `<div class="current-selection-badge">
                <img src=${country.flags.svg} alt=${country.name.common} class="selection-flag">
                <span>${country.name.common}</span>
                <span class="selection-city">${city}</span>
              </div>`;

  let dayName = todayDate.toLocaleDateString("en-US", { weekday: "short" });

  sunTimesContent.innerHTML = `<div class="sun-main-card">
              <div class="sun-main-header">
                <div class="sun-location">
                  <h2><i class="fa-solid fa-location-dot"></i> ${city}</h2>
                  <p>Sun times for your selected location</p>
                </div>
                <div class="sun-date-display">
                  <div class="date">${dateToday}</div>
                  <div class="day">${dayName}</div>
                </div>
              </div>

              <div class="sun-times-grid">
                <div class="sun-time-card dawn">
                  <div class="icon"><i class="fa-solid fa-moon"></i></div>
                  <div class="label">Dawn</div>
                  <div class="time">${dawn}</div>
                  <div class="sub-label">Civil Twilight</div>
                </div>
                <div class="sun-time-card sunrise">
                  <div class="icon"><i class="fa-solid fa-sun"></i></div>
                  <div class="label">Sunrise</div>
                  <div class="time">${sunrise}</div>
                  <div class="sub-label">Golden Hour Start</div>
                </div>
                <div class="sun-time-card noon">
                  <div class="icon"><i class="fa-solid fa-sun"></i></div>
                  <div class="label">Solar Noon</div>
                  <div class="time">${solarNoon}</div>
                  <div class="sub-label">Sun at Highest</div>
                </div>
                <div class="sun-time-card sunset">
                  <div class="icon"><i class="fa-solid fa-sun"></i></div>
                  <div class="label">Sunset</div>
                  <div class="time">${sunset}</div>
                  <div class="sub-label">Golden Hour End</div>
                </div>
                <div class="sun-time-card dusk">
                  <div class="icon"><i class="fa-solid fa-moon"></i></div>
                  <div class="label">Dusk</div>
                  <div class="time">${dusk}</div>
                  <div class="sub-label">Civil Twilight</div>
                </div>
                <div class="sun-time-card daylight">
                  <div class="icon"><i class="fa-solid fa-hourglass-half"></i></div>
                  <div class="label">Day Length</div>
                  <div class="time">${dayLength}</div>
                  <div class="sub-label">Total Daylight</div>
                </div>
              </div>
            </div>

            <div class="day-length-card">
              <h3><i class="fa-solid fa-chart-pie"></i> Daylight Distribution</h3>
              <div class="day-progress">
                <div class="day-progress-bar">
                  <div class="day-progress-fill" style="width: ${precent}%"></div>
                </div>
              </div>
              <div class="day-length-stats">
                <div class="day-stat">
                  <div class="value">${dayLength}</div>
                  <div class="label">Daylight</div>
                </div>
                <div class="day-stat">
                  <div class="value">${precent}%</div>
                  <div class="label">of 24 Hours</div>
                </div>
                <div class="day-stat">
                  <div class="value">${restDayLength}</div>
                  <div class="label">Darkness</div>
                </div>
              </div>
            </div>
            </div>
    `;
}

selectCountry.addEventListener("change", async () => {
  let selected = selectCountry.value;
  if (!selected) {
    showEmptyPlaceholder();
    showHolidayPlaceHolder();
    showEventPlaceHolder();
    showWeatherPlaceHolder();
    showLongWeekendPlaceHolder();
    showSunsetPlaceHolder();
    destination.style.display = "none";
    holidayHeader.style.display = "none";
    return;
  }
  destination.style.display = "flex";
  selectDisplay(selected);
  await updateInfo();
  displayHolidays(year.value, selected);
  showEventInfo(city.value, selected);
  showWeather(city.value, selected);
  showLongWeekends(year.value, selected);
  showSunsetTimes(city.value, selected);
});

city.addEventListener("change", async () => {
  await updateInfo();
  showEventInfo(city.value, selectCountry.value);
  showWeather(city.value, selectCountry.value);
  showSunsetTimes(city.value, selectCountry.value);
});

year.addEventListener("change", () => {
  displayHolidays(year.value, selectCountry.value);
  showLongWeekends(year.value, selectCountry.value);
});

// myplans

let clearAllBtn = document.querySelector("#clear-all-plans-btn");
let planFilter = document.querySelectorAll(".plan-filter");
let holidayPlanBtn = document.querySelectorAll(".holiday-icon");
let eventPlanBtn = document.querySelectorAll(".event-icon");
let longWeekendPlanBtn = document.querySelectorAll(".lw-icon");
let plansContent = document.querySelector("#plans-content");

let plansCount = document.querySelector("#plans-count");
let filterAllCount = document.querySelector("#filter-all-count");
let filterHolidayCount = document.querySelector("#filter-holiday-count");
let filterEventCount = document.querySelector("#filter-event-count");
let filterLongWeekendCount = document.querySelector("#filter-lw-count");
let totalFav = document.querySelector("#stat-saved");

let holidayPlans = [];
let eventPlans = [];
let longWeekendPlans = [];
let allPlans = [];

function showNoPlansPlaceHolder() {
  plansContent.innerHTML = `<div class="empty-state">
              <div class="empty-icon"><i class="fa-solid fa-heart-crack"></i></div>
              <h3>No Saved Plans Yet</h3>
              <p>Start exploring and save holidays, events, or long weekends you like!</p>
              <button class="btn-primary" id="start-exploring-btn">
                <i class="fa-solid fa-compass"></i> Start Exploring
              </button>
            </div>`;
  filterHolidayCount.innerHTML = holidayPlans.length;
  filterAllCount.innerHTML = allPlans.length;
  filterEventCount.innerHTML = eventPlans.length;
  filterLongWeekendCount.innerHTML = longWeekendPlans.length;
  plansCount.innerHTML = allPlans.length;
  totalFav.innerHTML = allPlans.length;
  plansCount.classList.add("hidden");

  let startExploring = document.querySelector("#start-exploring-btn");
  startExploring.addEventListener("click", () => {
    showView(dashboardPage, dashboardView);
  });
}

showNoPlansPlaceHolder();

let currentFilter = "all";

function removePlan(planId, planType) {
  allPlans = allPlans.filter((p) => !(p.Id === planId && p.type === planType));

  if (planType === "holiday") {
    holidayPlans = holidayPlans.filter((p) => p.Id !== planId);
  }

  if (planType === "event") {
    eventPlans = eventPlans.filter((p) => p.Id !== planId);
  }

  if (planType === "longWeekend") {
    longWeekendPlans = longWeekendPlans.filter((p) => p.Id !== planId);
  }

  savePlansToLocalStorage();
  updatePlansContent();
}

function savePlansToLocalStorage() {
  localStorage.setItem("holidayPlans", JSON.stringify(holidayPlans));
  localStorage.setItem("eventPlans", JSON.stringify(eventPlans));
  localStorage.setItem("longWeekendPlans", JSON.stringify(longWeekendPlans));
  localStorage.setItem("allPlans", JSON.stringify(allPlans));
}

function loadPlansFromLocalStorage() {
  holidayPlans = JSON.parse(localStorage.getItem("holidayPlans")) || [];
  eventPlans = JSON.parse(localStorage.getItem("eventPlans")) || [];
  longWeekendPlans = JSON.parse(localStorage.getItem("longWeekendPlans")) || [];
  allPlans = JSON.parse(localStorage.getItem("allPlans")) || [];

  if (!allPlans.length || !allPlans) {
    showNoPlansPlaceHolder();
    return;
  }

  plansContent.innerHTML = ``;

  holidayPlans.forEach((plan) => {
    addHolidayToPlans(plan.Id, plan.Title, plan.Name, plan.Date);
    filterHolidayCount.innerHTML = holidayPlans.length;
  });

  eventPlans.forEach((plan) => {
    addEventPlans(plan.Id, plan.Name, plan.Date, plan.Location);
    filterEventCount.innerHTML = eventPlans.length;
  });

  longWeekendPlans.forEach((plan) => {
    addLongWeekendPlans(plan.Id, plan.Days, plan.Date, plan.Extra);
    filterLongWeekendCount.innerHTML = longWeekendPlans.length;
  });
  plansCount.innerHTML = allPlans.length;
  filterAllCount.innerHTML = allPlans.length;
  totalFav.innerHTML = allPlans.length;
  plansCount.classList.remove("hidden");
}

function addHolidayToPlans(id, title, name, date) {
  plansContent.innerHTML += `<div class="plan-card">
              <span class="plan-card-type holiday">Holiday</span>
              <div class="plan-card-content">

                <h4>${title}</h4>
                <div class="plan-card-details">
                  <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-calendar" aria-hidden="true" focusable="false"
                        data-prefix="far" data-icon="calendar" role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512" data-fa-i2svg="">
                        <path fill="currentColor"
                          d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z">
                        </path>
                      </svg></i>${date}</div>
                  <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-circle-info" aria-hidden="true"
                        focusable="false" data-prefix="fas" data-icon="circle-info" role="img"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                        <path fill="currentColor"
                          d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z">
                        </path>
                      </svg></i>${name}</div>
                </div>

                <div class="plan-card-actions">
                  <button class="btn-plan-remove" data-id="${id}" data-type="holiday">
                    <i data-fa-i2svg=""><svg class="svg-inline--fa fa-trash" aria-hidden="true" focusable="false"
                        data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512" data-fa-i2svg="">
                        <path fill="currentColor"
                          d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z">
                        </path>
                      </svg></i> Remove
                  </button>
                </div>
              </div>
            </div>`;
}

function addEventPlans(id, name, date, location) {
  plansContent.innerHTML += `<div class="plan-card">
              <span class="plan-card-type event">Event</span>
              <div class="plan-card-content">

                <h4>${name}</h4>
                <div class="plan-card-details">
                  <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-calendar" aria-hidden="true" focusable="false"
                        data-prefix="far" data-icon="calendar" role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512" data-fa-i2svg="">
                        <path fill="currentColor"
                          d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z">
                        </path>
                      </svg></i>${date}</div>
                  <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-location-dot" aria-hidden="true"
                        focusable="false" data-prefix="fas" data-icon="location-dot" role="img"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg="">
                        <path fill="currentColor"
                          d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z">
                        </path>
                      </svg></i>${location}</div>
                </div>

                <div class="plan-card-actions">
                  <button class="btn-plan-remove" data-id="${id}" data-type="event">
                    <i data-fa-i2svg=""><svg class="svg-inline--fa fa-trash" aria-hidden="true" focusable="false"
                        data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512" data-fa-i2svg="">
                        <path fill="currentColor"
                          d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z">
                        </path>
                      </svg></i> Remove
                  </button>
                </div>
              </div>
            </div>`;
}

function addLongWeekendPlans(id, days, date, extra) {
  plansContent.innerHTML += `<div class="plan-card">
              <span class="plan-card-type longweekend">Long Weekend</span>
              <div class="plan-card-content">

                <h4>${days} Long Weekend</h4>
                <div class="plan-card-details">
                  <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-calendar" aria-hidden="true" focusable="false"
                        data-prefix="far" data-icon="calendar" role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512" data-fa-i2svg="">
                        <path fill="currentColor"
                          d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z">
                        </path>
                      </svg></i>${date}</div>
                  <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-circle-info" aria-hidden="true"
                        focusable="false" data-prefix="fas" data-icon="circle-info" role="img"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                        <path fill="currentColor"
                          d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z">
                        </path>
                      </svg></i>${extra}</div>
                </div>

                <div class="plan-card-actions">
                  <button class="btn-plan-remove" data-id="${id}" data-type="longWeekend">
                    <i data-fa-i2svg=""><svg class="svg-inline--fa fa-trash" aria-hidden="true" focusable="false"
                        data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512" data-fa-i2svg="">
                        <path fill="currentColor"
                          d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z">
                        </path>
                      </svg></i> Remove
                  </button>
                </div>
              </div>
            </div>`;
}

holidayContent.addEventListener("click", (e) => {
  let icon = e.target.closest(".holiday-icon");
  let id = icon.dataset.id;

  let card = icon.closest(".holiday-card");

  let title = card.querySelector(".holiday-card h3").textContent;
  let name = card.querySelector(".holiday-name").textContent;
  let date = card.querySelector(".holiday-date").textContent;
  console.log(`holidayy-${id}`);

  if (holidayPlans.some((plan) => plan.Id === id)) return;

  addHolidayToPlans(id, title, name, date);
  holidayPlans.push({ Id: id, Title: title, Name: name, Date: date });
  allPlans.push({
    type: "holiday",
    Id: id,
    Title: title,
    Name: name,
    Date: date,
  });
  savePlansToLocalStorage();
  loadPlansFromLocalStorage();
});

eventContent.addEventListener("click", (e) => {
  let targetIcon = e.target.closest(".event-icon");
  let id = targetIcon.dataset.id;
  console.log(`event-${id}`);

  let card = targetIcon.closest(".event-card");
  let name = card.querySelector(".event-card-body h3").textContent;
  let date = card.querySelector(".date").textContent;
  let location = card.querySelector(".location").textContent;
  if (eventPlans.some((plan) => plan.Id === id)) return;

  addEventPlans(id, name, date, location);
  eventPlans.push({ Id: id, Name: name, Date: date, Location: location });
  allPlans.push({
    type: "event",
    Id: id,
    Name: name,
    Date: date,
    Location: location,
  });
  savePlansToLocalStorage();
  loadPlansFromLocalStorage();
});

lwContent.addEventListener("click", (e) => {
  let targetIcon = e.target.closest(".lw-icon");
  let id = targetIcon.dataset.id;
  console.log(`lw-${id}`);

  let card = targetIcon.closest(".lw-card");
  let days = card.querySelector(".lw-badge").textContent;
  let date = card.querySelector(".lw-dates").textContent;
  let extra = card.querySelector(".lw-info-box").textContent;

  if (longWeekendPlans.some((plan) => plan.Id == id)) return;

  addEventPlans(id, days, date, extra);
  longWeekendPlans.push({ Id: id, Days: days, Date: date, Extra: extra });
  allPlans.push({
    type: "longWeekend",
    Id: id,
    Days: days,
    Date: date,
    Extra: extra,
  });
  savePlansToLocalStorage();
  loadPlansFromLocalStorage();
});

plansContent.addEventListener("click", (e) => {
  let btn = e.target.closest(".btn-plan-remove");
  if (!btn) return;
  let id = btn.dataset.id;
  let type = btn.dataset.type;

  removePlan(id, type);
});

clearAllBtn.addEventListener("click", () => {
  holidayPlans = [];
  eventPlans = [];
  longWeekendPlans = [];
  allPlans = [];

  savePlansToLocalStorage();
  showNoPlansPlaceHolder();
});

loadPlansFromLocalStorage();

let filters = document.querySelectorAll(".plan-filter");

function showHolidaysInPlans() {
  plansContent.innerHTML = "";
  holidayPlans.forEach((plan) => {
    addHolidayToPlans(plan.Id, plan.Title, plan.Name, plan.Date);
  });
  filterHolidayCount.innerHTML = holidayPlans.length;
  filterAllCount.innerHTML = allPlans.length;
  plansCount.innerHTML = allPlans.length;
  totalFav.innerHTML = allPlans.length;
}
function showEventInPlans() {
  plansContent.innerHTML = "";
  eventPlans.forEach((plan) => {
    addEventPlans(plan.Id, plan.Name, plan.Date, plan.Location);
  });
  filterEventCount.innerHTML = eventPlans.length;
  filterAllCount.innerHTML = allPlans.length;
  plansCount.innerHTML = allPlans.length;
  totalFav.innerHTML = allPlans.length;
}
function showLongWeekendsInPlans() {
  plansContent.innerHTML = "";
  longWeekendPlans.forEach((plan) => {
    addLongWeekendPlans(plan.Id, plan.Days, plan.Date, plan.Extra);
  });
  filterLongWeekendCount.innerHTML = longWeekendPlans.length;
  filterAllCount.innerHTML = allPlans.length;
  plansCount.innerHTML = allPlans.length;
  totalFav.innerHTML = allPlans.length;
}
function resetActive() {
  filters.forEach((filter) => filter.classList.remove("active"));
}
filters.forEach((filter) =>
  filter.addEventListener("click", () => {
    let type = filter.dataset.filter;
    resetActive();
    currentFilter = filter.dataset.filter;

    if (type === "all") {
      loadPlansFromLocalStorage();
    } else if (type === "holiday") {
      showHolidaysInPlans();
    } else if (type === "event") {
      showEventInPlans();
    } else if (type === "longweekend") {
      showLongWeekendsInPlans();
    }
    filter.classList.add("active");
  }),
);

function updatePlansContent() {
  if (currentFilter === "all") {
    loadPlansFromLocalStorage();
  } else if (currentFilter === "holiday") {
    showHolidaysInPlans();
  } else if (currentFilter === "event") {
    showEventInPlans();
  } else if (currentFilter === "longweekend") {
    showLongWeekendsInPlans();
  }
}
