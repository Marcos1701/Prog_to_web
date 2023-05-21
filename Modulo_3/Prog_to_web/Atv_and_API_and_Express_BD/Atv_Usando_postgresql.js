"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const port = 3000;
const uuid_1 = require("uuid");
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Aplicacao_bd',
    password: 'postgres',
    port: 5432,
});
class Postagem {
    id;
    text;
    likes;
    constructor(id, text, likes) {
        this.id = id;
        this.text = text;
        this.likes = likes ? likes : 0;
    }
    curtir() {
        this.likes++;
    }
    toString() {
        let aux = `
        id Postagem: ${this.id}
        Quantidade de curtidas: ${this.likes}
        texto inserido: ${this.text}
        `;
        return aux;
    }
}
class microBlog {
    Postagens = [];
    create(postagem) {
        if (this.retrieve(postagem.id) == -1) {
            this.Postagens.push(postagem);
        }
        else {
            console.log("Postagem já existe!!");
        }
    }
    curtir_postagem(id) {
        let index = this.retrieve(id);
        if (index != -1) {
            this.Postagens[index].curtir();
            return 200;
        }
        return 404;
    }
    retrieve(id) {
        let index = -1;
        for (let i = 0; i < this.Postagens.length; i++) {
            if (this.Postagens[i].id == id) {
                index = i;
                break;
            }
        }
        return index;
    }
    delete(id) {
        let index = this.retrieve(id);
        if (index != -1) {
            this.Postagens.splice(index, 1);
        }
    }
    update(postagem) {
        let index = this.retrieve(postagem.id);
        if (index != -1) {
            this.Postagens[index] = postagem;
        }
    }
    retrieveAll() {
        return this.Postagens;
    }
    toString_geral() {
        let aux = '';
        for (let postagem of this.Postagens) {
            aux += postagem.toString();
        }
        return aux;
    }
    get_postagem(index) {
        return this.Postagens[index];
    }
}
class MicroblogPersistente {
    constructor() {
        pool.connect();
    }
    async create(postagem) {
        if (!(await this.retrieve(postagem.id))) {
            try {
                await pool.query(`INSERT INTO post VALUES('${postagem.id}','${postagem.text}', ${postagem.likes})`);
            }
            catch (err) {
                console.error(err.message);
            }
        }
    }
    async curtir_postagem(id) {
        if (await this.retrieve(id)) {
            try {
                await pool.query(`UPDATE post SET likes = likes + 1 WHERE id = '${id}'`);
                return 200;
            }
            catch (err) {
                console.error(err.message);
            }
        }
        return 404;
    }
    async retrieve(id) {
        try {
            const retorno = await pool.query(`SELECT * FROM post WHERE id ilike '${id}'`);
            if (retorno.rows.length == 1) {
                return true;
            }
        }
        catch (err) {
            console.error(err.message);
        }
        return false;
    }
    async delete(id) {
        if (await this.retrieve(id)) {
            try {
                await pool.query(`DELETE FROM post WHERE id = '${id}'`);
                return true;
            }
            catch (err) {
                console.error(err.message);
            }
        }
        return false;
    }
    async update(postagem) {
        try {
            if (await this.retrieve(postagem.id)) {
                await pool.query(`UPDATE post SET text = '${postagem.text}', likes = ${postagem.likes} WHERE id = '${postagem.id}'`);
                console.log(`Postagem com id ${postagem.id} atualizada com sucesso`);
                return true;
            }
        }
        catch (err) {
            console.error(err);
        }
        return false;
    }
    async retrieveAll() {
        try {
            const retorno = await pool.query(`SELECT * FROM post`);
            let postagens = [];
            for (let postagem of retorno.rows) {
                postagens.push(new Postagem(postagem.id, postagem.text, postagem.likes));
            }
            console.log(`Postagens recuperadas com sucesso`);
            return postagens;
        }
        catch (err) {
            console.error(err);
        }
        return [];
    }
    async get_postagem(id) {
        let postagem_retorno;
        try {
            const retorno = await pool.query(`SELECT * FROM post WHERE id = '${id}'`);
            postagem_retorno = new Postagem(retorno.rows[0].id, retorno.rows[0].text, retorno.rows[0].likes);
            console.log(`Postagem com id ${id} recuperada com sucesso`);
        }
        catch (err) {
            console.error(err);
        }
        return postagem_retorno;
    }
}
let blog = new MicroblogPersistente();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/', (request, response) => {
    response.send('Bem vindo ao microblog!!');
});
app.get('/posts', async (request, response) => {
    try {
        const postagens = await blog.retrieveAll();
        response.json({ Postagens: postagens });
    }
    catch (err) {
        console.error(err);
        response.sendStatus(500);
    }
});
app.get('/posts/:id', async (request, response) => {
    let id = request.params.id;
    try {
        if (await blog.retrieve(id)) {
            const postagem = await blog.get_postagem(id);
            response.json({ Postagem: postagem });
        }
        else {
            response.status(404);
        }
    }
    catch (err) {
        console.error(err);
        response.sendStatus(500);
    }
});
app.delete('/posts/:id', async (request, response) => {
    let id = request.params.id;
    if (await blog.delete(id)) {
        response.sendStatus(200);
    }
    else {
        response.sendStatus(404);
    }
});
app.post('/posts', async (request, response) => {
    let postagem = new Postagem((0, uuid_1.v4)(), request.body.text);
    await blog.create(postagem);
    response.sendStatus(200);
});
app.put('/posts/:id/like', async (request, response) => {
    let id = request.params.id;
    if (await blog.curtir_postagem(id) === 200) {
        response.sendStatus(200);
    }
    else {
        response.sendStatus(404);
    }
});
app.patch('/posts/:id', async (request, response) => {
    let id = request.params.id;
    const postagem_antiga = await blog.get_postagem(id);
    let postagem = new Postagem(id, request.body.text ? request.body.text : postagem_antiga.text, request.body.likes ? request.body.likes : postagem_antiga.likes);
    if (await blog.update(postagem)) {
        response.sendStatus(200);
    }
    else {
        response.sendStatus(404);
    }
});
app.patch('/posts/:id/like', async (request, response) => {
    let id = request.body.id;
    if (await blog.retrieve(id)) {
        if (await blog.curtir_postagem(id) == 200) {
            response.sendStatus(200);
        }
    }
    else {
        response.sendStatus(404);
    }
});
app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});
app.listen(port, () => {
    console.log('Servidor rodando');
});
