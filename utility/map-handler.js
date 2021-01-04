function createMapData(dbData) {
    const total = dbData.length;

    const stationsArr = dbData.map(device => device.station.trim().toLowerCase());
    const stationsSet = new Set(stationsArr);

    const citiesArr = [];
    for (const device of dbData) {
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
        }
    }

    const countriesArr = citiesArr.reduce((acc, val) =>  {
        acc[val.country] = acc[val.country] === undefined ? 1 : acc[val.country]++;
        return acc;
    }, {});

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


    return [stationsSet.size, Object.keys(countriesArr).length, total, yandexMarkersJSON];
}

module.exports = createMapData;