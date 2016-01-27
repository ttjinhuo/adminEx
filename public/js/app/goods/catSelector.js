define(['jquery', 'swig', 'bootstrap', 'api/index'], 
        function($, swig, bootstrap,  API) {

    var tpl = '<div class="modal fade {{klass}}" id="{{id}}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
                <div class="modal-dialog">\
                    <div class="modal-content">\
                        <div class="modal-header">\
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                            <h4 class="modal-title">类目选择器</h4>\
                        </div>\
                        <div class="modal-body">\
                        <div class="form-group">\
                            <label class="col-md-2 col-sm-2 control-label">一级分类</label>\
                            <select id="cats" class="col-md-4"> \
                                {% for cat in cats%}\
                                    <option value="{{cat.id}}" {% if cat.id == data.cat_id%} selected{% endif %}>{{cat.cat_name}}</option>\
                                {% endfor %}\
                            </select>\
                            <label class="col-md-2 col-sm-2 control-label">二级分类</label>\
                            <select id="specs" class="col-md-4"> </select>\
                        </div>\
                        </div>\
                        <div class="modal-footer">\
                            <button type="button" class="btn btn-info">保存</button>\
                            <button type="button" class="btn btn-default">取消</button>\
                        </div>\
                    </div>\
                </div>\
            </div>';

    var CatSelector = function(opt){
        var self = this;

        this.opt = opt || {};
        this.wrap = opt.wrap;
        this.data = opt.data;
        this.api = window.api || new API('http://localhost:3000/api', {});
        this.id = 'dialog-' + Math.ceil(Math.random()*100000);

        self.render();

        self.wrap.on('click', function(){
            self.show();
        });
        
    }

    CatSelector.prototype = {

        generateSpecOptions: function(cat_id){
            var self = this;
            self.specs=[], options = '';
            for(var i=0; i< self.cats.length; i++){
                if(cat_id == self.cats[i].id) {
                    self.specs = self.cats[i].specs;
                    break;
                }
            }
            for(var i=0; i< self.specs.length; i++){
                options += '<option value=" ' + self.specs[i].id +'" > ' + self.specs[i].spec_name+ '</options>'
            }
            return options;
        },

        getData: function(callback){
            var self = this;
            self.api.cats.list({queries: {'inline-relation-depth': 1}, filters: {page: 1, page_size: 200}}, function(json){
                self.cats = (json && json.data) ? json.data : [];
                //self.generateSpecOptions(self.data.cat_id);
                callback(self.cats);
            })
        },

        render: function(){
            var self = this;
            self.wrap.find('input').val(' > ' + self.data.cat_name + '  > ' + self.data.spec_name);
        },

        //渲染
        show: function(){
            var self = this;

            
            if( $('#'+ self.id).length > 0){
                $('#'+ self.id).modal('show');
            } else {
                self.getData(function(cats, specs){
                    var data = {
                        id: self.id,
                        cats: cats,
                        specs: specs,
                        data: self.data
                    };

                    var dialog = swig.render(tpl, {locals: data});
                    $('body').append(dialog);
                    $('#'+self.id).modal(self.opt);
                    $('#specs').html(self.generateSpecOptions(self.data.cat_id));
                    self.__bindEvents();
                });
            }
            return self;
        },

        hide: function(){
            $('#'+this.id).modal('hide');
        },

        //绑定事件
        __bindEvents: function(){
            var self = this;
            $('#'+ self.id).on('click', '.modal-footer button', function(e){
                self.data = {
                    cat_id:  $('#cats').val(),
                    cat_name:$("#cats").find("option:selected").text(),
                    spec_id: $('#specs').val(),
                    spec_name:$("#specs").find("option:selected").text(),
                }
                if($(this).index() == 0 ){
                    self.render();
                    self.opt.callback && self.opt.callback(self.data);
                }
                self.hide();
            });

            $('#cats').on('input', function(e){
                //console.log($(this).val());
                $('#specs').html(self.generateSpecOptions($(this).val()));
            });
        },

        //销毁
        destory: function(){
            $('#'+this.id).remove();
        }
    }

    return CatSelector;


})
   