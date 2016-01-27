define(['jquery', 'swig', 'ckeditor', 'app/pager', 'fileupload', 'comp/dialog/index', 'app/base','app/modules/propEditor', 'app/modules/FragmentEditor', 'api/index'], 
    function ($, swig, CKEDITOR,Pager, upload, Dialog, BaseController, PropEditor, FragmentEditor, API) {
    var jQuery = $;
    //console.log(CKEDITOR)
    var moduleId = parseInt(window.location.pathname.split('/')[2]);
    window.api = new API('http://api.ttjinhuo.com/api', {});

    var tobeDeleteModuleId = '';
    var tobeDeleteFragmentId = '';

    var propEditor;
    var propDefine;

    var fragmentEditor;


    //初始化模块控制器
    var ModuleController = function(){

    }

    var _p = ModuleController.prototype = new BaseController();

    //初始化模块详情页
    _p.initDetail = function(){
        var self = this;
        $(document).trigger('nav.change', 'cms.list')
        self.pager = new Pager({wrapper: $('.pagination ul'), total: 8, page: 2});

        //获取模块字段含义
        api.modules.get(moduleId, {}, function(json){
            if(json && json.code == 200 && json.data && json.data) {
                self.$scope.module = json.data;
                try {
                    propDefine = JSON.parse(self.$scope.module.ext1); 
                } catch(e){

                }

                propEditor = new PropEditor(propDefine, {wrap: $('#propEditor tbody')});
                fragmentEditor = new FragmentEditor(propDefine, {moduleId: moduleId});
                self.getFragments({}, {page: 1, page_size: 5});
                self.apply();
            }
        })

        
        $(document).on('PAGER_CHANGED', function(e, page){
            self.getFragments({}, {page: page, page_size: 5});
        })
    }

    _p.savePropDefination = function(){
        //console.log(propEditor.getProps());
        var propsDefination = propEditor.getProps();
        api.modules.update(moduleId, {module: {ext1: propsDefination}}, function(json){
            if(json && json.code == 200 && json.data && json.data) {
                console.log('保存成功');
            }
        })
    }
    var fragmentSimpleViewer = function(prop, fragment){
        var html = '';
        switch(prop.type) {
            case 'number':
            case 'text': 
                html = fragment[prop.key];
                break;
            case 'mtext': 
                html = $(decodeURIComponent(fragment[prop.key])).text().slice(0, 36) + '...' ;
                break;
            case 'link':
                html = '<a href="' + fragment[prop.key] + '" target="_blank">' + fragment[prop.key] +'</a>';
                break;
            case 'image':
                html = '<img src="' + fragment[prop.key]+ '" height="50"></img>';
                break;
            case 'boolean':
                html = '<input type="checkbox"' + (fragment[prop.key]? 'checked': '') +'disabled ></input>';
                break;
            default:
                html = fragment[prop.key];
                break;
        }
        return html;
    };

    _p.getFragments = function(query, filter){
        var self = this;
        api.modules.fragments(moduleId).list({}, function(json){
            //console.log(json.data)
            if(json && json.code == 200 && json.data) {
                var fragments = json.data.data;
                self.$scope.fragments = fragments;
                //模块列表头部
                var thead = '', tbody='';
                for(var i=0; i< propDefine.length; i++){
                    thead += '<th>' + propDefine[i].label + '</th>';
                }
                for(var i=0; i< fragments.length; i++){
                    tbody += '<tr data-id="'+ fragments[i].id +'" >';
                    for(var j=0; j< propDefine.length; j++){
                        tbody += '<td>' + fragmentSimpleViewer(propDefine[j], fragments[i]) + '</td>'
                    }
                    tbody += '<td><a href="/modules/{{item.id}}"><i class="fa fa-eye"></i></a>\
                                    <a href="javascript:;" tt-click="editFragment"><i class="fa fa-edit"></i></a>\
                                    <a href="javascript:;" tt-click="deleteFragmentDialog"><i class="fa fa-trash-o"></i></a>\
                                </td></tr>';
                }
               // console.log(tbody)

                thead = '<tr>'+thead + '<th>操作</th></tr>';
                $('#fragmentsList thead').html(thead);
                $('#fragmentsList tbody').html(tbody);

                self.page = json.data.currentPage;
                self.total = json.data.pages.length;
                self.apply();
                self.pager.render(self.page , self.total);
            }
        })
    }

    //编辑项目
    _p.editFragment = function(e, self){
        var row = $(this).parents('tr'), 
            index = row.index(),
            fragment = self.$scope.fragments[index];

        fragmentEditor.show(fragment, true);
    }

    //新建空白项目
    _p.addNewItem = function(){
        fragmentEditor.show();
    }

    //删除fragment
    _p.deleteFragmentDialog = function(e){
        var self = this;
        tobeDeleteFragmentId = $(this).parents('tr').data('id');

        var dialog = new Dialog({
            title: '删除项目',
            content:  '确定要删除该项目吗? 删除后将无法恢复.',
            btns: [
                {klass: 'btn-danger', text: '确定', callback: function(){
                    this.hide();
                    _p.deleteFragment();
                }},
                {klass: 'btn-default',text: '取消', callback: null, dismiss: true}
            ]
        });
        dialog.show();
    }

    _p.deleteFragment = function(){
        tobeDeleteFragmentId && api.fragments.del(tobeDeleteFragmentId, function(json){
            //console.log(json);
            if(json && json.code == 200){
                //alert('删除模块成功');
                window.location.reload();
            } else {
                console.log(json.msg);
            }
        });
    }


    /***************************************  模块新增／编辑  **********/
    _p.initEdit = function(){
        var self = this;
        $(document).trigger('nav.change', 'cms.new')
        moduleId && api.modules.get(moduleId, {'inline-relation-depth': 0}, function(json){
            if(json && json.code == 200 && json.data && json.data) {
                self.$scope.module = json.data;
                self.apply();
            }
        })
    }

    _p.updateModule = function(e, self){
        if(moduleId) {
            //编辑已有模块
            var data = $.extend({}, self.$scope.module);

            api.modules.update(moduleId, {module: data}, function(json){
                //console.log(json);
                if(json && json.code == 200){
                    alert('更新成功');
                } else {
                    console.log(json.msg);
                }
            });
        } else {
            //新增模块
            var data = $.extend({}, self.$scope.module);
            api.modules.create({module: data}, function(json){
                //console.log(json);
                if(json && json.code == 200){
                    alert('添加模块成功');
                } else {
                    console.log(json.msg);
                }
            });

        }
        e.preventDefault();
    }




    /***************************************  模块列表页  **********/

    _p.deleteModuleDialog = function(e){
        var self = this;
        tobeDeleteModuleId = $(this).parents('tr').data('id');

        var dialog = new Dialog({
            title: '删除模块',
            content:  '确定要删除该模块吗? 删除后将无法恢复.',
            btns: [
                {klass: 'btn-danger', text: '确定', callback: function(){
                    this.hide();
                    _p.deleteModule();
                }},
                {klass: 'btn-default',text: '取消', callback: null, dismiss: true}
            ]
        });
        dialog.show();
    }

    _p.deleteModule = function(){
        tobeDeleteModuleId && api.modules.del(tobeDeleteModuleId, function(json){
            //console.log(json);
            if(json && json.code == 200){
                //alert('删除模块成功');
            } else {
                console.log(json.msg);
            }
        });
    }

    _p.getModules = function(query, filter){
        var self = this;
        api.modules.list({queries: query, filters: filter}, function(json){
            console.log(json.data)
            if(json && json.code == 200 && json.data && json.data.data) {
                self.$scope.modules = json.data.data;
                self.page = json.data.currentPage;
                self.total = json.data.pages.length;
                self.apply();
                self.pager.render(self.page , self.total);
            }
        })
    }

    //初始化模块列表页
    _p.initList = function(){
        var self = this;
        $(document).trigger('nav.change', 'cms.list')
        self.pager = new Pager({wrapper: $('.pagination ul'), total: 8, page: 2});
        self.getModules({}, {page: 1, page_size: 5});
        $(document).on('PAGER_CHANGED', function(e, page){
            self.getModules({'inline-relation-depth': 1}, {page: page, page_size: 5});
        })
    }

    return new ModuleController();

})