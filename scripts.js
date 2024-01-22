/*----------------------------Para websocket chat de la video llamada-------------------------------*/
(function () {
    const sendBtn = document.querySelector('#send');
    const messages = document.querySelector('#messages');
    const messageBox = document.querySelector('#messageBox');
    const usernameBox = document.querySelector('#username');

    let ws;

    function showMessage(message) {
        messages.textContent += `\n\n${message}`;
        messages.scrollTop = messages.scrollHeight;
        messageBox.value = '';
    }

    function init() {
        if (ws) {
            ws.onerror = ws.onopen = ws.onclose = null;
            ws.close();
        }

        ws = new WebSocket('ws://localhost:3000');
        ws.onopen = () => {
            console.log('Connection opened!');
        }
        ws.onmessage = (event) => {
            if (typeof event.data === 'string') {
                showMessage(event.data);
            } else {
                const reader = new FileReader();
                reader.onload = function () {
                    showMessage(reader.result);
                };
                reader.readAsText(event.data);
            }
        };
        ws.onclose = function () {
            ws = null;
        }
    }

    sendBtn.onclick = function () {
        if (!ws) {
            showMessage("No WebSocket connection :(", 'Error');
            return;
        }

        const message = {
            username: usernameBox.value,
            content: messageBox.value
        };

        showMessage(message.content, message.username);
        ws.send(JSON.stringify(message));
    }

    init();
})();
/*----------------------------Short Polling para actualizar los eventos-----------------------------*/