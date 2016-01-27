define(['jquery', 'swig', 'bootstrap', 'api/index'], 
        function($, swig, bootstrap, API) {

    var tpl = '<div class="modal fade {{klass}}" id="{{id}}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
                <div class="modal-dialog">\
                    <div class="modal-content">\
                        <div class="modal-header">\
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                            <h4 class="modal-title">选择供应商</h4>\
                        </div>\
                        <div class="modal-body">\
                            <div class="row">\
                                <div class="col-md-12">\
                                    <input type="text" class="form-control search-input" autocomplete="off" placeholder="搜索">\
                                    <select multiple class="col-md-12" style="margin-top: 10px; min-height: 200px;"></select>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="modal-footer">\
                            <button type="button" class="btn btn-info">保存</button>\
                            <button type="button" class="btn btn-default">取消</button>\
                        </div>\
                    </div>\
                </div>\
            </div>';

    var StoreSelector = function(opt){
        var self = this;
        this.opt = opt || {};
        this.wrap = opt.wrap;
        this.data = opt.data;
        this.api = window.api || new API('http://localhost:3000/api', {});
        this.id = 'dialog-' + Math.ceil(Math.random()*100000);
        self.render();

        self.wrap.on('click', function(){
            self.show();
            self.getData('');
        });
        
    }

    StoreSelector.prototype = {
        generateOptions: function(stores){
            var self = this, options = '';
            for(var i=0; i< stores.length; i++){
                options += '<option value=" ' + stores[i].id +'" > ' + stores[i].name+ '</options>'
            }
            $('#' + self.id).find('select').html(options);
        },

        getData: function(keyword){
            var self = this;
            self.api.stores.list({
                queries: {'inline-relation-depth': 0}, 
                filters: {like: keyword, page: 1, page_size: 200}
            }, function(json){
                var stores = (json && json.data && json.data.data) ? json.data.data : [];
                self.generateOptions(stores);
            })
        },

        render: function(){
            var self = this;
            self.wrap.find('input').val(self.data.name );
        },

        //渲染
        show: function(){
            var self = this;
            if( $('#'+ self.id).length > 0){
                $('#'+ self.id).modal('show');
            } else {
                var data = {
                    id: self.id,
                    content: ''
                };

                var dialog = swig.render(tpl, {locals: data});
                $('body').append(dialog);
                $('#'+self.id).modal(self.opt);
                self.__bindEvents();
            }
            return self;
        },

        hide: function(){
            $('#'+this.id).modal('hide');
        },

        //绑定事件
        __bindEvents: function(){
            var self = this;
            $('#'+ self.id).on('input', 'input', function(e){
                self.getData($(this).val())
            });

            $('#'+ self.id).on('click', '.modal-footer button', function(e){
                self.data = {
                    id: $('#' + self.id).find('select').val()[0],
                    name: $('#' + self.id).find('select').find("option:selected").text(),
                }
                if($(this).index() == 0 ){
                    self.render();
                    self.opt.callback && self.opt.callback(self.data);
                }
                self.hide();
            });
        },

        //销毁
        destory: function(){
            $('#'+this.id).remove();
        }
    }

    return StoreSelector;


})
   