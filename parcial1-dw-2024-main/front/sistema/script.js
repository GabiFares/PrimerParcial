const tareas = document.getElementById("tareas");
const deleteDialog = document.getElementById("deleteDialog");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");
let tareaToDelete = null;

var token = localStorage.getItem('token');

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
if (token == null || token == undefined) {
    if (getQueryParam('token') != null || getQueryParam('token') != undefined) {
        token = getQueryParam('token');
        localStorage.setItem('token', token);
    }
}



async function fetchget() {
    try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const response = await fetch("http://localhost/back/tareas", { headers });
        if (response.status === 401) {
            window.location.href = './form.html'
        }
        if (!response.ok) {
            throw new Error("No funciona");
        }
        const tareasList = await response.json();
        console.log(tareasList);

        tareas.innerHTML = '';

        tareasList.forEach(tarea => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${tarea.nombre}</td>
                <td>${tarea.duracion}</td> 
                <td class="action-buttons">
                    <button class="edit-btn" data-id="${tarea.id_usuario}">
                        <img src="edit-icon.png" alt="Editar">
                    </button>
                    <button class="delete-btn" data-id="${tarea.id_usuario}">
                        <img src="delete-icon.png" alt="Eliminar">
                    </button>
                </td>
            `
            tareas.appendChild(row);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                personToDelete = this.getAttribute('data-id');
                deleteDialog.style.display = 'flex';
            });
        });
    }
    catch (err) {
        console.log(err);
    }
}

confirmDeleteBtn.addEventListener('click', async function () {
    if (personToDelete) {
        try {

            const response = await fetch(`https://localhost/back/tareas/id_tarea/${tareaToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(tareaToDelete)
            });

            if (response.ok) {
                console.log('Tarea eliminada con éxito');
                await fetchget(); // Actualizar la lista después de eliminar
                localStorage.clear();
                window.location.href = './'
            } else {
                const errorData = await response.json();
                console.error('Error al eliminar la tarea:', errorData.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    deleteDialog.style.display = 'none';
});

cancelDeleteBtn.addEventListener('click', function () {
    deleteDialog.style.display = 'none';
});


fetchget();