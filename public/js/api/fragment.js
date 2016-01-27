define(['api/collection'], function(Collection){
    //var Collection = require('api/collection');

    var Fragments = function(api) {
        this.api = api;
        this.collection = 'fragments';
    };

    Fragments.prototype = new Collection();

    return Fragments;
})