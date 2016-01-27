define(['api/collection'], function(Collection){
    //var Collection = require('api/collection');

    var Coupons = function(api) {
        this.api = api;
        this.collection = 'coupons';
    };

    Coupons.prototype = new Collection();

    return Coupons;
})