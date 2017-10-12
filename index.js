const express = require('express');
const app = express();
const socket = require('socket.io');
const ejs = require('ejs');

const server = app.listen(process.env.PORT || 3000,
    function(){
        console.log('Listening to port 3000');
    });

const mongoose = require('mongoose');
//connecting mongoose
mongoose.connect('mongodb://localhost/myappdatabase');
var Schema = mongoose.Schema;
//Create a Schema
var userChatSchema = new Schema({
  name : String,
  msg : String
});

var onlineUsers = new Schema({
  count: Number,
  name: String
});

var chatData = mongoose.model('chatData', userChatSchema);
var onlineUsers = mongoose.model('onlineUsers', onlineUsers);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/',function(req,res){
    res.render('index');
})

var io = socket(server);

io.on('connection', function(socket){
    console.log('Made a Socket connection ID : ' + socket.id)
    // console.log('total connection : '+ ++count);
    // io.emit('counter', count);


    socket.on('counter', function(data){
      io.emit('counter',data);
      var online = onlineUsers({
        count: data.count,
        name: data.name
      });

      online.save(function(err) {
        if (err) throw err;

        console.log('Chat Saved Succesfully');
      });
    })

    socket.on('chat', function(data){
      // var message = striptags(data); // this is not working somehow.
      io.emit('chat', data);
      console.log('data', data);
      var newChat = chatData({
        name: data.name,
        message: data.message
      });
      // save the conversation
      newChat.save(function(err) {
        if (err) throw err;

        console.log('Chat Saved Succesfully');
      });
    })

    socket.on('typing', function(data){
        io.emit('typing', data);
    })

    socket.on('disconnect' , function(){
        // console.log(socket.id+" has disconnect");
        // console.log('total connection : '+ --count);
        // io.emit('counter', count);
    })
});



