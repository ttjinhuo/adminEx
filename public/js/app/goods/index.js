define(['jquery', 'swig', 'ckeditor', 'app/pager', 'fileupload', 'comp/dialog/index', 'app/goods/catSelector', 'app/goods/storeSelector', 'app/base', 'api/index'], 
        function ($, swig, CKEDITOR,Pager, upload, Dialog, CatSelector, StoreSelector, BaseController, API) {
    var jQuery = $;
    //console.log(CKEDITOR)
    var goodId = parseInt(window.location.pathname.split('/')[2]);
    api = new API('http://api.ttjinhuo.com/api', {});

    var tobeDeleteGoodId = '';

    //初始化模块控制器
    var GoodController = function(){

    }
    var _p = GoodController.prototype = new BaseController();


    /*************************************** 商品新建/编辑**********************************************/
    _p.initEdit = function(){
        var self = this;
        self.uploader = $("#goodImage");
        self.initUploader();
        self.$scope.tags = [];
        $(document).trigger('nav.change', 'good.new')

        CKEDITOR.replace('ckeditor-desc');

        if(goodId) {
            api.goods.get(goodId, {queries: {'inline-relation-depth': 1}}, function(json){
                if(json && json.code == 200 && json.data && json.data) {
                    self.$scope.good = json.data;

                    //初始化标签编辑器
                    for(var i=0; i< self.$scope.good.tags.length; i++){
                        self.$scope.tags.push(self.$scope.good.tags[i].name);
                    }
                    self.$scope.allTags = self.$scope.tags.join(',');
                    $('#goodTags').val(self.$scope.allTags);
                    $('#goodTags').tagsInput({
                        width: 'auto',
                        defaultText: '添加标签',
                        onAddTag: function(tag){
                            self.$scope.tags.push(tag);
                        },
                        onRemoveTag: function(tag){
                            var find = self.$scope.tags.indexOf(tag);
                            if( find != -1){
                                self.$scope.tags.splice(find, 1);
                            }
                        }
                    });

                    //初始化富文本编辑器
                    var rawHTML = decodeURIComponent(self.$scope.good.description);
                    CKEDITOR.instances['ckeditor-desc'] 
                        && CKEDITOR.instances['ckeditor-desc'].setData(rawHTML);

                    //初始化商品品类选择器
                    //console.log(self.$scope.good)
                    self.catSelector = new CatSelector({
                        wrap: $('#catSelector'),
                        data: {
                            cat_id: self.$scope.good.cat.id,  
                            cat_name: self.$scope.good.cat.cat_name, 
                            spec_id: self.$scope.good.spec.id, 
                            spec_name: self.$scope.good.spec.spec_name
                        },
                        callback: function(info){
                            self.$scope.good.cat_id = info.cat_id;
                            self.$scope.good.spec_id = info.spec_id;
                        }
                    })

                    //初始化供应商选择器
                    self.storeSelector = new StoreSelector({
                        wrap: $('#storeSelector'),
                        data: {
                            id: self.$scope.good.supplier.id,  
                            name: self.$scope.good.supplier.name
                        },
                        callback: function(info){
                            self.$scope.good.store_id = info.id;
                        }
                    })

                    initPortrait(goodId, self.$scope.good.default_image);
                    self.apply();
                }
            })
        } else {
            $('#goodTags').tagsInput({
                width: 'auto',
                defaultText: '添加标签',
                onAddTag: function(tag){
                    self.$scope.tags.push(tag);
                },
                onRemoveTag: function(tag){
                    var find = self.$scope.tags.indexOf(tag);
                    if( find != -1){
                        self.$scope.tags.splice(find, 1);
                    }
                }
            });

            //初始化商品品类选择器
            //console.log(self.$scope.good)
            self.catSelector = new CatSelector({
                wrap: $('#catSelector'),
                data: {
                    cat_id: 1,  
                    cat_name: '请选择', 
                    spec_id: 1, 
                    spec_name: '请选择'
                },
                callback: function(info){
                    self.$scope.good.cat_id = info.cat_id;
                    self.$scope.good.spec_id = info.spec_id;
                }
            })

            //初始化供应商选择器
            self.storeSelector = new StoreSelector({
                wrap: $('#storeSelector'),
                data: {
                    id: 1,  
                    name: "请选择"
                },
                callback: function(info){
                    self.$scope.good.store_id = info.id;
                }
            })
        }
    }

    //初始化商品图片信息
    function initPortrait(id, imageurl) {
        //重要，需要更新控件的附加参数内容，以及图片初始化显示
        $("#goodImage").fileinput('refresh', {
            uploadExtraData: { id: id, type: '商品图片'},
            initialPreview: [
                "<img src='" + imageurl + "' class='file-preview-image' alt='商品图片' title='商品图片'>",
            ],
        });
    }

    _p.initUploader = function(){
        var self = this;
        $("#goodImage").fileinput({
            uploadUrl: "/cms/upload?type=good&dir=good",
            overwriteInitial: true,
            maxFileSize: 1500,
            autoReplace: true,
            maxFileCount: 1,
            showClose: false,
            showCaption: false,
            msgErrorClass: 'alert alert-block alert-danger',
            defaultPreviewContent: '<img src="http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=good" alt="头像" style="width:160px">',
            layoutTemplates: {main2: '{preview} ' + ' {remove} {browse}'},
            allowedFileExtensions: ["jpg", "png", "gif"]
        });
    }

    _p.updateGood = function(e, self){
        //获取CKEDITOR信息
        self.$scope.good.description = CKEDITOR.instances['ckeditor-desc'] ? CKEDITOR.instances['ckeditor-desc'].getData() : '';
        //获取TagInput信息

        console.log(self.$scope.good);
        console.log(self.$scope.tags);
        if( !$("#goodImage").parents('.file-input').hasClass('file-input-ajax-new') ){
            $("#goodImage").on("fileuploaded", function(event, data, previewId, index){
                var res = data.response;
                if(res && res.data && res.data.path){
                    self.$scope.good.default_image = window.location.origin +  data.response.data.path;
                }
                self.updateGoodInfo();
            })
            //上传商品图片
            $("#goodImage").fileinput('upload');
        } else {
            self.updateGoodInfo();
        }
        
        e.preventDefault();
    }

    _p.updateGoodInfo = function(){
        var self = this;
        if(goodId) {
            //编辑已有商品信息
            var data = $.extend({}, self.$scope.good);

            api.goods.update(goodId, {good: data, tags: self.$scope.tags}, function(json){
                console.log(json);
                if(json && json.code == 200){
                    alert('更新成功');
                } else {
                    console.log(json.msg);
                }
            });
        } else {
            //新增商品信息
            var data = $.extend({}, self.$scope.good);
            api.goods.create({good: data, tags: self.$scope.tags}, function(json){
                console.log(json);
                if(json && json.code == 200){
                    alert('添加商品成功');
                    var uid = json.data.id;
                } else {
                    console.log(json.msg);
                }
            });

        }
    }




    /*************************************** 商品详情页面**********************************************/

    //初始化商品详情信息
    _p.initDetail = function(){
        var self = this;
        $(document).trigger('nav.change', 'good.detail')
        api.goods.get(goodId, {'inline-relation-depth': 1}, function(json){
            console.log(json.data)
            if(json && json.code == 200 && json.data && json.data) {
                self.$scope.good = json.data;
                self.apply();
            }
        })

    }


    /*************************************** 商品列表页面**********************************************/

    //初始化商品列表页
    _p.initList = function(){
        var self = this;
        self.pager = new Pager({wrapper: $('.pagination ul'), total: 8, page: 2});
        
        self.getGoodList({}, {page: 1, page_size: 20});
        $(document).trigger('nav.change', 'good.list')

        $(document).on('PAGER_CHANGED', function(e, page){
            //console.log(page);
            self.getGoodList({}, {page: page, page_size: 20});
        })
    }

    _p.getGoodList = function(query, filter){
        var self = this;
        api.goods.list({'inline-relation-depth': 1, queries: query, filters: filter}, function(json){
            //console.log(json.data)
            if(json && json.code == 200 && json.data && json.data.data) {
                self.$scope.goods = json.data.data;
                self.page = json.data.currentPage;
                self.total = json.data.pages.length;
                //self.$scope.pages = json.data.pages;
                self.apply();
                self.pager.render(self.page , self.total);
            }
        })
    }

    //删除商品
    _p.deleteGoodDialog = function(e, self){
        tobeDeleteGoodId = $(this).parents('tr').data('id');

        var dialog = new Dialog({
            title: '删除商品',
            content:  '确定要删除该商品吗? 删除后将无法恢复.',
            btns: [
                {klass: 'btn-danger', text: '确定', callback: function(){
                    this.hide();
                    _p.deleteGood();
                }},
                {klass: 'btn-default',text: '取消', callback: null, dismiss: true}
            ]
        });
        dialog.show();
    }

    _p.deleteGood = function(){
        tobeDeleteGoodId && api.goods.del(tobeDeleteGoodId, function(json){
            console.log(json);
            if(json && json.code == 200){
                alert('删除商品成功');
            } else {
                console.log(json.msg);
            }
        });
    }


    return (new GoodController());

})