// MAP BUILDING LOGIC

ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map('map', {
            center: [0, 0],
            zoom: 0,
            controls: [],
        }, {
            restrictMapArea: [[-30, -70], [80, 280]],
            searchControlProvider: 'yandex#search'
        }),
        objectManager = new ymaps.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.
            clusterize: true,
            // ObjectManager принимает те же опции, что и кластеризатор.
            gridSize: 32,
            clusterDisableClickZoom: true
        });

    // Чтобы задать опции одиночным объектам и кластерам,
    // обратимся к дочерним коллекциям ObjectManager.
    objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    myMap.geoObjects.add(objectManager);

    $.ajax({
        url: "scripts/map-data.json"
    }).done(function(data) {
        objectManager.add(data);
    });

}

// MAP FILTERING CHECKBOX LOGIC

initCheckboxRelations();
let allChecked = true;
document.getElementById("all-checkbox-toggle").addEventListener('click', toggleAllCheckboxes);

function initCheckboxRelations() {
    let typeCount = 0;
    while (document.getElementById(`type-${typeCount}`)) {
        let typeInput = document.getElementById(`type-${typeCount}`);
        typeInput.addEventListener('change', toggleOptions.bind(typeInput, typeCount));
        typeCount++
    }
}

function toggleOptions(typeNum) {
    if (this.checked) {
        let optCount = 0;
        while (document.getElementById(`type-${typeNum}-opt-${optCount}`)) {
            let optionInput = document.getElementById(`type-${typeNum}-opt-${optCount}`);
            optionInput.disabled = false;
            optionInput.checked = true;
            optCount++
        }
    } else {
        let optCount = 0;
        while (document.getElementById(`type-${typeNum}-opt-${optCount}`)) {
            let optionInput = document.getElementById(`type-${typeNum}-opt-${optCount}`);
            optionInput.checked = false;
            optionInput.disabled = true;
            optCount++
        }
    }
}

function toggleAllCheckboxes() {
    let typeCount = 0;
    while (document.getElementById(`type-${typeCount}`)) {
        let typeInput = document.getElementById(`type-${typeCount}`);
        typeInput.checked = !allChecked;
        let event = new Event('change');
        typeInput.dispatchEvent(event);
        typeCount++
    }
    allChecked = !allChecked;
}