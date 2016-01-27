define(['jquery', 'swig', 'bootstrap', 'ckeditor', 'datetimepicker', 'api/index'], function($, swig, bootstrap, CKEDITOR, datetimepicker, API) {
    var tpl = '<div class="modal fade {{klass}}" id="{{id}}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
                <div class="modal-dialog" style="width: 900px;">\
                    <div class="modal-content">\
                        <div class="modal-header">\
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                            <h4 class="modal-title">{{title}}</h4>\
                        </div>\
                        <div class="modal-body">{{content}}</div>\
                        <div class="modal-footer">\
                            <button data-dismiss="modal" type="button" class="btn btn-info" tt-click="saveFragment">保存</button>\
                            <button type="button" class="btn btn-default" tt-click="hideDialog">取消</button>\
                        </div>\
                    </div>\
                </div>\
            </div>';

    var ckeditors = [];

    var Editor = function(propDef, opt){
        this.opt = opt || {};
        this.moduleId = opt.moduleId;
        this.propDef = propDef || {};
        this.id = 'dialog-' + Math.ceil(Math.random()*100000);
        this.__bindEvents();
    }

    var editor = function(prop, fragment){
        var html = '', val = (fragment) ? fragment[prop.key] : '';
        html = '<div class="form-group" data-key="' + prop.key +'">\
                    <label class="col-md-2 col-sm-2 control-label">' + prop.label + '</label>\
                    <div class="col-md-9">\
                        <div class="iconic-input">';
        switch(prop.type) {
            case 'number':
            case 'text': 
                html += '<input type="text" class="form-control" placeholder="' + prop.label +'" value="' + val +'">';
                break;
            case 'mtext': 
                ckeditors.push("ckeditor-" + prop.key);
                val = decodeURIComponent(val);
                html += '<textarea class="form-control ckeditor" name="ckeditor-'+ prop.key + '" rows="3">' + val + '</textarea>';
                break;
            case 'link':
                 html += '<input type="text" class="form-control" placeholder="' + prop.label +'" value="' + val +'">';
                break;
            case 'image':
                 html += '<input type="text" class="form-control" placeholder="' + prop.label +'" value="' + val +'">';
                break;
            case 'boolean':
                html += '<input type="checkbox"' + (val? 'checked': '') +'></input>';
                break;
            case 'date':
                html += '<input size="16" type="text" value="' + val + '" readonly="" class="form_datetime form-control">';
                break;
            default:
                html += '<input type="text" class="form-control" placeholder="' + prop.label +'" value="' + val +'">';
                break;
        }
        html += '</div></div></div>';
        return html;
    };

    var setPropValue = function(prop, val){
        var item = $('.form-group[data-key=' + prop.key + ']');
        switch(prop.type) {
            case 'number':
            case 'text': 
            case 'link':
            case 'image':
            case 'boolean':
            case 'date':
                item.find('input').val(val);
                break;
            case 'mtext': 
                var rawHTML = decodeURIComponent(val);
                CKEDITOR.instances["ckeditor-" + prop.key] 
                    && CKEDITOR.instances["ckeditor-" + prop.key].setData(rawHTML);
                break;
            default:
                item.find('input').val(val);
                break;
        }
    };

    var getPropValue = function(prop){
        var val, item = $('.form-group[data-key=' + prop.key + ']');
        switch(prop.type) {
            case 'number':
            case 'text': 
                val = item.find('input').val();
                break;
            case 'mtext': 
                rawHTML = CKEDITOR.instances["ckeditor-" + prop.key] 
                            && CKEDITOR.instances["ckeditor-" + prop.key].getData();
                val = encodeURIComponent(rawHTML);
                break;
            case 'link':
                val = item.find('input').val();
                break;
            case 'image':
                val = item.find('input').val();
                break;
            case 'boolean':
                val = item.find('checkbox').val();
                break;
            case 'date':
                val = item.find('input').val();
                break;
            default:
                val = item.find('input').val();
                break;
        }
        return val;
    };

    //加载所需的css文件
    var loadCss = function (){
        $("head").append("<link rel='stylesheet' type='text/css' href='/lib/bootstrap-datetimepicker/css/datetimepicker-custom.css' />");
    }


    Editor.prototype = {
        build: function(fragment){
            var html = '', ele = '';
            html = '<form class="form-horizontal" role="form">';
            for(var i=0; i< this.propDef.length; i++){
                ele = editor(this.propDef[i], fragment);
                html += ele
            }
            html += '</form>';
            return html;
        },

        //渲染
        show: function(fragment){
            var self = this;

            //判断是否是编辑Fragment还是新建Fragment
            self.isEdit = !!fragment;
            if(self.isEdit) {
                self.fragmentId = fragment.id;
            }

            if( $('#'+ this.id).length > 0){
                //根据fragment进行赋值
                if (self.isEdit) {
                    for(var i=0; i< self.propDef.length; i++){
                        setPropValue(self.propDef[i], fragment[self.propDef[i].key]);
                    }
                } else {
                    //清除已有内容
                    for(var i=0; i< self.propDef.length; i++){
                        setPropValue(self.propDef[i], '');
                    }
                }

                $('#'+ this.id).modal('show');
            } else {
                loadCss();
                var data = {
                    id: this.id,
                    title: fragment ? '编辑项目': '新增项目',
                    content: ''
                };



                var dialog = swig.render(tpl, {locals: data});
                if( $('#'+this.id).length == 0){
                    $('body').append(dialog);
                } 

                $('#'+this.id).find('.modal-body').html(this.build(fragment));
                //初始化编辑器实例
                for(var i=0; i< ckeditors.length; i++){
                    if (CKEDITOR.instances[ckeditors[i]]) {
                        CKEDITOR.instances[ckeditors[i]].destroy();
                    }
                    CKEDITOR.replace(ckeditors[i]);
                }
                //初始化datetime picker
                //$(".form_datetime").datetimepicker({format: 'yyyy-mm-dd hh:ii'});

                $('#'+this.id).modal(this.opt);

            }
            return this;
        },

        hide: function(){
            $('#'+this.id).modal('hide');
        },

        hideDialog: function(e, self){
            self.hide();
        },

        saveFragment: function(e, self){
            var fragment = {}, index = $(this).index();
            for(var i=0; i< self.propDef.length; i++){
                fragment[self.propDef[i].key] = getPropValue(self.propDef[i]);
            }
            // console.log(fragment);
            fragment['cms_module_id'] = self.moduleId;
            if(self.isEdit) {
                api.fragments.update(self.fragmentId, {fragment: fragment}, function(json){
                    //console.log(json)
                    if(json && json.data) {
                        window.location.reload();
                    }
                });
            } else {
                api.fragments.create({fragment: fragment}, function(json){
                    if(json && json.data) {
                        window.location.reload();
                    }
                });
            }
            
            e.preventDefault();

        },

        //绑定事件
        __bindEvents: function(){
            var self = this;
            $(document).on('click', '[tt-click]', function(e){
                var handler = $(this).attr('tt-click');
                if(self[handler] && typeof self[handler] == 'function') {
                    self[handler].call(this, e, self);
                }
            });
        },

        //销毁
        destory: function(){
            $('#'+this.id).remove();
            for(var i=0; i< ckeditors.length; i++){
                if (CKEDITOR.instances[ckeditors[i]]) {
                    CKEDITOR.instances[ckeditors[i]].destroy();
                }
            }
        }
    }




    return Editor;
})