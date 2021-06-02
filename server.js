'use strict';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const user=require('./module/user');
const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT;


// connect express server to mongodb server
// so we can save data and get from mongoServer
mongoose.connect('mongodb://localhost:27017/myFav3', {useNewUrlParser: true, useUnifiedTopology: true});

// put data into schema

// know we want add data to our collection
 function bookCollection() {

console.log("hey")
  const rujeena = new user({
    email: 'rujeenaalzoud@gmail.com',
    books: [
      
      {
        imageUrl :'https://cdn2.penguin.com.au/covers/original/9780241952191.jpg',
        name: 'The Siege',
        description: 'The Levin family battle against starvation in this novel set during the German siege of Leningrad. Anna digs tank traps and dodges patrols as she scavenges for wood, but the hand of history is hard to escape.',
        status: 'finish'
      },
      {
        imageUrl :'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1612201530l/54860229.jpg',
        name: 'Light',
        description: 'One of the most underrated prose writers demonstrates the literary firepower of science fiction at its best. Three narrative strands – spanning far-future space opera, contemporary unease and virtual-reality pastiche – are braided together for a breathtaking metaphysical voyage in pursuit of the mystery at the heart of reality.',
        status: 'finish'
      }
    ]
  });

const zainab = new user({
  
  email: 'yahyazainab204@gmail.com',
  books: [
    {
      imageUrl:'https://upload.wikimedia.org/wikipedia/en/7/76/The_God_Delusion_UK.jpg',
      name: 'The God Delusion',
      description: 'A key text in the days when the “New Atheism” was much talked about, The God Delusion is a hard-hitting attack on religion, full of Dawkins’s confidence that faith produces fanatics and all arguments for God are ridiculous. What the evolutionary biologist lacks in philosophical sophistication, he makes up for in passion, and the book sold in huge numbers.',
      status: ' finish'
    },
    
   { imageUrl:'https://i.pinimg.com/originals/3f/e5/c6/3fe5c6676adc189a88d2719d45af379d.jpg',
      name: 'The Cost of Living',
      description: 'Chaos is supposed to be what we most fear but I have come to believe it might be what we most want ... ” The second part of Levy’s “living memoir”, in which she leaves her marriage, is a fascinating companion piece to her deep yet playful novels. Feminism, mythology and the daily grind come together for a book that combines emotion and intellect to dazzling effect.',
      status: 'finish'
    }
  ]
});
zainab.save();
rujeena.save();
   }
 bookCollection();


//know get the data from Mongo DB and send it to render in front end
// localhost:3001/books?email=rujeenaalzoud@gmail.com
function getUser(request, response)  {
  
  const email2 = request.query.email;
 console.log('fgh');
  user.find({email: email2 }, function (err, user1) {
      if (err) response.send('did not work')
      else{  
    console.log(user1[0].books)  
      response.send(user1[0].books);

  }
  });
 

}
//add new data books to MongoDB and render it in front end 
function addBook(request,response){
  console.log(request,'gr');
  const { name, imageUrl,description,status,email } = request.body;

  user.find({ email: email }, (error, ownerData) => {
    if(error) {response.send('not Working')}
    else{
      console.log('before pushing',ownerData[0])

    ownerData[0].books.push({
        name: name,
        description: description,
        status:status,
        email:email,
        imageUrl:imageUrl
    })
    ownerData[0].save();
    response.send(ownerData[0]);
  }
});

}



function deleteBooks(request, response) {
 
  const index = Number(request.params.index);
 
  
  const { email} = request.query;
  
 user.find({email: email}, (err, ownerData) => {
      
try {
  const newBookArr = ownerData[0].books.filter((books, idx) => {
    return idx !== index
});
ownerData[0].books = newBookArr;
ownerData[0].save();
response.send(ownerData[0].books);
} catch (error) {
  console.log(error);
}
if (err) {response.send(`YOU GOT AN ERROR! your error: ${err}`)};  

     
  });
}

/// 
function updateBook(request, response) {
  const index = request.params.index
  
  const { name, description, status, email, image } = request.body;
  user.findOne({ email: email }, (error, ownerData) => {
      console.log(ownerData);
      ownerData.books.splice(index, 1, {
          name: name,
          description: description,
          status: status,
          imageUrl : image

      });

        ownerData.save();
      console.log(ownerData);
      
      response.send(ownerData.books)

  });
}


app.get('/',  pageHandler) ;
function pageHandler(request,response){
response.send("hello-from-backend")
}


app.put('/updatebooks/:index', updateBook);
app.post('/addbooks',addBook);
app.get('/books', getUser);
app.delete('/deletebooks/:index', deleteBooks);

app.listen(PORT, () => console.log(`listening on ${PORT}`));

//if we have error to conection with db
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // we're connected!
// });