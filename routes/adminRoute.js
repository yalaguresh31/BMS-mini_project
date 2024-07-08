const express = require("express");
const admin_route = express();

const bodyParser = require('body-parser');
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

const session = require('express-session');
const config = require('../config/config');
admin_route.use(session({
    secret: config.sessionSecret,
    resave: true, //save session if unmodified
    saveUninitialized: true //create session until something is stored
}));

admin_route.set('view engine','ejs');
admin_route.set('views','./views');

const multer = require('multer');
const path = require('path');

admin_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null,path.join(__dirname,'../public/images'));
    },
    filename:function(req, file, cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});

const upload = multer({storage:storage});

const adminController = require("../controllers/adminController");
const adminLoginAuth = require('../middlewares/adminLoginAuth');
const myBlogsLoginAuth = require('../middlewares/myBlogsLoginAuth');

admin_route.get('/blog-setup',adminController.blogSetup);
admin_route.post('/blog-setup',upload.single('blog_image'), adminController.blogSetupSave);

admin_route.get('/dashboard',adminLoginAuth.isLogin,adminController.dashboard);

admin_route.get('/dashboard2',myBlogsLoginAuth.isLogin,adminController.dashboard2);

admin_route.get('/create-post',myBlogsLoginAuth.isLogin,adminController.loadPostDashboard);
admin_route.post('/create-post',myBlogsLoginAuth.isLogin,adminController.addPost);

admin_route.post('/upload-post-image',upload.single('image'),myBlogsLoginAuth.isLogin,adminController.uploadPostImage);

admin_route.post('/delete-post',myBlogsLoginAuth.isLogin,adminController.deletePost);

admin_route.get('/edit-post/:id',myBlogsLoginAuth.isLogin,adminController.loadEditPost);
admin_route.post('/update-post',myBlogsLoginAuth.isLogin,adminController.updatePost);

admin_route.get('/settings',adminLoginAuth.isLogin,adminController.loadSettings);
admin_route.post('/settings',adminLoginAuth.isLogin,adminController.saveSettings);

module.exports = admin_route;
