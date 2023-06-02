import { client } from "./conf_bd_pg";


client.connect()
    .then(() => console.log("Banco de dados conectado com sucesso!!"))
    .catch((err) => console.log(`Erro ao conectar com o banco de dados: ${err.message}`))

// client.query(`
//     insert into postagens (id,title, text, likes,data_criacao) values ('121dsad','sla', 'qeeqwew', ${0}, DEFAULT)`)
//     .then(() => console.log("Postagem inserida com sucesso!!"))
//     .catch((err) => console.log(`Erro ao inserir postagem: ${err.message}`))

const posts = client.query(`
    select * from postagens`)
    .then((res) => console.log(res.rows))
    .catch((err) => console.log(`Erro ao buscar postagens: ${err.message}`))

    console.log(posts)