var express = require('express');
var router = express.Router();
var  bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
/*--------------------DataBase Modules----------------------------*/
var userModule=require('../modules/user');
var passModel = require('../modules/add_password');
var passCatModel = require('../modules/password_category');
var getPassCat= passCatModel.find({});
var getAllPass= passModel.find({});
/*--------------------middleware----------------------------*/
/* Check Login Funcation. */
function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}
/* Check Email Funcation. */
function checkEmail(req,res,next){
  var email=req.body.email;
  var checkexitemail=userModule.findOne({email:email});
  checkexitemail.exec((err,data)=>{
 if(err) throw err;
 if(data){
  return res.render('signup', { title: 'Password Management System', msg:'this email address already exists please choose a different email;' });
}
 next();
  });
}
/* Check UserName Funcation. */
function checkUsername(req,res,next){
  var uname=req.body.uname;
  var checkexitemail=userModule.findOne({username:uname});
  checkexitemail.exec((err,data)=>{
 if(err) throw err;
 if(data){
  return res.render('signup', { title: 'Password Management System', msg:'Username Already Exit' });
}
 next();
  });
}
/* Check Local Storage. */
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
/*--------------------Routing----------------------------*/

/* GET Add New Password page. */
router.get('/',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
  res.render('addNewCategory', { title: 'Password Management System',loginUser:loginUser,errors:'',success:''});
  });
/* POST Add New Password  page. */
router.post('/',checkLoginUser,[ check('passwordCategory','Enter Password Category Name').isLength({ min: 1 })],function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    res.render('addNewCategory', { title: 'Password Management System',loginUser: loginUser, errors:errors.mapped(),success:''});
    }else{
      var passCatName =req.body.passwordCategory;
      var passcatDetails =new passCatModel({
        passord_category: passCatName
       });
       passcatDetails.save(function(err,doc){
        res.render('addNewCategory', { title: 'Password Management System',loginUser: loginUser, errors:'', success:'Password category inserted successfully' });
      })
    }
    });
  
  module.exports = router;