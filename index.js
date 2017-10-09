const express = require('express');
const app = express();
const socket = require('socket.io');
const ejs = require('ejs');
const striptags = require('striptags');

const server = app.listen(process.env.PORT || 3000,
    function(){
        console.log('Listening to port 3000');
    });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/',function(req,res){
    res.render('index');
})

var io = socket(server);
let count = 0;
let NAME;

io.sockets.on('connection', function(socket){
    console.log('Made a Socket connection ID : ' + socket.id)
    console.log('total connection : '+ ++count);
    io.sockets.emit('counter', count);

    socket.on('chat', function(data){
      var message = striptags(data); // this is not working somehow.
      io.sockets.emit('chat', data);
    })

    socket.on('typing', function(data){
        io.sockets.emit('typing', data);
    })

    socket.on('disconnect' , function(){
        console.log(socket.id+" has disconnect");
        console.log('total connection : '+ --count);
        io.sockets.emit('counter', count);
    })
});
