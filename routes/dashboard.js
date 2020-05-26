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
    if(req.session.userName){
      var decoded = jwt.verify(userToken, 'loginToken');
    }else{
      res.redirect('/');
    }
    
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
/* GET dashboard page. */
router.get('/',checkLoginUser,function(req, res, next) {
    var loginUser=req.session.userName;
    passModel.countDocuments({}).exec((err,count)=>{
      passCatModel.countDocuments({}).exec((err,countasscat)=>{    
  res.render('dashboard', { title: 'Password Management System',loginUser:loginUser,msg:'',totalPassword:count, totalPassCat:countasscat });
  });
});
});
  module.exports = router;