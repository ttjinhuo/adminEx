define([], function(){

    /**
     * 
     * var rule = {
     *   name: [{type: 'string'}, {length: [5, 9]}, {range: [5, 9]}, {re: /^[a-zA-Z]{0,9}$/ }],
     *   role: [{whiteList: ['管理员', '普通用户']}],
     *   brand: [{type: 'string'}, {length: [0, 30]}, {func: function(prop){return false}}],
     * }
     * var goodValidator = new Validator(rule);
     * var e = goodValidator.validate({
     *   name: 'cocokola',
     *   role: '管理员',
     *   brand: 'cocokola'
     * });
     *
     **/
    var Validator = function(rules){
        var _ = this;
        _.rules = rules;
    };



    Validator.prototype = {

        validate: function(model){
            var _ = this, i=0, j=0, rule, prop, type='', e, errors = [];
            var types = ['type', 'length', 'maxLength', 'minLength', 'range', 'max', 'min', 're', 'whiteList', 'func'];

            for(prop in _.rules){
                var rule = _.rules[prop];
                for(i=0; i< _.rule.length; i++){
                    for (var i=0; i< type.length; i++){
                        if( rule && rule[types[i]]) {   
                            type = types[i];
                            break; 
                        }
                    };

                    switch(type){
                        //类型校验
                        case 'type':
                            e = typeValidate.call(_, rule, prop);
                            break;
                        //长度校验
                        case 'length': 
                        case 'maxLength':
                        case 'minLength':
                            e = lengthValidate.call(_, rule, prop);
                            break;
                        //大小校验
                        case 'range': 
                        case 'max':
                        case 'min':
                            e = lengthValidate.call(_, rule, prop);
                            break;
                        //正则校验
                        case 're': 
                            e = regExpValidate.call(_, rule, prop);
                        //白名单
                        case 'whiteList': 
                            e = whiteListValidate.call(_, rule, prop);
                        case 'func': 
                            e = customValidate.call(_, rule, prop);
                            break;
                    }
                    e &&  errors.push(e);
                }
            }

            return errors;

        }
    }

    var getType = function(val){
        return Object.prototype.toString.call(val).toLowerCase();
    }

    //类型校验[Object.prototype.toString.call()] 支持的属性包括: string|numbert|object|array|regexp|functionå
    var typeValidate = function(rule, prop){
        var _ = this,
            val = _.model[prop],
            msg = rule.msg || prop + ' is not ' + rule.type,
            e = ( getType(val).indexof(rule.type) != -1 ) ? 
                    { type: 'typeError',  msg: msg } : null;
        return e;
    }

    //长度校验
    var lengthValidate = function(rule, prop){
        var _ = this, e, 
            val = _.model[prop],
            msg = rule.msg || prop + '\'s length out of range';

        if (rule.length && getType(rule.length).indexof('array') != -1) {
            e = ( rule.length[0] <= val.length && val.length < rule.length[1]) ?  { type: 'lengthError',  msg: msg } : null;
        } 
        if (rule.maxLength && getType(rule.maxLength).indexof('number')) {
            e = ( rule.maxLength < val.length ) ?  { type: 'lengthError',  msg: msg } : null;
        }
        if (rule.minLength && getType(rule.minLength).indexof('number')) {
            e = ( rule.minLength >= val.length ) ?  { type: 'lengthError',  msg: msg } : null;
        }
        return e;
    }

    //范围校验
    var rangeValidate = function(rule, prop){
        var _ = this, e, 
            val = _.model[prop],
            msg = rule.msg || prop + '\'s length out of range';

        if (rule.range && getType(rule.range).indexof('array') != -1) {
            e = ( rule.range[0] <= val && val < rule.range[1]) ?  { type: 'rangeError',  msg: msg } : null;
        }
        if (rule.min && getType(rule.min).indexof('number')) {
            e = ( rule.min >= val ) ?  { type: 'rangeError',  msg: msg } : null;
        }
        if (rule.max && getType(rule.max).indexof('number')) {
            e = ( rule.max < val ) ?  { type: 'rangeError',  msg: msg } : null;
        }
        return e;
    }

    //正则校验
    var regExpValidate = function(rule, prop){
        var _ = this, e, 
            val = _.model[prop],
            msg = rule.msg || prop + ' does not match regexp';

        if (getType(rule.re).indexof('regexp') != -1 ) {
            e = ( rule.re.test(val) ) ?  { type: 'reError',  msg: msg } : null;
        }
        return e;
    }

    //白名单校验
    var whiteListValidate = function(rule, prop){
        var _ = this, e, 
            val = _.model[prop],
            msg = rule.msg || prop + 'invalid property';

        if (getType(rule.whiteList).indexOf('array') != -1 ) {
            e = ( rule.whiteList.indexOf(val) == -1 ) ?  { type: 'whiteListError',  msg: msg } : null;
        }
        return e;
    }

    //自定义校验
    var customValidate = function(rule, prop){
        var _ = this, e, 
            val = _.model[prop],
            msg = rule.msg || prop + ' custom varify error';

        if (getType(rule.func).indexof('function') != -1 ) {
            e = ( rule.func(val) ) ?  { type: 'customError',  msg: msg } : null;
        }
        return e;
    }

    //内部验证规则
    var rules = {
        email: {
            re: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        },
        telephone: {
            re: /d{3}-d{8}|d{4}-d{8}|d{4}-d{7}/
        },
        mobile: {
            re: /^(0|86|17951)?1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|70)\\d{8}$/
        },
        name: {
            re: /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;
        },
        url: {
            re: /((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/
        },
        MAC: {
            re: /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/
        },

        ID: {
            func: function(id){
                var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
                var pass= true;
                
                if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
                    pass = false;
                } else if(!city[code.substr(0,2)]){
                    pass = false;
                } else {
                    //18位身份证需要验证最后一位校验位
                    if(code.length == 18){
                        code = code.split('');
                        //∑(ai×Wi)(mod 11)
                        //加权因子
                        var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                        //校验位
                        var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                        var sum = 0;
                        var ai = 0;
                        var wi = 0;
                        for (var i = 0; i < 17; i++){
                            ai = code[i];
                            wi = factor[i];
                            sum += ai * wi;
                        }
                        var last = parity[sum % 11];
                        //校验位错误
                        if(parity[sum % 11] != code[17]){
                            pass =false;
                        }
                    }
                }
                return pass;
            }
        },

    }

    Validator.prototype.rules = rules;
       

    return Validator;

})