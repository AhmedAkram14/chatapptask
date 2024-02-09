const socket = io()
const totalClients = document.getElementById('total-clients')
const msgContainer =document.getElementById('message-container')
const nameInput =document.getElementById('name-input')
const msgForm =document.getElementById('message-form')
const msgInput =document.getElementById('message-input')

msgForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMsg()
})
socket.on('clients-total' , (data) => {
    totalClients.innerHTML = `total clients: ${data}`
})

function sendMsg() {
    if(msgInput.value === "") return
    const data = {
        name: nameInput.value,
        msg: msgInput.value,
        dateTime: new Date()
    }
    socket.emit('message', data)
    renderMsg(true , data)
    msgInput.value = ''
}

socket.on('chat-message', (data) => {
    console.log(data)
    renderMsg(false , data)
})

function renderMsg(isOwnMsg , data){
    clearFeedback()
    const element = `<li class="${isOwnMsg ? "message-right" : "message-left"}">
    <p class="message">
    ${data.msg}
        <span>${data.name} -- ${moment(data.dateTime).fromNow()}</span>
    </p>
    </li>`
    msgContainer.innerHTML += element
    scrollToBottom()
}

function scrollToBottom(){
    msgContainer.scrollTo(0 , msgContainer.scrollHeight)
}

msgInput.addEventListener('focus' , (e) => {
    clearFeedback()
    socket.emit('feedback' , {
        feedback : `💬${nameInput.value} is typing a message`
    })
})
msgInput.addEventListener('keypress' , (e) => {
    clearFeedback()
    socket.emit('feedback' , {
        feedback : `💬${nameInput.value} is typing a message`
    })
})
msgInput.addEventListener('blur' , (e) => {
    clearFeedback()
    socket.emit('feedback' , {
        feedback :'',
    })
})

socket.on("feedback" , (data) => {
    clearFeedback()
    const element = `
    <li class="message-feedback">
                <p class="feedback" id="feedback">${data.feedback}</p>
            </li>
    `
    msgContainer.innerHTML += element
})

function clearFeedback(){
    document.querySelectorAll("li.message-feedback").forEach((e) => {
        e.parentNode.removeChild(e)
    })
}