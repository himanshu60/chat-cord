const chatForm = document.getElementById("chat-form")
const chatMessages=document.querySelector('.chat-messages')


const socket = io();
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
div.innerHTML=`<p class="meta">Himanshu<span>9:12pm</span></p>
<p class="text">
${message}
</p>
`
document.querySelector(".chat-messages").appendChild(div)
}