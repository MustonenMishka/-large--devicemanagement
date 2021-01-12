function createMapData(dbData) {
    const totalNum = dbData.length;

    const stationsArr = dbData.map(device => {
        return {
            station: device.station.trim().toLowerCase(),
            lat: device.coords.lat,
            lng: device.coords.lng
        }
    });
    const uniqueStationsArr = [];
    stationsArr.forEach(station => {
        if (!uniqueStationsArr.find(some =>
            some.station === station.station &&
            some.lat === station.lat &&
            some.lng === station.lng )) {
            uniqueStationsArr.push(station)
        }
    });  // Forming array of unique (location+name) stations
    const stationsNum = uniqueStationsArr.length;

    const citiesArr = [];
    dbData.forEach( device => {
        const match = citiesArr.find( some => some.lat===device.coords.lat && some.lng===device.coords.lng);
        const typeDesc = device.type.props[0] ? `${device.type.name}-${device.type.props[0].propvalue}` : device.type.name;
        if (match) {
            if (typeDesc in match.types) {
                match.types[typeDesc]++
            } else {
                match.types[typeDesc] = 1;
            }
        } else {
            citiesArr.push({
                lat: device.coords.lat,
                lng: device.coords.lng,
                city: device.city,
                country: device.country,
                types: {
                    [typeDesc]: 1
                }
            })
        } // Forming array for Map-Markers (unique lat+lng)
    })
    const yandexMarkers = {
        type: "FeatureCollection",
        features: [],
    };
    let yandexMarkersJSON = '';
    citiesArr.forEach((marker, idx) => {
        const objDescription = Object.entries(marker.types).reduce((list, [type, count]) => {
            return (list + `<p>${type}: ${count}</p>`)}, '');
        yandexMarkers.features.push({
            type: "Feature",
            id: idx,
            geometry: {type: "Point", coordinates: [marker.lat, marker.lng]},
            properties: {
                balloonContentHeader: `<p><b>${marker.city}</b></p><hr>`,
                balloonContentBody: objDescription,
            }});
        yandexMarkersJSON = JSON.stringify(yandexMarkers);
    });

    const countriesArr = citiesArr.reduce((acc, val) =>  { // Array of unique countries
        acc[val.country] = acc[val.country] === undefined ? 1 : acc[val.country]++;
        return acc;
    }, {});
    const countriesNum = Object.keys(countriesArr).length;


    return [stationsNum, countriesNum, totalNum, yandexMarkersJSON]; // Numbers for headings and markers for map
}

module.exports = createMapData;