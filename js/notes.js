const blackScreen = document.querySelector('.notes__black-screen');
const notesClose = document.querySelector('.notes__close');
const noteWindow = document.querySelector('.notes');

const typeNames = ["Спорт", "Пиано", "Рисование"];

blackScreen.addEventListener('click', () => {
    closeNotes();
});

notesClose.addEventListener('click', () => {
    closeNotes();
});

var openNotes = function(day, file) {
    let scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.querySelector(".calendar__section").style.paddingRight = `${scrollBarWidth}px`;

    let noteWindow = document.querySelector('.notes');
    noteWindow.classList = "notes open";

    loadAndParseMarkdown(day, file);
}

var closeNotes = function() {
    document.body.style.overflow = '';
    document.querySelector(".calendar__section").style.paddingRight = '';
    noteWindow.classList = "notes";
}

function loadAndParseMarkdown(day, type) {
    let url = `notes/${day}/${type}.md?v=${lastUpdate}`;
    fetch(url, {
        cache: 'no-cache'
    })
        .then(response => response.text())
        .then(markdownContent => {
            let htmlContent = marked.parse(markdownContent);
            document.querySelector('.notes__text').innerHTML = htmlContent;
            document.querySelector('.notes__header_title').innerHTML = `День ${day} — ${typeNames[type - 1]}`;
        })
        .catch(error => {
            console.error('Ошибка при загрузке файла:', error);
        });
}