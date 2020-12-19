ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map('map', {
            center: [60.0, 75.0],
            zoom: 0,
            controls: [],
        }, {
            restrictMapArea: [[-10, -40], [80, 220]],
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