define(['jquery', 'swig', 'ckeditor', 'app/pager', 'fileupload', 'comp/dialog/index', 'app/base', 'api/index'], 
    function ($, swig, CKEDITOR,Pager, upload, Dialog, BaseController, API) {
    var jQuery = $;
    //console.log(CKEDITOR)
    var supplierId = parseInt(window.location.pathname.split('/')[2]);
    api = new API('http://api.ttjinhuo.com/api', {});

    var tobeDeleteSupplierId = '';

    //初始化模块控制器
    var SupplierController = function(){

    }

    var _p = SupplierController.prototype = new BaseController();

    _p.initDetail = function(){
        var self = this;
        api.stores.get(supplierId, {'inline-relation-depth': 1}, function(json){
            if(json && json.code == 200 && json.data && json.data) {
                self.$scope.supplier = json.data;
                self.apply();
            }
        })
    }

    _p.initEdit = function(){
        var self = this;
        $(document).trigger('nav.change', 'supplier.new');
        self.initUploader();
        supplierId && api.stores.get(supplierId, {'inline-relation-depth': 0}, function(json){
            if(json && json.code == 200 && json.data && json.data) {
                self.$scope.supplier = json.data;
                initPortrait('', self.$scope.supplier.logo);
                self.apply();
            }
        })
    }


    //初始化图像信息
    function initPortrait(id, imageurl) {
        //重要，需要更新控件的附加参数内容，以及图片初始化显示
        $("#supplierLogo").fileinput('refresh', {
            uploadExtraData: { id: id, type: 'logo'},
            initialPreview: [
                "<img src='" + imageurl + "' class='file-preview-image' alt='logo' title='logo'>",
            ],
        });
    }

    _p.initUploader = function(){
        var self = this;
        $("#supplierLogo").fileinput({
            uploadUrl: "/cms/upload?type=supplier&dir=supplier",
            overwriteInitial: true,
            maxFileSize: 1500,
            autoReplace: true,
            maxFileCount: 1,
            showClose: false,
            showCaption: false,
            msgErrorClass: 'alert alert-block alert-danger',
            defaultPreviewContent: '<img src="http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=logo" alt="logo" style="width:160px">',
            layoutTemplates: {main2: '{preview} ' + ' {remove} {browse}'},
            allowedFileExtensions: ["jpg", "png", "gif"]
        });
    }

    _p.updateSupplier = function(e, self){
        //var self = this;
        //console.log(self.$scope.user);
        $("#supplierLogo").on("fileuploaded", function(event, data, previewId, index){
            //console.log(event, data);
            var res = data.response;
            if(res && res.data && res.data.path){
                self.$scope.supplier.logo = window.location.origin +  data.response.data.path;
            }
            console.log(self.$scope.supplier);
            self.updateSupplierInfo();
        })
        //上传logo
        $("#supplierLogo").fileinput('upload');
        e.preventDefault();
    }

    _p.updateSupplierInfo= function(){
        var self = this;
        console.log(self.$scope.supplier);

        if(supplierId) {
            //编辑已有供应商信息
            var data = $.extend({}, self.$scope.supplier);

            api.stores.update(supplierId, {store: data}, function(json){
                console.log(json);
                if(json && json.code == 200){
                    alert('更新成功');
                } else {
                    console.log(json.msg);
                }
            });
        } else {
            //新增供应商信息
            var data = $.extend({}, self.$scope.supplier);
            api.stores.create({store: data}, function(json){
                console.log(json);
                if(json && json.code == 200){
                    alert('添加供应商成功');
                } else {
                    console.log(json.msg);
                }
            });

        }
        e.preventDefault();
    }

    //初始化供应商列表页
    _p.initList = function(){
        var self = this;
        self.pager = new Pager({wrapper: $('.pagination ul'), total: 8, page: 2});
        
        self.getSuppliers({}, {page: 1, page_size: 2});
        $(document).trigger('nav.change', 'supplier.list')
        $(document).on('PAGER_CHANGED', function(e, page){
            //console.log(page);
            self.getSuppliers({'inline-relation-depth': 1}, {page: page, page_size: 2});
        })
    }

    //删除Supplier
    _p.deleteSupplierDialog = function(e){
        var self = this;
        tobeDeleteUserId = $(this).parents('tr').data('id');

        var dialog = new Dialog({
            title: '删除用户',
            content:  '确定要删除该供应商吗? 删除后将无法恢复.',
            btns: [
                {klass: 'btn-danger', text: '确定', callback: function(){
                    this.hide();
                    _p.deleteUser();
                }},
                {klass: 'btn-default',text: '取消', callback: null, dismiss: true}
            ]
        });
        dialog.show();
    }

    _p.deleteSupplier = function(){
        tobeDeleteSupplierId && api.stores.del(tobeDeleteSupplierId, function(json){
            console.log(json);
            if(json && json.code == 200){
                alert('删除供应商成功');
            } else {
                console.log(json.msg);
            }
        });
    }

    //获取用户列表
    _p.getSuppliers = function(query, filter){
        var self = this;
        api.stores.list({queries: query, filters: filter}, function(json){
            //console.log(json.data)
            if(json && json.code == 200 && json.data && json.data.data) {
                self.$scope.suppliers = json.data.data;
                self.page = json.data.currentPage;
                self.total = json.data.pages.length;
                //self.$scope.pages = json.data.pages;
                self.apply();
                self.pager.render(self.page , self.total);
            }
        })
    }

    return (new SupplierController());

})