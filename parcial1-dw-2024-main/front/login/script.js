const username = document.getElementById("username");
const contraseña = document.getElementById("contraseña");

class Usuario {
    constructor(nombreUsuario, passw) {
        this.username = nombreUsuario;
        this.contraseña = passw;
    }
}
function validarUsername(input) {
    const email = input.value;
    if (email === '') {
        error(input, "Debe completar el campo email");
        return false;
    }
    return true;
}

function validarContraseña(input) {
    const password = input.value;
    if (password === '') {
        error(input, "Debe completar el campo contraseña");
        return false;
    }
    return true;
}

function error(input, errormessage) {
    const div = input.parentElement;
    const small = div.querySelector('small');
    small.innerText = errormessage;
    div.className = "divinputerror";
}

document.getElementById("LogInForm").addEventListener('submit', async function (event) {
    event.preventDefault();

    const usernameValido = validarUsername(username);
    const contraseñaValida = validarContraseña(contraseña);

    if (usernameValido && contraseñaValida) {
        var user = new Usuario(username.value, contraseña.value);
        await fetchPost(user);

        if (localStorage.getItem("token" != null) || localStorage.getItem("token") != undefined) {
            window.location.href = "../sistema/index.html"
        }
    }
});

async function fetchPost(persona) {
    try {
        const response = await fetch("http://localhost/back/auth", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(persona),
        })

        if (response.status === 400) {
            error(email, "");
            error(contraseña, "Su username o contraseña no es válido");
            email.value = "";
            contraseña.value = "";
            return;
        }

        if (!response.ok) {
            throw new Error("No funciona");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token)

    } catch (err) {
        console.log(err);
    }
}