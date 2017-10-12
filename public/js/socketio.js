var socket = io();
var message = document.getElementById('textinput');
var button = '#submitchat';
var chatbox = '#chatbox-container';
var istyping = document.getElementById('isTyping');
var enterChat = '#enter-chat';
let onlineList = [];

$(enterChat).on('click', function(){
  NAME = prompt("nama apa ?");
  if (NAME !== '') {
    onlineList.push({'name':NAME,'id':onlineList.length+1});
    console.log('onlineList', onlineList);
    socket.emit('counter',{
      count: onlineList.length,
      name: onlineList
    })
  }
});

if (onlineList.length > 0) {
  onlineList.forEach(function(item) {
    $('.online-list ul').append('<li>'+item+'</li>');
  })
}

$(button).click(function(){
    socket.emit('chat',{
        message: message.value,
        name: NAME
    });
});

// if the user use ENTER to submit chat
$('#textinput').keydown(function(event) {
    // '13' refer to ENTER

    if (event.keyCode == 13){
        socket.emit('chat',{
            message: message.value,
            name: NAME
        });
    }
});

$('#textinput').keydown( function() {
    socket.emit('typing', NAME);
})

//Fix the innerhtml clear when ENTER
setInterval(function(){
    istyping.innerHTML = "";
}, 3000);

function scrolltop() {
    $('.chatbox').scrollTop($('.chatbox').height()*1000);
}

socket.on('chat', function(data) {
    message.value = '';
    $(chatbox).append('<li class="list-group-item"> <b>'+data.name+'</b> : '+data.message+'</li>');
    scrolltop();
    istyping.innerHTML = '';
});

socket.on('typing', function(data) {
    istyping.innerHTML = '<p><em>'+data+' is typing a message...</em><p>';
    scrolltop();
});

socket.on('counter', function(data){
    $('.counter').html('<h2>'+data.count+'</h2>');
    if (data.count > 0) {
      $('.online-list ul').html("");
      data.name.forEach(function(item) {
        $('.online-list ul').append('<li>'+item.name+'</li>');
      })
    }
    // $('.online-list ul').append('<li>'+data.name+'</li>');
});
