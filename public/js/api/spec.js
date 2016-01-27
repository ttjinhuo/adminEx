define(['api/collection'], function(Collection){
    //var Collection = require('api/collection');

    var Specs = function(api) {
        this.api = api;
        this.collection = 'specs';
    };

    Specs.prototype = new Collection();

    return Specs;
})