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
/* Get view-all-password page. */
router.get('/',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var perPage = 3;
    var page = req.params.page || 1;
  
    getAllPass.skip((perPage * page) - perPage)
    .limit(perPage).exec(function(err,data){
      if(err) throw err;
      passModel.aggregate([
        {
          $lookup:
            {
              from: "password_categories",
              localField: "password_category",
              foreignField: "passord_category",
              as: "pass_cat_details"
            }
        },
        { $unwind : "$pass_cat_details" }

    ]).exec(function(err,results){
        if(err) throw err;
        console.log(results);
        res.send(results);

    })
    })
  });

  
  module.exports = router;