// Получение текущей даты по моему часовому поясу (неа, я не из ЕКБ he-he)
var today = new Date();
async function getTime() {
    try {
        const response = await fetch('http://worldtimeapi.org/api/timezone/Asia/Yekaterinburg');
        const data = await response.json();
        const datetime = data.datetime;
        today = new Date(datetime);
    } catch (error) {
        console.error('Ошибка при получении времени:', error);
    }
}

// Текстовая инфа
const dayName = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const monthName = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

const template = document.querySelector('.for-generator .calendar__item');
const empty = document.querySelector('.for-generator .calendar__empty-item');
const container = document.getElementById('c-cont');

// Базовые настройки
var startDay = 1;
var startMonth = 0;
var startYear = 2025;

var daysData;
var loadConfigs = function() {
    let url = 'config.json?v=' + new Date().getTime();
    return new Promise((resolve, reject) => {
        fetch(url, {
            cache: 'no-cache' // Отключаем кэширование
        })
            .then(response => response.json())
            .then(data => {
                startDay = data.config.startDay;
                startMonth = data.config.startMonth;
                startYear = data.config.startYear;

                currentDay = startDay;
                currentMonth = startMonth;
                currentYear = startYear;

                daysData = data.days;
                
                resolve(); // Завершаем Promise, когда данные загружены
            })
            .catch(error => {
                console.error('Ошибка при загрузке файла:', error);
                reject(error); // Ожидаем обработку ошибки
            });
    });
}

var currentDay = startDay;
var currentMonth = startMonth;
var currentYear = startYear;
var generateNewItem = function (index) {
    let maxDayInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    let currentDate = new Date(currentYear, currentMonth, currentDay);

    let itemCount = template.querySelector('.calendar__item_info-count');
    let itemDate = template.querySelector('.calendar__item_info-date');

    let spans = itemDate.querySelectorAll('span');
    spans[0].textContent = dayName[currentDate.getDay()];
    spans[1].textContent = currentDay + ' ' + monthName[currentMonth];
    itemCount.textContent = '#' + index;

    let buttons = template.querySelectorAll('.calendar__button');
    buttons.forEach((button, i) => {
        button.setAttribute('c-day', index);
        button.setAttribute('c-btn', i + 1);
    }); 

    if ((currentDay > today.getDate()) || (currentMonth != today.getMonth())) template.classList = "calendar__item disabled";

    currentDay++;
    if (currentDay > maxDayInMonth) {
        currentDay = 1;
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
    }
}

var correctSpace = function() {
    let startDate = new Date(startYear, startMonth, startDay);
    let calendarStart = (startDate.getDay() + 6) % 7 + 1;
    container.querySelector('div').style = "grid-column-start: " + calendarStart + ";";
    
    let cloneBefore = empty.cloneNode(true);
    cloneBefore.style = "grid-column: span " + (calendarStart - 1) + ";"
    
    let cloneAfter = empty.cloneNode(true);
    cloneAfter.style = "grid-column: span " + (6 - calendarStart) + ";"
    
    if(calendarStart > 1) container.insertBefore(cloneBefore, container.firstChild);
    if(calendarStart < 6) container.appendChild(cloneAfter);
}

var updateAllStates = function() {
    let states = container.querySelectorAll(".calendar__item_buttons");
    console.log(states);
    for (let i = 0; i < states.length; i++) {
        let btns = states[i].querySelectorAll(".calendar__button_cont-status");
        let s1 = (daysData[i][0]) ? "complete" : "incomplete";
        let s2 = (daysData[i][1]) ? "complete" : "incomplete";
        let s3 = (daysData[i][2]) ? "complete" : "incomplete";

        btns[0].classList = `calendar__button_cont-status ${s1}`;
        btns[1].classList = `calendar__button_cont-status ${s2}`;
        btns[2].classList = `calendar__button_cont-status ${s3}`;
    }
}

window.onload = async function() {
    await loadConfigs();
    for (let i = 0; i < 30; i++) {
        generateNewItem(i + 1);
        let clone = template.cloneNode(true);
        container.appendChild(clone);
    }
    correctSpace();
    updateAllStates();
    animationStart();
}