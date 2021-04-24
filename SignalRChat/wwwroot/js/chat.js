"use strict";
var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;
connection.on("ReceiveMessage", function (user, message) {
    if(user!=""){
        var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var encodedMsg = user + ": " + msg;
        var li = document.createElement("li");
        li.textContent = encodedMsg;
        document.getElementById("messagesList").appendChild(li);
    }
    
});
connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});
//send message when pressing send button
document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    let message = document.getElementById("messageInput");
    if(message.value !=""){
       connection.invoke("SendMessage", user, message.value).catch(function (err) {
        return console.error(err.toString());
        });
        message.value="" 
    }
    
    event.preventDefault();
});

//send message when pressing enter
window.addEventListener("keydown", function (event) {
    var user = document.getElementById("userInput").value;
    let message = document.getElementById("messageInput");
    if(event.key=="Enter" && message.value !="")
    {
        connection.invoke("SendMessage", user, message.value).catch(function (err) {
            return console.error(err.toString());
        });
        message.value=""
        event.preventDefault();
    }
});