define(['api/collection'], function(Collection){
    //var Collection = require('api/collection');
    
    var Modules = function(api) {
        this.api = api;
        this.collection = 'modules';
    };

    Modules.prototype = new Collection();

    Modules.prototype.fragments = function(module_id) {
        var modules_fragments_collection = new Collection();
        modules_fragments_collection.api = this.api;
        modules_fragments_collection.collection = this.collection + '/' + module_id + '/fragments';
        return modules_fragments_collection;
    };

    return Modules;
})