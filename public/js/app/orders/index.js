define(['jquery', 'swig', 'ckeditor', 'app/pager', 'fileupload', 'comp/dialog/index', 'app/base', 'api/index'], 
    function ($, swig, CKEDITOR,Pager, upload, Dialog, BaseController, API) {
    var jQuery = $;
    //console.log(CKEDITOR)
    var orderId = parseInt(window.location.pathname.split('/')[2]);
    api = new API('http://api.ttjinhuo.com/api', {});

    var tobeDeleteOrderId = '';

    //初始化模块控制器
    var OrderController = function(){

    }

    var _p = OrderController.prototype = new BaseController();

    _p.initDetail = function(){
        var self = this;
        $(document).trigger('nav.change', 'order.list')
        api.orders.get(orderId, {'inline-relation-depth': 1}, function(json){
            if(json && json.code == 200 && json.data && json.data) {
                self.$scope.order = json.data;
                self.apply();
            }
        })
    }

    _p.initEdit = function(){
        var self = this;
        $(document).trigger('nav.change', 'order.new')
        orderId && api.orders.get(orderId, {'inline-relation-depth': 0}, function(json){
            if(json && json.code == 200 && json.data && json.data) {
                self.$scope.order = json.data;
                self.apply();
            }
        })


    }

    _p.updateOrder= function(e){
        var self = this;
        console.log(self.$scope.order);

        if(orderId) {
            //编辑已有订单信息
            var data = $.extend({}, self.$scope.order);

            api.orders.update(orderId, {store: data}, function(json){
                console.log(json);
                if(json && json.code == 200){
                    alert('更新成功');
                } else {
                    console.log(json.msg);
                }
            });
        } else {
            //新增订单信息
            var data = $.extend({}, self.$scope.order);
            api.orders.create({order: data}, function(json){
                console.log(json);
                if(json && json.code == 200){
                    alert('添加订单成功');
                } else {
                    console.log(json.msg);
                }
            });

        }
        e.preventDefault();
    }

    //初始化订单列表页
    _p.initList = function(){
        var self = this;
        self.pager = new Pager({wrapper: $('.pagination ul'), total: 0, page: 1});
        
        self.getOrders({}, {page: 1, page_size: 5});
        $(document).trigger('nav.change', 'order.list')
        $(document).on('PAGER_CHANGED', function(e, page){
            //console.log(page);
            self.getOrders({'inline-relation-depth': 1}, {page: page, page_size: 2});
        })
    }

    //删除订单
    _p.deleteOrderDialog = function(e){
        var self = this;
        tobeDeleteUserId = $(this).parents('tr').data('id');

        var dialog = new Dialog({
            title: '删除用户',
            content:  '确定要删除该订单吗? 删除后将无法恢复.',
            btns: [
                {klass: 'btn-danger', text: '确定', callback: function(){
                    this.hide();
                    _p.deleteOrder();
                }},
                {klass: 'btn-default',text: '取消', callback: null, dismiss: true}
            ]
        });
        dialog.show();
    }

    _p.deleteOrder = function(){
        tobeDeleteOrderId && api.orders.del(tobeDeleteOrderId, function(json){
            console.log(json);
            if(json && json.code == 200){
                alert('删除Order成功');
            } else {
                console.log(json.msg);
            }
        });
    }

    //获取用户列表
    _p.getOrders = function(query, filter){
        var self = this;
        api.orders.list({queries: query, filters: filter}, function(json){
            //console.log(json.data)
            if(json && json.code == 200 && json.data && json.data.data) {
                self.$scope.orders = json.data.data;
                self.page = json.data.currentPage;
                self.total = json.data.pages.length;
                //self.$scope.pages = json.data.pages;
                self.apply();
                self.pager.render(self.page , self.total);
            }
        })
    }

    return (new OrderController());

})