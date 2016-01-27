define(['jquery', 'swig', 'bootstrap'], function($, swig, bootstrap) {
    var tpl = '<div class="modal fade {{klass}}" id="{{id}}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
                <div class="modal-dialog">\
                    <div class="modal-content">\
                        <div class="modal-header">\
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                            <h4 class="modal-title">{{title}}</h4>\
                        </div>\
                        <div class="modal-body">{{content}}</div>\
                        <div class="modal-footer">\
                            {% for btn in btns%}\
                            <button  {% if btn.dismiss %} data-dismiss="modal" {% endif %} type="button" class="btn {{btn.klass}}">{{btn.text}}</button>\
                            {% endfor %}\
                        </div>\
                    </div>\
                </div>\
            </div>';

    var defaults = {
        title: '',
        klass: '',
        content: '',
        btns: [
            {klass: 'btn-danger', text: '确定', callback: null},
            {klass: 'btn-default',text: '取消', callback: null, dismiss: true}
        ]
    }

    var Dialog = function(data, opt){
        this.opt = opt || {};
        this.data = $.extend(defaults, data);
        !this.data.id && (this.data.id = 'dialog-' + Math.ceil(Math.random()*100000) );
        this.id = this.data.id;
        this.__bindEvents();
    }


    Dialog.prototype = {
        //渲染
        render: function(data){
            this.data = $.extend(defaults, data);
            var dialog = swig.render(tpl, {locals: this.data});
            $('#'+this.id) && $('#'+this.id).length > 0 && $('#'+this.id).remove()
            $('body').append(dialog);
            return this;
        },

        //展示
        show: function(data){
            this.render(data);
            $('#'+this.id).modal(this.opt);
            return this;
        },

        hide: function(){
            $('#'+this.id).modal('hide');
        },

        //绑定事件
        __bindEvents: function(){
            var self = this;
            $(document).on('click', '#'+self.id +' .modal-footer .btn', function(e){
                var index = $(this).index();
                if (self.data && self.data.btns && self.data.btns[index]) {
                    //self.data.btns[index].dismiss && $('#'+self.id).modal({show: false});
                    self.data.btns[index].callback && self.data.btns[index].callback.call(self, e);
                }
            })
        },

        //销毁
        destory: function(){

        }
    }




    return Dialog;
})