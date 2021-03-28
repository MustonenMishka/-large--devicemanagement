// Adding popovers with WhoAdded and WhenAdded by clicking on row

$(function () {
    $('[data-toggle="popover"]').popover();
    $('#device-table').on('all.bs.table', function (e, name, args) {   // Refreshing popovers after table sorts
        $('[data-toggle="popover"]').popover();
    });
});

// Suggest logic for AddDeviceToStation input
const stationInput = document.getElementById('station-suggest');
const companySelectEl = document.getElementById('company-suggest');
stationInput.addEventListener('focus', clearCompanySelector);

ymaps.ready(init);
function init() {
    // Задаем собственный провайдер поисковых подсказок и максимальное количество результатов.
    let suggestStations = new ymaps.SuggestView('station-suggest', {provider: provider, results: 3});
    // когда нажимаем на один из вариантов, отправляется запрос на сервер и в поле выбора появляются варианты компаний по данному объекту
    suggestStations.events.add("select", function(e){
        let selectedStation = e.get('item').value;
        addCompanySuggest(selectedStation);
    })
}

function addCompanySuggest(station) {
    $.ajax({
        type: "GET",
        url: `/company-suggest/${encodeURIComponent(station)}`
    }).done (companies => {
        fillCompanySelector(companies) // наполняем селектор опциями - компаниями, найденными в базе
    });
}
function fillCompanySelector(optionsArr) {
    optionsArr.forEach(option => {
        let nonQuotedOption = option.replace(/"/g, "&quot;");
        companySelectEl.innerHTML += `<option value="${nonQuotedOption}">${option}</option>`
    });
    companySelectEl.firstElementChild.setAttribute('selected', true);
}
function clearCompanySelector() { // очищаем селектор перед новым поиском
    companySelectEl.innerHTML = '';
}
