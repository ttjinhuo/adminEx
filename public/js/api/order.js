define(['api/collection'], function(Collection){
    //var Collection = require('api/collection');

    var Orders = function(api) {
        this.api = api;
        this.collection = 'orders';
    };

    Orders.prototype = new Collection();

    return Orders;
})