
realizaLogin = async (nome_de_usuario, senha) => {
    let dados = {
        "nome_de_usuario": nome_de_usuario,
        "senha": senha
    }
    let url = "https://express-server-production-d5bc.up.railway.app/login"
    let header = {
        method: "POST",
        body: JSON.stringify(dados),
        headers: {
            "Content-type": "application/json"
        }
    }

    await fetch(url, header)
        .then(async response => {
            if (response.status == 200) {
                const json = await response.json()
                // console.log(json.id)
                localStorage.setItem("token", json.token)
                localStorage.setItem("id_usuario", json.id)
                localStorage.setItem("nome_de_usuario", nome_de_usuario)

                window.location = "blog.html"

            } else {
                response.text().then(texto => {
                    console.error(texto)
                    const msg_erro = document.getElementById("msg_erro-login")
                    msg_erro.innerText = texto
                })
            }
        })
}

realizaCadastro = (nome_de_usuario, senha) => {
    let dados = {
        "nome_de_usuario": nome_de_usuario,
        "senha": senha
    }
    let url = "https://express-server-production-d5bc.up.railway.app/usuarios"
    let header = {
        method: "POST",
        body: JSON.stringify(dados),
        headers: {
            "Content-type": "application/json"
        }
    }
    fetch(url, header).then(resposta => {
        if (resposta.status == 201) {

            resposta.json().then(json => {
                localStorage.setItem("token", json.token)
                localStorage.setItem("id_usuario", json.id)
                localStorage.setItem("nome_de_usuario", nome_de_usuario)
                window.location = "blog.html"
            })
        } else {
            console.log("Erro de cadastro!")
            resposta.text().then(texto => {
                console.error(texto)
                const msg_erro = document.getElementById("msg_erro-cadastro")
                msg_erro.innerText = texto
            })
        }
    })
}

window.onload = () => {
    let botao_login = document.getElementById("botao_login")
    botao_login.onclick = () => {
        let nome_de_usuario = document.getElementById("nome_usuario-login").value
        let senha = document.getElementById("senha_login").value
        realizaLogin(nome_de_usuario, senha)
    }

    let botao_cadastro = document.getElementById("botao_cadastro")
    botao_cadastro.onclick = () => {
        let nome_de_usuario = document.getElementById("nome_de_usuario-cadastro").value
        let senha = document.getElementById("senha_cadastro").value
        realizaCadastro(nome_de_usuario, senha)
    }
}