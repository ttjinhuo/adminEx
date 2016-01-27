var rendering = require('../util/rendering');


exports.home = function(req, res) {
    //res.render('home/index');
    res.sendfile('build/public/views/home/index.html');
}

//users
exports.users = function(req, res) {
    //res.render('users/list');
    res.sendfile('build/public/views/users/list.html');
}
exports.userDetail = function(req, res) {
    //res.render('users/detail');
    res.sendfile('build/public/views/users/detail.html');
}
exports.userAddOrEdit = function(req, res) {
    //res.render('users/detail');
    res.sendfile('build/public/views/users/edit.html');
}

//goods
exports.category = function(req, res) {
    //res.render('goods/category');
    res.sendfile('build/public/views/goods/category.html');
}
exports.categoryDetail = function(req, res) {
    //res.render('goods/category');
    res.sendfile('build/public/views/goods/spec.html');
}

exports.tags = function(req, res) {
    //res.render('goods/tags');
    res.sendfile('build/public/views/goods/tags.html');
}
exports.goods = function(req, res) {
    // res.render('goods/list');
    res.sendfile('build/public/views/goods/list.html');
}
exports.goodDetail = function(req, res) {
    // res.render('goods/detail');
    res.sendfile('build/public/views/goods/detail.html');
}
exports.goodAddOrEdit = function(req, res) {
    // res.render('goods/detail');
    res.sendfile('build/public/views/goods/edit.html');
}

//suppliers
exports.suppliers = function(req, res) {
    // res.render('suppliers/list');
    res.sendfile('build/public/views/suppliers/list.html');
}
exports.supplierDetail = function(req, res) {
    // res.render('suppliers/detail');
    res.sendfile('build/public/views/suppliers/detail.html');
}
exports.supplierAddOrEdit = function(req, res) {
    // res.render('goods/detail');
    res.sendfile('build/public/views/suppliers/edit.html');
}

//order
exports.orders = function(req, res) {
    // res.render('orders/list');
    res.sendfile('build/public/views/orders/list.html');
}
exports.orderDetail = function(req, res) {
    // res.render('orders/detail');
    res.sendfile('build/public/views/orders/detail.html');
}

//modules
exports.modules = function(req, res) {
    // res.render('modules/list');
    res.sendfile('build/public/views/modules/list.html');
}
exports.moduleDetail = function(req, res) {
    // res.render('modules/detail');
    res.sendfile('build/public/views/modules/detail.html');
}
exports.moduleNew = function(req, res) {
    // res.render('modules/new');
    res.sendfile('build/public/views/modules/edit.html');
}
exports.fragments = function(req, res) {
    // res.render('modules/fragment-list');
    res.sendfile('build/public/views/fragments/list.html');
}
exports.fragmentDetail = function(req, res) {
    // res.render('modules/fragment-detail');
    res.sendfile('build/public/views/fragments/detail.html');
}
exports.fragmentNew = function(req, res) {
    // res.render('modules/fragment-new');
    res.sendfile('build/public/views/fragments/edit.html');
}

// 媒资库管理
exports.media = function(req, res) {
    res.sendfile('build/public/views/media/index.html');
}
