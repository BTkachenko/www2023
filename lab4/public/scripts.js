const apiUrl = 'http://localhost:3000';
let token;

document.getElementById('loginButton').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const response = await axios.post(apiUrl + '/login', { email, password });
    token = response.data.token;
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('notesApp').style.display = 'block';
    loadNotes();
  } catch (error) {
    alert('Nieprawidłowy email lub hasło');
  }
});

document.getElementById('registerButton').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await axios.post(apiUrl + '/register', { email, password });
    alert('Rejestracja zakończona powodzeniem');
  } catch (error) {
    alert('Błąd rejestracji');
  }
});

document.getElementById('saveButton').addEventListener('click', async () => {
  const title = document.getElementById('noteTitle').value;
  const content = document.getElementById('noteContent').value;
  try {
    await axios.post(apiUrl + '/note', { title, content }, { headers: { 'Authorization': 'Bearer ' + token } });
    loadNotes();
  } catch (error) {
    alert('Błąd zapisu notatki');
  }
});

document.getElementById('logoutButton').addEventListener('click', () => {
  // Usuń token z pamięci przeglądarki
  localStorage.removeItem('token');

  // Przekieruj użytkownika na stronę logowania lub stronę główną
  window.location.href =  '/index.html' 
});

async function loadNotes() {
    try {
        const response = await axios.get(apiUrl + '/note', { headers: { 'Authorization': 'Bearer ' + token } });
        const notes = response.data;
        const notesList = document.getElementById('notesList');
        notesList.innerHTML = '';
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.innerHTML = `
              <h2>${note.title}</h2>
              <p>${note.content}</p>
              <button onclick="deleteNote('${note._id}')">Usuń</button>
              <button onclick="editNote('${note._id}')">Edytuj</button>
            `;
            notesList.appendChild(noteElement);
          });} catch (error) {
            alert('Błąd ładowania notatek');
            }
            }
            
            async function deleteNote(id) {
            try {
            await axios.delete(apiUrl + '/note/' + id, { headers: { 'Authorization': 'Bearer ' + token } });
            loadNotes();
            } catch (error) {
            alert('Błąd usuwania notatki');
            }
            }
            
            async function editNote(id) {
            const title = prompt('Podaj nowy tytuł notatki:');
            const content = prompt('Podaj nową treść notatki:');
            try {
            await axios.put(apiUrl + '/note/' + id, { title, content }, { headers: { 'Authorization': 'Bearer ' + token } });
            loadNotes();
            } catch (error) {
            alert('Błąd edycji notatki');
    }
}