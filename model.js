const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String 
    },
    dis: {
        type: String 
    },
    price: {
        type: Number 
    },
    rating: {
        type: Number 
    },
    id: {
        type: String 
    },
    email : {
        type : String,
        required : [true, "Please enter the email address..."]
    },
    password : {
        type : String,
        required : [true, "Please enter the password"]
    },
    review : {
        type : String
    }
});

const electronics = mongoose.model('electronics', schema);

module.exports = {

    electronics

}