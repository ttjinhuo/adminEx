define(['api/collection', 'api/order', 'api/store'], function(Collection){
    //var Collection = require('api/collection');

    var Users = function(api) {
        this.api = api;
        this.collection = 'users';
    };

    Users.prototype = new Collection();

    //用户订单
    Users.prototype.orders = function (guid) {
        var orders = new Collection();
        orders.api = this.api;
        orders.collection = this.collection + '/' + guid + '/orders';
        return orders;
    };

    //用户商店
    Users.prototype.stores = function (guid) {
        var orders = new Collection();
        orders.api = this.api;
        orders.collection = this.collection + '/' + guid + '/stores';
        return orders;
    };


    //查询购物车
    Users.prototype.getCartDetail = function (userId, options, done) {
        if (typeof options === 'function' && typeof done === 'undefined') {
            done = options;
            options = null;
        }
        options = options || {};
        options.status_code = 200;

        this.api.get('/api/v1/users/' + userId + '/cart', options, function (err, res) {
            if (err) {return done(err);}
            done(null, res.body);
        });
    };

    //更新购物车
    Users.prototype.updateCart = function (userId, data, options, done) {
        if (typeof options === 'function' && typeof done === 'undefined') {
            done = options;
            options = null;
        }
        options = options || {};
        options.data = data;
        options.status_code = 200;

        this.api.put('/api/v1/users/' + userId + '/cart', options, function (err, res) {
            if (err) {return done(err);}
            done(null, res.body);
        });
    };

    //清除购物车
    Users.prototype.emptyCart = function (userId, options, done) {
        if (typeof options === 'function' && typeof done === 'undefined') {
            done = options;
            options = null;
        }
        options = options || {};
        options.status_code = 200;

        this.api.del('/api/v1/users/' + userId + '/cart', options, function (err, res) {
            if (err) {return done(err);}
            done(null, res.body);
        });
    };

    return Users;
})