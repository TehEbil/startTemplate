const helperFuncs = {
    
    maxId: (arr) => {
        var x = Math.max.apply(this, arr.map(function (o) { return o.id; }));
        return (x == "-Infinity") ? 0 : x;
    },
    
    isSameDate: (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
    },

    generateDate: (d) => {
        let day = ('0' + (d.getDate())).slice(-2);
        let month = ('0' + (d.getMonth() + 1)).slice(-2);
        let year = d.getFullYear();

        return `${year}${month}${day}`;
    }
}

if(typeof module !== "undefined")
    module.exports.helperFuncs = helperFuncs;
