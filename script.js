/* script.js */
const apiUrl = 'https://jsonplaceholder.typicode.com/users';
const userTable = document.querySelector('#userTable tbody');
const userForm = document.getElementById('userForm');
const errorDiv = document.getElementById('error');

async function fetchUsers() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch users');
        const users = await response.json();
        userTable.innerHTML = '';
        users.forEach(user => {
            userTable.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name.split(' ')[0]}</td>
                    <td>${user.name.split(' ')[1] || ''}</td>
                    <td>${user.email}</td>
                    <td>${user.company.name}</td>
                    <td>
                        <button onclick="editUser(${user.id}, '${user.name}', '${user.email}', '${user.company.name}')">Edit</button>
                        <button onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        errorDiv.textContent = error.message;
    }
}

async function addUser(user) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        if (!response.ok) throw new Error('Failed to add user');
        await fetchUsers();
    } catch (error) {
        errorDiv.textContent = error.message;
    }
}

async function editUser(id, name, email, department) {
    document.getElementById('userId').value = id;
    document.getElementById('firstName').value = name.split(' ')[0];
    document.getElementById('lastName').value = name.split(' ')[1] || '';
    document.getElementById('email').value = email;
    document.getElementById('department').value = department;
}

async function updateUser(id, user) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        if (!response.ok) throw new Error('Failed to update user');
        await fetchUsers();
    } catch (error) {
        errorDiv.textContent = error.message;
    }
}

async function deleteUser(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete user');
        await fetchUsers();
    } catch (error) {
        errorDiv.textContent = error.message;
    }
}

userForm.addEventListener('submit', async event => {
    event.preventDefault();
    const id = document.getElementById('userId').value;
    const user = {
        name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
        email: document.getElementById('email').value,
        company: { name: document.getElementById('department').value }
    };
    if (id) {
        await updateUser(id, user);
    } else {
        await addUser(user);
    }
    userForm.reset();
});

fetchUsers();