const chatForm = document.getElementById("chat-form")
const chatMessages=document.querySelector('.chat-messages')

// get username and room from url
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})

// console.log(username,room)


const socket = io();
// Join chatRoom
socket.emit('joinRoom',{username,room})

// Message from server
socket.on("message", message => {
    console.log(message)
    outputMessage(message);

    // scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;
})

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //   get the messge from text
    const msg = e.target.elements.msg.value;
    //   emit a message to the server
    socket.emit('chatMessage', msg)

    // clear the input again
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
})

// output msg from DOM
function outputMessage(message){
const div=document.createElement('div');
div.classList.add('message');
div.innerHTML=`<p class="meta"> ${message.username}  <span>${message.time}</span></p>
<p class="text">
${message.text}
</p>
`
document.querySelector(".chat-messages").appendChild(div)
}