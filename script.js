// ===== FIREBASE SETUP =====
const firebaseConfig = {
  apiKey: "AIzaSyBA6nYWZxP23e9c0FQAeNjiuqj4xkL-P9o",
  authDomain: "codefurry.firebaseapp.com",
  projectId: "codefurry",
  storageBucket: "codefurry.firebasestorage.app",
  messagingSenderId: "346387659425",
  appId: "1:346387659425:web:6ead8fb94863603b348ee0"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const tasksCollection = db.collection("tasks");

// ===== BACKEND (talks to real Firebase database now) =====
function backend_addTask(text){
  tasksCollection.add({ text: text, createdAt: Date.now() });
  // no need to manually refresh — the listener below does it automatically
}

function backend_deleteTask(id){
  tasksCollection.doc(id).delete();
}

// ===== FRONTEND =====
const form = document.getElementById('todoForm');
const input = document.getElementById('taskInput');
const list = document.getElementById('taskList');

form.addEventListener('submit', function(e){
  e.preventDefault();
  const text = input.value.trim();
  if(!text) return;
  backend_addTask(text);
  input.value = '';
});

// ===== LIVE LISTENER =====
// This automatically updates the list whenever the database changes —
// even if a teammate adds a task from their own laptop!
tasksCollection.orderBy("createdAt").onSnapshot((snapshot) => {
  list.innerHTML = '';
  snapshot.forEach((doc) => {
    const task = doc.data();
    const li = document.createElement('li');
    li.innerHTML = `<span>${task.text}</span>
      <button onclick="backend_deleteTask('${doc.id}')">delete</button>`;
    list.appendChild(li);
  });
});