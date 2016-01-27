define(['api/collection', 'api/good'], function(Collection){
    //var Collection = require('api/collection');

    var Stores = function(api) {
        this.api = api;
        this.collection = 'stores';
    };

    Stores.prototype = new Collection();

    //商店商品
    Stores.prototype.goods = function (store_id) {
        var goods = new Collection();
        goods.api = this.api;
        goods.collection = this.collection + '/' + store_id + '/goods';
        return goods;
    };

    return Stores;
})