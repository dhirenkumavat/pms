const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://pmsuser:pmsuser123@cluster0-hpvvn.mongodb.net/pms?retryWrites=true&w=majority', {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
var conn =mongoose.Collection;
var userSchema =new mongoose.Schema({
    fname: {type:String, 
        required: true,
        index: {
            unique: true,        
        }},
        username: {type:String, 
            required: true,
            index: {
                unique: true,        
            }},
	email: {
        type:String, 
        required: true,
        index: {
            unique: true, 
        },},
    password: {
        type:String, 
        required: true
    },
    date:{
        type: Date, 
        default: Date.now }
});

var userModel = mongoose.model('users', userSchema);
module.exports=userModel;