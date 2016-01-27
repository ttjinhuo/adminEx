//var extras = require('swig-extras');
module.exports = function(path, data, cb) {
    /* Swig Renderer */
    var swig = require('swig');
    // 保证我们在开发环境下每次更改swig不用重启
    if (data.settings.env === 'development') {
        swig.setDefaults({
            cache: false
        });
    }
    /*
     * 绑定一些常用路径
     * Thanks to: https://github.com/mahdaen/sails-views-swig
     * */
    var prefix = (data.settings.env === 'development')? '/': 'http://ttjinhuo.com/'
    var paths = {
        script: prefix + 'js',
        style: prefix + 'css',
        image: prefix + 'images',
        font:  prefix + 'fonts',
        icon: prefix + 'icons',
        lib:  prefix + 'js/lib'
    };
    if (!data.path) {
        data.path = paths;
    } else {
        for (var key in paths) {
            if (!key in data.path) {
                data.path[key] = paths[key];
            }
        }
    }
    // 补充extra
    // extras.useFilter(swig, 'split');
    /* Render Templates */
    return swig.renderFile(path, data, cb);
};