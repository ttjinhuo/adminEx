define(['api/collection'], function(Collection){
    //var Collection = require('api/collection');

    var Carts = function(api) {
        this.api = api;
        this.collection = 'carts';
    };

    Carts.prototype = new Collection();

    return Carts;
})