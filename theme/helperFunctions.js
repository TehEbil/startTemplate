const helperFuncs = {
    
    maxId: (arr) => {
        var x = Math.max.apply(this, arr.map(function (o) { return o.id; }));
        return (x == "-Infinity") ? 0 : x;
    }
}
export default helperFuncs;
