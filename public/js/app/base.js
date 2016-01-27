define(['jquery', 'lodash', 'swig'], function($, _, swig){
    /**
     *
     * 需要处理的指令包括 tt-controller tt-init tt-bind tt-repeat tt-show tt-src
     *
     *
     **/
    var BaseController = function(name) {
        this.__name = name;
        this.$scope = {};
        this.__tplRegistry = [];
        this.__init();
        this.__bindEvent();
    };

    BaseController.prototype = {
        __init: function(){
            //控制器作用范围html容器 tt-controller tt-init
            this.$scopeHtml = $('[tt-controller]');
            this._initFun = this.$scopeHtml.attr('tt-init');
            if(this[this._initFun] && typeof this[this._initFun] == 'function') {
                this[this._initFun]();
            }
        },
        apply: function(){
            var self = this;
            self.__digest();
        },
        __digest: function(){
            var self = this;

            self.$scopeHtml.find("[tt-model]").each(function(index, item){
                var ele = $(item),
                    type = ele.eq(0).attr('type'),
                    attrs = ele.attr('tt-model'),
                    val = _.get(self.$scope, attrs);

                switch(type){
                    case 'text': 
                    case 'password': 
                    case 'email': 
                        ele.val(val);
                        break;
                    case 'textarea':
                        ele.val(val);
                        break;
                    case 'checkbox': 
                        break;
                    case 'radio': 
                        (ele.val() == val) ? ele.attr("checked",'true') : ele.attr("checked",'false')
                        break;
                    case 'file':
                        break;
                    case 'default':
                        break;
                }
            })

            self.$scopeHtml.find("[tt-bind]").each(function(index, item){
                var ele = $(item),
                    val = $.extend({}, self.$scope),
                    rawAttr = ele.attr('tt-bind').split('|'),
                    attrs = rawAttr[0].split('.'),
                    filter = (rawAttr.length > 2)? rawAttr[1] : '',
                    val = _.get(self.$scope, attrs);

                filter && self[filter] &&  (val = self[filter].call(self, val));
                ele.html(val);
            })

            self.$scopeHtml.find("[tt-src]").each(function(index, item){
                var ele = $(item),
                    val = $.extend({}, self.$scope),
                    attrs = ele.attr('tt-src').split('.');
                for(var i=0; i<attrs.length; i++){
                    val = val[attrs[i]];
                }
                ele.attr('src', val);
            })

            /**
             *  <tbody tt-repeat="good in goods">
             **/
            self.$scopeHtml.find("[tt-repeat]").each(function(index, item){
                var ele = $(item), repeat, tpl, context, html;

                repeatClause = ele.attr('tt-repeat');
                tpl = self.__tplRegistry[index] ? self.__tplRegistry[index]: 
                    '{% for '+ repeatClause + ' %}' + ele.html() + '{% endfor %}';
                context = { locals: self.$scope}
                
                html = swig.render(tpl, context);
                // console.log(tpl, context);
                //添加到模版资源注册表中
                self.__tplRegistry[index] = tpl;
                ele.html(html);
            })

        },
        __bindEvent: function(){
            var self = this;
            self.$scopeHtml.on('click', '[tt-click]', function(e){
                var handler = $(this).attr('tt-click');
                if(self[handler] && typeof self[handler] == 'function') {
                    self[handler].call(this, e, self);
                }
            })

            //监听icheck和input的输入改变事件
            self.$scopeHtml.on('click input', '[tt-model]', function(e){
                var val, ele = $(this),
                    type = ele.eq(0).attr('type'),
                    attrs = ele.attr('tt-model');
                switch(type){
                    case 'text': 
                    case 'password': 
                    case 'email': 
                        val = ele.val();
                        break;
                    case 'textarea':
                        val = ele.val();
                        break;
                    case 'checkbox': 
                        val = (ele.val() == 'on');
                        break;
                    case 'radio': 
                        ele.attr("checked",'true');
                        val = ele.val();
                        break;
                    case 'file':
                        break;
                    case 'default':
                        break;
                }


                _.set(self.$scope, attrs, val);
                //console.log(self.$scope);
                
            })
        }
    }

    return BaseController;
})