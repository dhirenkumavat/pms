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

/* Get Regirect dashboard */
router.get('/',checkLoginUser, function(req, res, next) {
    res.redirect('/dashboard');
  });
  /* Get Edit edit_password_detail page */
  router.get('/edit/:id',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var id =req.params.id;
    var getPassDetails=passModel.findById({_id:id});
    getPassDetails.exec(function(err,data){
  if(err) throw err;
  getPassCat.exec(function(err,data1){
  res.render('edit_password_detail',{ title: 'Password Management System',loginUser: loginUser,records:data1,record:data,success:'' });
  });
  });
  });
  /* Post Update edit_password_detail page */
  router.post('/edit/:id',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var id =req.params.id;
    var passcat= req.body.pass_cat;
    var project_name= req.body.project_name;
    var pass_details= req.body.pass_details;
    passModel.findByIdAndUpdate(id,{password_category:passcat,project_name:project_name,password_detail:pass_details}).exec(function(err){
    if(err) throw err;
      var getPassDetails=passModel.findById({_id:id});
    getPassDetails.exec(function(err,data){
  if(err) throw err;
  getPassCat.exec(function(err,data1){
  res.render('edit_password_detail', { title: 'Password Management System',loginUser: loginUser,records:data1,record:data,success:'Password Updated Successfully' });
  });
  });
  });
  });
  /* Get Delete view-all-password page */
  router.get('/delete/:id', checkLoginUser,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var id =req.params.id;
    var passdelete=passModel.findByIdAndDelete(id);
    passdelete.exec(function(err){
      if(err) throw err;
      res.redirect('/view-all-password/');
    });
  });
  module.exports = router;