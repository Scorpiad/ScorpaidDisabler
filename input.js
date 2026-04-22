// 1. Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 2. Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 3. UI References
const chatBox = document.getElementById('chat-box');
const sendBtn = document.getElementById('send-btn');
const messageInput = document.getElementById('message');
const usernameInput = document.getElementById('username');

// 4. Send Message Function
sendBtn.onclick = () => {
  const user = usernameInput.value || "Anonymous";
  const text = messageInput.value;

  if (text.trim() !== "") {
    db.collection("messages").add({
      name: user,
      text: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    messageInput.value = ""; // Clear input after sending
  }
};

// 5. Allow "Enter" key to send
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendBtn.click();
  }
});

// 6. Listen for Real-time Updates
db.collection("messages").orderBy("timestamp")
  .onSnapshot((snapshot) => {
    chatBox.innerHTML = ""; // Clear for refresh
    snapshot.forEach((doc) => {
      const data = doc.data();
      const msgDiv = document.createElement('div');
      msgDiv.className = "msg";
      
      // Use textContent to prevent XSS (Security)
      msgDiv.textContent = `${data.name}: ${data.text}`;
      chatBox.appendChild(msgDiv);
    });
    // Auto-scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
  });
