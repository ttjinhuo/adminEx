define(['jquery', 'swig', 'ckeditor', 'app/pager', 'fileupload', 'comp/dialog/index', 'app/base', 'api/index'], 
    function ($, swig, CKEDITOR,Pager, upload, Dialog, BaseController, API) {
    var jQuery = $;
    //console.log(CKEDITOR)
    var userId = parseInt(window.location.pathname.split('/')[2]);
    api = new API('http://api.ttjinhuo.com/api', {});

    var roleMap = ['','管理员', '普通用户', '供应商'];
    var tobeDeleteUserId = '';

    //初始化模块控制器
    var UserController = function(){
        $(document).trigger('nav.change', 'user.list')
    }

    var _p = UserController.prototype = new BaseController();

    _p.initDetail = function(){
        var self = this;
        api.users.get(userId, {'inline-relation-depth': 1}, function(json){
            if(json && json.code == 200 && json.data && json.data) {
                self.$scope.user = json.data;
                self.$scope.user.roleName = roleMap[self.$scope.user.role];
                //console.log(self.$scope.user);
                self.apply();
            }
        })
    }

    _p.initEdit = function(){
        var self = this;
        self.uploader = $("#avatar");
        self.initUploader();
        userId && api.users.get(userId, {'inline-relation-depth': 0}, function(json){
            if(json && json.code == 200 && json.data && json.data) {
                self.$scope.user = json.data;
                self.$scope.user.roleName = roleMap[self.$scope.user.role];
                //self.$scope.user.avatar = 'http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=avatar';
                //console.log(self.$scope.user);
                initPortrait(userId, self.$scope.user.avatar)
                self.apply();
            }
        })
    }

    //初始化图像信息
    function initPortrait(id, imageurl) {
        //重要，需要更新控件的附加参数内容，以及图片初始化显示
        $("#avatar").fileinput('refresh', {
            uploadExtraData: { id: id, type: '用户头像'},
            initialPreview: [
                "<img src='" + imageurl + "' class='file-preview-image' alt='用户头像' title='用户头像'>",
            ],
        });
    }

    _p.initUploader = function(){
        var self = this;
        $("#avatar").fileinput({
            uploadUrl: "/cms/upload?type=user&dir=avatar",
            overwriteInitial: true,
            maxFileSize: 1500,
            autoReplace: true,
            maxFileCount: 1,
            showClose: false,
            showCaption: false,
            msgErrorClass: 'alert alert-block alert-danger',
            defaultPreviewContent: '<img src="http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=avatar" alt="头像" style="width:160px">',
            layoutTemplates: {main2: '{preview} ' + ' {remove} {browse}'},
            allowedFileExtensions: ["jpg", "png", "gif"]
        });
    }

    _p.updateUser = function(e, self){
        //var self = this;
        //console.log(self.$scope.user);
        $("#avatar").on("fileuploaded", function(event, data, previewId, index){
            //console.log(event, data);
            var res = data.response;
            if(res && res.data && res.data.path){
                self.$scope.user.avatar = window.location.origin +  data.response.data.path;
            }
            console.log(self.$scope.user);
            self.updateUserInfo();
        })
        //上传头像
        $("#avatar").fileinput('upload');
        e.preventDefault();
    }

    _p.updateUserInfo = function(){
        var self = this;
        if(userId) {
            //编辑已有用户信息
            var data = $.extend({}, self.$scope.user);

            api.users.update(userId, {user: data}, function(json){
                console.log(json);
                if(json && json.code == 200){
                    alert('更新成功');
                } else {
                    console.log(json.msg);
                }
            });
        } else {
            //新增用户信息
            var data = $.extend({}, self.$scope.user);
            api.users.create({user: data}, function(json){
                console.log(json);
                if(json && json.code == 200){
                    alert('添加用户成功');
                    var uid = json.data.id;
                } else {
                    console.log(json.msg);
                }
            });

        }
    }

    //初始化用户列表页
    _p.initList = function(){
        var self = this;
        self.pager = new Pager({wrapper: $('.pagination ul'), total: 8, page: 2});
        
        self.getUsers({}, {page: 1, page_size: 2});

        $(document).on('PAGER_CHANGED', function(e, page){
            //console.log(page);
            self.getUsers({'inline-relation-depth': 1}, {page: page, page_size: 2});
        })
    }

    //删除用户
    _p.deleteUserDialog = function(e){
        var self = this;
        tobeDeleteUserId = $(this).parents('tr').data('id');

        var dialog = new Dialog({
            title: '删除用户',
            content:  '确定要删除该用户吗? 删除后将无法恢复.',
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

    _p.deleteUser = function(){
        tobeDeleteUserId && api.users.del(tobeDeleteUserId, function(json){
            console.log(json);
            if(json && json.code == 200){
                alert('删除用户成功');
            } else {
                console.log(json.msg);
            }
        });
    }

    //获取用户列表
    _p.getUsers = function(query, filter){
        var self = this;
        api.users.list({queries: query, filters: filter}, function(json){
            //console.log(json.data)
            if(json && json.code == 200 && json.data && json.data.data) {
                self.$scope.users = json.data.data;
                self.page = json.data.currentPage;
                self.total = json.data.pages.length;
                //self.$scope.pages = json.data.pages;
                self.apply();
                self.pager.render(self.page , self.total);
            }
        })
    }

    return (new UserController());

})