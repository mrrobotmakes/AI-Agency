console.log("JavaScript Connected!");
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector("nav");
menuBtn.addEventListener("click", () => {nav.classList.toggle("active");});
const navlinks = document.querySelectorAll("nav a");
navlinks.forEach((link)=>{link.addEventListener("click",()=>{nav.classList.remove("active");});});

const form = document.querySelector(".contact-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const messageInput = document.querySelector("#message");
function showError(input,message){const error =input.nextElementSibling;
                                                error.textContent = message;
                                                input.classList.add("input-error");
                                                input.classList.remove("input-success");}
function showSuccess(input){const error = input.nextElementSibling;
                                           error.textContent="";
                                           input.classList.remove("input-error");
                                           input.classList.add("input-success");}
console.log("Submit clicked");
form.addEventListener("submit", (event) => {event.preventDefault();let isValid = true;

    if (nameInput.value.trim() === "") {showError(nameInput, "Please enter your name.");isValid = false;} 
    else {showSuccess(nameInput);}

    if (emailInput.value.trim() === "") {showError(emailInput, "Please enter your email.");isValid = false;} 
    else {showSuccess(emailInput);}

    if (messageInput.value.trim() === "") {showError(messageInput, "Please enter your message.");isValid = false;} 
    else {showSuccess(messageInput);}

    if (!isValid) return;

    fetch("http://localhost:5000/api/contact", {method: "POST",headers: {"Content-Type": "application/json"},
                                                body: JSON.stringify({name: nameInput.value.trim(),
                                                                      email: emailInput.value.trim(),
                                                                      message: messageInput.value.trim()})})
    .then((response) => response.json())
    .then((data) => {console.log(data);showToast(data.message,"success");

    form.reset();[nameInput, emailInput, messageInput].forEach((input) => {input.classList.remove("input-success");
                                                                           input.classList.remove("input-error");
                                                                           input.nextElementSibling.textContent = "";});})
    .catch((error) => {console.error(error);showToast("Something went wrong.","error");});});

const hiddenElements = document.querySelectorAll(".hidden");
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {if (entry.isIntersecting) {entry.target.classList.add("show");} 
                                else {entry.target.classList.remove("show");}});});
hiddenElements.forEach((element) => {observer.observe(element);});

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll("nav a");
window.addEventListener("scroll",() => {
                                        let current="";
                                        sections.forEach((section)=>{const sectionTop = section.offsetTop - 150;
                                                                     const sectionHeight = section.offsetHeight;
                                                                     if (window.scrollY >= sectionTop && 
                                                                         window.scrollY < sectionTop + sectionHeight){
                                                                        current = section.getAttribute("id");}});
                                        navItems.forEach((link) => {link.classList.remove("active");
                                                                    if (link.getAttribute("href") === "#" + current){
                                                                        link.classList.add("active");}});});

const backToTop = document.querySelector("#backToTop");
window.addEventListener("scroll", () => {if (window.scrollY > 50){backToTop.classList.add("show");}
                                         else{backToTop.classList.remove("show");}});
backToTop.addEventListener("click", () => {window.scrollTo({top:0,behavior:"smooth"});});

const progressBar = document.querySelector(".progress-bar");
window.addEventListener("scroll", () => {const scrollTop = window.scrollY;
                                         const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
                                         const scrollPercent = (scrollTop/documentHeight)*100;
                                         progressBar.style.width =scrollPercent + "%" });

const chatInput = document.querySelector("#chatInput");
const sendBtn = document.querySelector("#sendBtn");
const chatBody = document.querySelector("#chatBody");
function scrollToBottom(){chatBody.scrollTop = chatBody.scrollHeight;}

function getCurrentTime(){
    return new Date().toLocaleTimeString([],{
        hour:"2-digit",
        minute:"2-digit"
    });
}

function addUserMessage(message) {
    const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
    const userMessage = document.createElement("div");
    userMessage.className = "user-message";
    userMessage.innerHTML = `
        <div class="message-content">
            <div class="message-header">
                <strong>You</strong>
                <span>${time}</span>
            </div>
            <p>${message}</p>
        </div>
        <div class="message-avatar user-avatar">
            Y
        </div>
    `;
    chatBody.appendChild(userMessage);
    scrollToBottom();
}

const toast = document.querySelector("#toast");

function showToast(message,type="success"){
    toast.textContent = message;
    toast.className = "";
    toast.classList.add(type);
    toast.classList.add("show");
    setTimeout(()=>{
        toast.classList.remove("show");
    },3000);
}

function sendMessage(){const message = chatInput.value.trim();if(message === "") return;
                                                              addUserMessage(message);
                                                              chatInput.value = "";
                                                              showTyping();

                        fetch("http://localhost:5000/api/chat", 
                             {method: "POST",headers: {"Content-Type": "application/json"},
                             body: JSON.stringify({message: message})})
                        .then((response) => response.json())
                        .then((data) => {removeTyping();addBotMessage(data.reply);})
                        .catch((error) => {removeTyping();console.error(error);showToast("Server connection failed.","error");

addBotMessage("Something went wrong.");});}
console.log(sendBtn);
sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown",(event)=>{
    if(event.key==="Enter" && !event.shiftKey){
        event.preventDefault();
        sendMessage();
    }
});

function addBotMessage(message) {
    const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
    const botMessage = document.createElement("div");
    botMessage.className = "bot-message";
    botMessage.innerHTML = `
        <div class="message-avatar">
            AI
        </div>
        <div class="message-content">
            <div class="message-header">
                <strong>AI Assistant</strong>
                <span>${time}</span>
            </div>
            <p>${message}</p>
        </div>
    `;
    chatBody.appendChild(botMessage);
    scrollToBottom();}

function showTyping(){
    const typing=document.createElement("div");
    typing.classList.add("bot-message");
    typing.id="typing";
    typing.innerHTML=`
        <div class="message-avatar">
            AI
        </div>
        <div class="message-content">
            <strong>AI Assistant</strong>
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatBody.appendChild(typing);
    scrollToBottom();}

function removeTyping(){const typing = document.querySelector("#typing");
                        if(typing){typing.remove();}}

const services = [
    {
        id: 1,
        title: "AI Chatbots",
        icon: "bot.svg",
        description: "Smart AI assistants for your business."
    },
    {
        id: 2,
        title: "Web Development",
        icon: "globe.svg",
        description: "Modern websites with AI integration."
    },
    {
        id: 3,
        title: "Automation",
        icon: "chart.svg",
        description: "Automate repetitive business tasks."
    }
];

const servicesContainer = document.getElementById("servicesContainer");

services.forEach((service) => {
    servicesContainer.innerHTML += `
        <div class="card">
            <img src="assets/icons/${service.icon}" class="card-icon" alt="${service.title}">
            <h3>${service.title}</h3>
            <p>${service.description}</p>
        </div>
    `;
});


const chatWidget = document.querySelector("#chatWidget");

const chatToggle = document.querySelector("#chatToggle");

const closeChat = document.querySelector("#closeChat");

chatToggle.addEventListener("click", () => {chatWidget.classList.add("active");});

closeChat.addEventListener("click", () => {chatWidget.classList.remove("active");});
