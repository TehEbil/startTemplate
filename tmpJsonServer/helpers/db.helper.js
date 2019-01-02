module.exports = {
    maxId(arr) {
        if(Array.isArray(arr) == false) {
            console.log("Not an array, defaults to 0");
            return 0;
        }
        var x = Math.max.apply(this, arr.map(function (o) {
            if(typeof o.id !== "undefined")
                return o.id;
            return -1;
        }));
        return (x == "-Infinity") ? 0 : x;
    },
    
    /**
     * if you use this method, 
     * you can return all all saved datas by the entered object field path
     * @param {string} fieldname 
     */
    getDataByFieldName(db, fieldname) {
        var items = db.get(fieldname).value();
        return items;
    },
    
    getMaxId(db, _dbname, id="id") {
        var x = this.maxId(db.get(_dbname).value());
        return (x) ? x + 1 : 1;
    },
    
    checkIds(fieldName, obj) {
        var items = getDataByFieldName(fieldName);
    
        if (typeof items != 'undefined') 
            return items.filter(item => item.id === obj.id)
    
        return false;
    }
}