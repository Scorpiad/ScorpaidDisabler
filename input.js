// 1. Your Firebase Configuration (COPY THIS FROM FIREBASE CONSOLE)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// 2. Initialize Firebase and Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 3. UI Element References
const chatBox = document.getElementById('chat-box');
const sendBtn = document.getElementById('send-btn');
const messageInput = document.getElementById('message');
const usernameInput = document.getElementById('username');

// 4. Function to Send Message
const sendMessage = () => {
    const user = usernameInput.value.trim() || "Anonymous";
    const text = messageInput.value.trim();

    if (text !== "") {
        db.collection("messages").add({
            name: user,
            text: text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            messageInput.value = ""; // Clear input on success
        })
        .catch((error) => {
            console.error("Error sending message: ", error);
        });
    }
};

// Trigger send on Click
sendBtn.onclick = sendMessage;

// Trigger send on "Enter" key
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// 5. Listen for Real-time Updates
db.collection("messages")
    .orderBy("timestamp", "asc") // Sort by time so new messages are at bottom
    .onSnapshot((snapshot) => {
        chatBox.innerHTML = ""; // Clear existing messages to prevent duplicates
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            const msgDiv = document.createElement('div');
            msgDiv.className = "msg";
            
            // Securely set text to avoid script injection (XSS)
            msgDiv.textContent = `${data.name}: ${data.text}`;
            chatBox.appendChild(msgDiv);
        });

        // Auto-scroll to the latest message
        chatBox.scrollTop = chatBox.scrollHeight;
    });
