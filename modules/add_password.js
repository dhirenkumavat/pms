const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://pmsuser:pmsuser123@cluster0-hpvvn.mongodb.net/pms?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true,});
var conn =mongoose.Collection;
var passSchema =new mongoose.Schema({
    password_category: {type:String, 
        required: true,
        },
        project_name: {type:String, 
            required: true,
           },
        password_detail: {type:String, 
            required: true,
           },
    date:{
        type: Date, 
        default: Date.now }
});
var passModel = mongoose.model('password_details', passSchema);
module.exports=passModel;