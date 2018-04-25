



$(function() {
    let lastId;
    const textArea = document.getElementById('texts');
    const sendButton = document.getElementById('send');
    const testToSend = document.getElementById('textToSend');

    const genElemnt = (messange) => {
        let user = document.createElement('DIV');

        let time = document.createElement('DIV');
        textArea.appendChild(time);
        textArea.appendChild(user);
        let messege = document.createElement('DIV');
        textArea.appendChild(messege);

        time.innerText = '['+messange.time+']';
        user.innerText = '<'+messange.user+'>';
        user.style.color = messange.color;
        messege.innerHTML = messange.message;
        messege.classList.add('mess');
    }
    $.ajax({
        url: '/api/send/get_all',
        success: (data) => {
            console.log(data);
            console.log(data);
            data = JSON.parse(data);
            data.forEach(value => {
                genElemnt(value);
            });
            console.log(data[data.length-1]);
            lastId = data[data.length-1]._id;
            textArea.scrollTop = textArea.scrollHeight;
        },
        error: (err) => {
            console.log(err);
        }
    });

    var poll = function () {
        $.ajax({
            url: "/api/poll",
            success: function(data){
                console.log(data); // { text: "Some data" } -> will be printed in your browser console every 5 seconds
                genElemnt(data.messange);
                textArea.scrollTop = textArea.scrollHeight;
                setTimeout(poll, 500);
            },
            error: function() {
                poll();
            }// 30 seconds
        });
    };

// Make sure to call it once first,
    poll();

    const send = function(dataToSend) {
        $.ajax({
            type: "POST",
            url: "/api/send",
            data: JSON.stringify(dataToSend),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(data){
                console.log(data); // { text: "Some data" } -> will be printed in your browser console every 5 seconds
            },
            error: function() {
                console.log('błąd');
            }
        });
    };
    testToSend.onkeypress = (e) => {
        if(e.keyCode == 13 && e.target.value != "") {
            send({user: Cookies.get('login'), message: e.target.value, time: ("0" + new Date().getHours()).substring(-2)  + ":" + ("0" + new Date().getMinutes()).substring(-2), color: Cookies.get('color')});
            e.target.value = "";
        }
    }

    sendButton.onclick = (e) => {
        if(testToSend.value != ""){
            // let h = "0" + new Date().getHours()
            send({user: Cookies.get('login'), message: testToSend.value, time: ("0" + new Date().getHours()).substr(-2)  + ":" + ("0" + new Date().getMinutes()).substr(-2), color: Cookies.get('color')});
            testToSend.value = "";
        }
    }

});