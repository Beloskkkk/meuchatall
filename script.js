let username = '';
let friends = [];
let avatarUrl = '';
let userKey = '';
let ws;

// Conectar ao WebSocket
connectWebSocket();

function connectWebSocket() {
    ws = new WebSocket('ws://localhost:3000'); // Substitua pelo seu endpoint WebSocket

    ws.onopen = function() {
        console.log('Conectado ao servidor WebSocket');
    };

    ws.onmessage = function(event) {
        const message = JSON.parse(event.data);
        handleIncomingMessage(message);
    };

    ws.onerror = function(error) {
        console.error('Erro ao conectar WebSocket:', error);
    };

    ws.onclose = function() {
        console.log('Conexão WebSocket fechada');
    };
}

function handleIncomingMessage(message) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message');

    if (message.text) {
        const textMessage = document.createElement('div');
        textMessage.textContent = message.text;
        messageContainer.appendChild(textMessage);
    }

    if (message.fileUrl) {
        const fileMessage = document.createElement('div');
        if (message.fileType.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = message.fileUrl;
            img.style.maxWidth = '100%';
            fileMessage.appendChild(img);
        } else if (message.fileType.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = message.fileUrl;
            video.controls = true;
            video.style.maxWidth = '100%';
            fileMessage.appendChild(video);
        } else if (message.fileType.startsWith('audio/')) {
            const audio = document.createElement('audio');
            audio.src = message.fileUrl;
            audio.controls = true;
            fileMessage.appendChild(audio);
        } else {
            const link = document.createElement('a');
            link.href = message.fileUrl;
            link.textContent = 'Download ' + message.fileName;
            fileMessage.appendChild(link);
        }

        messageContainer.appendChild(fileMessage);
    }

    document.getElementById('chat-messages').appendChild(messageContainer);
    messageContainer.scrollIntoView({ behavior: 'smooth' });
}

function chooseOption(option) {
    document.getElementById('menu-container').style.display = 'none';
    if (option === 'login') {
        document.getElementById('login-container').style.display = 'flex';
    } else if (option === 'signup') {
        document.getElementById('signup-container').style.display = 'flex';
    }
}

function backToMenu() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('signup-container').style.display = 'none';
    document.getElementById('menu-container').style.display = 'flex';
}

function login() {
    username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Simulação de autenticação básica (não recomendado para uso real)
    if (username && password === 'senha') {
        userKey = generateUserKey(); // Gerar código único para o usuário
        localStorage.setItem('username', username);
        localStorage.setItem('userKey', userKey);
        showMainContent();
    } else {
        alert('Usuário ou senha incorretos. Tente novamente.');
    }
}

function signup() {
    const newUsername = document.getElementById('new-username').value.trim();
    const newPassword = document.getElementById('new-password').value.trim();
    
    // Simulação de criação de conta (não recomendado para uso real)
    if (newUsername && newPassword) {
        username = newUsername;
        userKey = generateUserKey(); // Gerar código único para o usuário
        localStorage.setItem('username', username);
        localStorage.setItem('userKey', userKey);
        showMainContent();
    } else {
        alert('Preencha todos os campos.');
    }
}

function generateUserKey() {
    // Função simples para gerar um código único (não é realmente seguro)
    return Math.random().toString(36).substr(2, 9);
}

function showMainContent() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('signup-container').style.display = 'none';
    document.getElementById('main-container').style.display = 'flex';
    document.getElementById('friend-list').innerHTML = '<div>Bem-vindo, ' + username + '!</div>';
}

function logout() {
    username = '';
    userKey = '';
    localStorage.removeItem('username');
    localStorage.removeItem('userKey');
    document.getElementById('main-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('signup-container').style.display = 'none';
    document.getElementById('menu-container').style.display = 'flex';

    // Fechar conexão WebSocket ao fazer logout
    ws.close();
}

function changeAvatar() {
    const avatarInput = document.getElementById('avatar-input');
    const file = avatarInput.files[0];
    
    if (file) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            avatarUrl = event.target.result;
            alert('Foto de perfil alterada com sucesso!');
        };
        fileReader.readAsDataURL(file);
    }
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();

    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (message || file) {
        const messageData = {
            username: username,
            text: message,
            fileUrl: '',
            fileType: '',
            fileName: ''
        };

        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = function(event) {
                messageData.fileUrl = event.target.result;
                messageData.fileType = file.type;
                messageData.fileName = file.name;
                ws.send(JSON.stringify(messageData));
            };
            fileReader.readAsDataURL(file);
        } else {
            ws.send(JSON.stringify(messageData));
        }

        input.value = '';
        fileInput.value = '';
        input.focus();
    }
}

document.getElementById('message-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
