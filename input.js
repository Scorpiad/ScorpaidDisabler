// Replace with your actual Firebase config from the console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  projectId: "YOUR_PROJECT_ID",
  // ... rest of your config
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const chatBox = document.getElementById('chat-box');
const sendBtn = document.getElementById('send-btn');

// 1. Send Message to Firestore
sendBtn.onclick = () => {
    const user = document.getElementById('username').value || "Anonymous";
    const text = document.getElementById('message').value;
    
    if (text) {
        db.collection("messages").add({
            name: user,
            text: text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById('message').value = ""; // Clear input
    }
};

// 2. Listen for Real-time Updates
db.collection("messages").orderBy("timestamp")
    .onSnapshot((snapshot) => {
        chatBox.innerHTML = ""; // Clear for refresh
        snapshot.forEach((doc) => {
            const data = doc.data();
            const msgDiv = document.createElement('div');
            msgDiv.className = "msg";
            // Securely set text to avoid manual script injection
            msgDiv.textContent = `${data.name}: ${data.text}`;
            chatBox.appendChild(msgDiv);
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    });
