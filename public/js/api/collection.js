define(function(){
    var api_version_prefix = '/v1/';
    var collection = function() {
        this.paginated = true;
    };

    collection.prototype = {
        makeQueryString: function(options) {
            options = options || {};
            var query = '',
                first_q = true;
            if (options.queries) {
                for(key in options.queries){ 
                    query = query + ((first_q ? '?' : '&') + key + '=' + options.queries[key]);
                    first_q = false;
                };
            }
            if (options.filters) {
                var q = [];
                for(key in options.filters) {
                    q.push(key + ':' + options.filters[key]); 
                };
                query = query + ((first_q ? '?' : '&') + 'q=' + q.join(','));
            }
            return query;
        },
        getCollectionUrl: function() {
            return api_version_prefix + this.collection;
        },
        get: function(resource_identifier, options, done) {
            if (typeof options === 'function' && typeof done === 'undefined') {
                done = options;
                options = null;
            }
            options = options || {};
            options.query = this.makeQueryString(options);
            options.status_code = 200;
            var path = api_version_prefix + this.collection + '/' + resource_identifier;
            this.api.get(path, options, function(err, res) {
                if (err) {
                    return done(err);
                }
                done(null, res.body);
            });
        },
        del: function(resource_identifier, options, done) {
            if (typeof options === 'function' && typeof done === 'undefined') {
                done = options;
                options = null;
            }
            options = options || {};
            options.query = this.makeQueryString(options);
            options.status_codes = [204, 201];
            var path = api_version_prefix + this.collection + '/' + resource_identifier;
            this.api.del(path, options, function(err, res) {
                if (err) {
                    return done(err);
                }
                done(null);
            });
        },
        create: function(data, options, done) {
            if (typeof options === 'function' && typeof done === 'undefined') {
                done = options;
                options = null;
            }
            options = options || {};
            options.data = data;
            options.query = this.makeQueryString(options);
            options.status_codes = [200, 201];
            var path = api_version_prefix + this.collection;
            this.api.post(path, options, function(err, res) {
                if (err) {
                    return done(err, res);
                }
                done(null, res.body);
            });
        },
        update: function(resource_identifier, data, options, done) {
            if (typeof options === 'function' && typeof done === 'undefined') {
                done = options;
                options = null;
            }
            options = options || {};
            options.data = data;
            options.query = this.makeQueryString(options);
            options.status_codes = [200, 201];
            var path = api_version_prefix + this.collection + '/' + resource_identifier;
            this.api.put(path, options, function(err, res) {
                if (err) {
                    return done(err, res);
                }
                done(null, res.body);
            });
        },
        list: function(options, done) {
            if (typeof options === 'function' && typeof done === 'undefined') {
                done = options;
                options = null;
            }
            options = options || {};
            options.query = this.makeQueryString(options);
            options.status_code = 200;
            var self = this,
                path = api_version_prefix + this.collection;
            this.api.get(path, options, function(err, res) {
                if (err) {
                    return done(err);
                }
                done(null, res.body);
            });
        }
    };

    return collection;

})