define(['api/collection'], function(Collection){
    //var Collection = require('api/collection');

    var Goods = function(api) {
        this.api = api;
        this.collection = 'goods';
    };

    Goods.prototype = new Collection();

    return Goods;
})