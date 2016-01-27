
var rendering = require('./util/rendering'),
    indexController = require('./controllers/index'),
    loginController = require('./controllers/login'),
    uploadController = require('./controllers/upload');

module.exports = function (app, passport) {

    // Home
    app.get('/', ensureAuthenticated, indexController.home);
    app.get('/home', ensureAuthenticated, indexController.home);

    //users
    app.get('/users/:id/edit/', ensureAuthenticated, indexController.userAddOrEdit);
    app.get('/users/new/', ensureAuthenticated, indexController.userAddOrEdit);
    app.get('/users/:id', ensureAuthenticated, indexController.userDetail);
    app.get('/users', ensureAuthenticated, indexController.users);

    //goods
    app.get('/goods/:id/edit/', ensureAuthenticated, indexController.goodAddOrEdit);
    app.get('/goods/new/', ensureAuthenticated, indexController.goodAddOrEdit);
    app.get('/cats', ensureAuthenticated, indexController.category);
    app.get('/cats/:id', ensureAuthenticated, indexController.categoryDetail);
    app.get('/goods', ensureAuthenticated, indexController.goods);
    app.get('/goods/:id', ensureAuthenticated, indexController.goodDetail);

    //suppliers
    app.get('/suppliers/:id/edit/', ensureAuthenticated, indexController.supplierAddOrEdit);
    app.get('/suppliers/new/', ensureAuthenticated, indexController.supplierAddOrEdit);
    app.get('/suppliers', ensureAuthenticated, indexController.suppliers);
    app.get('/suppliers/:id', ensureAuthenticated, indexController.supplierDetail);


    app.get('/orders', ensureAuthenticated, indexController.orders);
    app.get('/orders/:id', ensureAuthenticated, indexController.orderDetail);

    app.get('/modules', ensureAuthenticated, indexController.modules);
    app.get('/modules/new', ensureAuthenticated, indexController.moduleNew);
    app.get('/modules/:id/edit', ensureAuthenticated, indexController.moduleNew);
    app.get('/modules/:id', ensureAuthenticated, indexController.moduleDetail);


    app.get('/modules/:module_id/fragments', ensureAuthenticated, indexController.fragments);
    app.get('/modules/:module_id/fragments/:id', ensureAuthenticated, indexController.fragmentDetail);
    app.get('/modules/:module_id/fragments/new', ensureAuthenticated, indexController.fragmentNew);

    app.get('/media', ensureAuthenticated, indexController.media);

    // Auth
    app.get('/register', loginController.registerPage);
    app.post('/register', loginController.registerPost);
    app.get('/login', loginController.loginPage);
    app.post('/login', loginController.checkLogin);
    app.get('/logout', loginController.logout);

    //upload
    app.post('/cms/upload', uploadController.upload) //admin
    app.get('/cms/media/list', uploadController.list) //admin



    // Auth Middleware
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/login');
    }
}
