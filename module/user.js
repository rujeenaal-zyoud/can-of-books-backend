'use strict';

 
// now steps 3 creat collections
// create schema and model 
// schema : determin how shape of our data will look lije (blueprint)
// schema so it's the structure for my data and i need to follow it
// schema it's a class in mongodb





//build a model form our schema 
// schema : drawing phase
// model : creation phase

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
//    image=String,
    name: String,
    description: String,
    status: String
  });
  //create anther schema when click to user
  const UserSchema = new mongoose.Schema({
    email: String,
    books: [bookSchema]
  
  });


const user = mongoose.model('user', UserSchema);
const book = mongoose.model('book',  bookSchema);

module.exports=user;