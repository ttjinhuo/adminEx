define(['api/collection'], function(Collection){
    //var Collection = require('api/collection');

    var Addresses = function(api) {
        this.api = api;
        this.collection = 'addresses';
    };

    Addresses.prototype = new Collection();

    return Addresses;
})