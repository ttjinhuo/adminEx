var _ = require('underscore');

module.exports = {
    param: function(req){
        var params={}, queries=[], query, key;
        var possibles = ["user_id", "supplier_id", "owner_id", "good_id", "cat_id", 
                "spec_id", "tag_id", "order_id", "store_id", "address_id", "coupon_id", "cms_fragment_id", "cms_module_id"];
        for (var i in possibles) {
            key = possibles[i];
            req.params[key] && (params[key] = req.params[key]);
        }
        if (req.query && req.query.q) {
            queries = req.query.q.split(',');
            for (var key in queries) {
                query = queries[key].split(':');
                if(query[0] !== '' && query[1] !== ''){
                    params[query[0]] = query[1];
                }
            }
        }
        return params;
    },

    /**
     * -: 降序排序标记，升序排序标记
     * orderby: -price|sales|create_time
     *
     **/
    parseSort: function(sort){
        if( typeof sort !== 'string') return '';
        var rules = sort.split('|');
        rules = _.map(rules, function(rule){
            if (rule.substr(0, 1) == '-') {
                return rule.substr(1, rule.length) + ' DESC'
            } else {
                return rule + ' ASC'
            }
        })
        return rules.join(', ');
    },

    res: function(error, res, data){
        if (error) {
            res.jsonp({
                code: error.code,
                msg: error.msg
            })
        } else {
            res.jsonp({
                code: 200,
                msg: '',
                data: data
            })
        }
    },

    cloneProps: function(obj, props){
        var clonie = {};
        for(var i=0; i< props.length; i++){
            clonie[props[i]] = obj[props[i]];
        }
        return clonie;
    },
    
    camelize: function(attrs) {
      return _.reduce(attrs, function(memo, val, key) {
        memo[_.str.camelize(key)] = val;
        return memo;
      }, {});
    },

    formatTime: function(time, format) {
        var o = {
        "M+" : time.getMonth()+1, //month
        "d+" : time.getDate(), //day
        "h+" : time.getHours(), //hour
        "m+" : time.getMinutes(), //minute
        "s+" : time.getSeconds(), //second
        "q+" : Math.floor((time.getMonth()+3)/3), //quarter
        "S" : time.getMilliseconds() //millisecond
        }
        if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (time.getFullYear()+"").substr(4- RegExp.$1.length));
        for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
        RegExp.$1.length==1? o[k] :
        ("00"+ o[k]).substr((""+ o[k]).length));
        return format;
    }

}