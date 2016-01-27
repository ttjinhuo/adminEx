define(['api/collection'], function(Collection){
    //var Collection = require('api/collection');

    var Cats = function(api) {
        this.api = api;
        this.collection = 'cats';
    };

    Cats.prototype = new Collection();

    return Cats;
})