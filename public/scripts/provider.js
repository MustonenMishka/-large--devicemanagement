const arr = [];

$.ajax({
        type: "GET",
        url: "/stations-suggest"
}).done (stations => {
        arr.push(...stations);
});

    find = function (arr, find) {
        return arr.filter(function (value) {
            return (value + "").toLowerCase().indexOf(find.toLowerCase()) != -1;
        });
    };
const provider = {
    suggest: function (request, options) {
        const res = find(arr, request),
            arrayResult = [],
            results = Math.min(options.results, res.length);
        for (let i = 0; i < results; i++) {
            arrayResult.push({displayName: res[i], value: res[i]})
        }
        return ymaps.vow.resolve(arrayResult);
    }
};