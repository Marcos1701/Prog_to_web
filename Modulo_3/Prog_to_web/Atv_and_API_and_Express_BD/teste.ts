
const { Client } = require('pg')
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Aplicacao_bd',
    password: 'postgres',
    port: 5432,
});

const insert = async () => await client.query("INSERT INTO POST VALUES('uassdjdh','Teste', 0)")

const select = async () => {
    return await client.query("SELECT * FROM POST")
}

insert()

console.log(select())