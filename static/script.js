const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const noteForm = document.getElementById('note-form');
const notesSection = document.querySelector('.notes-section');
const authSection = document.querySelector('.auth-section');
const notesList = document.getElementById('notes-list');
const logoutButton = document.getElementById('logout-button');

let accessToken = '';

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    const response = await fetch('/users/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        alert('Registration successful! Please log in.');
    } else {
        alert('Registration failed.');
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ username, password }),
    });

    if (response.ok) {
        const data = await response.json();
        accessToken = data.access_token;
        authSection.style.display = 'none';
        notesSection.style.display = 'block';
        loadNotes();
    } else {
        alert('Login failed.');
    }
});

noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;

    const response = await fetch('/notes/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
        loadNotes();
        noteForm.reset();
    } else {
        alert('Failed to add note.');
    }
});

logoutButton.addEventListener('click', () => {
    accessToken = '';
    notesSection.style.display = 'none';
    authSection.style.display = 'block';
});

async function loadNotes() {
    const response = await fetch('/notes/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (response.ok) {
        const notes = await response.json();
        notesList.innerHTML = '';
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');
            noteElement.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <div class="note-buttons">
                    <button class="edit" onclick="editNote(${note.id}, '${note.title}', '${note.content}')">Edit</button>
                    <button class="delete" onclick="deleteNote(${note.id})">Delete</button>
                </div>
            `;
            notesList.appendChild(noteElement);
        });
    } else {
        alert('Failed to load notes.');
    }
}

async function editNote(id, currentTitle, currentContent) {
    const newTitle = prompt('Edit Title:', currentTitle);
    const newContent = prompt('Edit Content:', currentContent);

    if (newTitle !== null && newContent !== null) {
        const response = await fetch(`/notes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ title: newTitle, content: newContent }),
        });

        if (response.ok) {
            loadNotes();
        } else {
            alert('Failed to edit note.');
        }
    }
}

async function deleteNote(id) {
    const response = await fetch(`/notes/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (response.ok) {
        loadNotes();
    } else {
        alert('Failed to delete note.');
    }
}
