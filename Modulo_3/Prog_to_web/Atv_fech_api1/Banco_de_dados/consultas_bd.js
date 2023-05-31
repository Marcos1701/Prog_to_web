"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComentario = exports.updateComentario = exports.retrieveAllComentariostoPostagem = exports.retrieveComentario = exports.insertComentario = exports.curtirPostagem = exports.deletePostagem = exports.updatePostagem = exports.retrieveAllPostagens = exports.retrievePostagem = exports.insertPostagem = void 0;
const conf_bd_pg_js_1 = require("./conf_bd_pg.js");
const uuid_1 = require("uuid");
const validaid = (id) => {
    if (id === '' || id === undefined || id === null) {
        return false;
    }
    return true;
};
(async () => {
    try {
        await conf_bd_pg_js_1.client.connect();
        await conf_bd_pg_js_1.client.query(`
        CREATE TABLE IF NOT EXISTS postagens (
         id varchar not null PRIMARY KEY,
         text varchar NOT NULL,
         likes INT
        )
    `);
        await conf_bd_pg_js_1.client.query(`
    CREATE TABLE IF NOT EXISTS comentarios (
        id varchar PRIMARY KEY,
        text varchar NOT NULL,
        postagem_id varchar NOT NULL,
        FOREIGN KEY (postagem_id) REFERENCES postagens(id)
    );
    `);
        console.log("Banco de dados conectado com sucesso!!");
        // console.log("Tabelas criadas com sucesso!")
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao criar tabelas: ${err.message}`);
        }
    }
})();
async function insertPostagem(req, res) {
    const { text, likes } = req.body;
    try {
        await conf_bd_pg_js_1.client.query(`
        INSERT INTO postagens (id, text, likes) VALUES ('${(0, uuid_1.v4)()}', '${text}', ${likes})`);
        res.sendStatus(201);
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao inserir postagem: ${err.message}`);
            res.sendStatus(400);
        }
    }
}
exports.insertPostagem = insertPostagem;
async function retrievePostagem(req, res) {
    const { id } = req.params;
    if (!validaid(id)) {
        res.send({
            "erro": "id inválido",
            "StatusCode": "400"
        });
    }
    try {
        const postagem = await conf_bd_pg_js_1.client.query(`
        SELECT * FROM postagens WHERE id = '${id}'`);
        res.send({ "postagem": postagem.rows });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao buscar postagem: ${err.message}`);
            res.sendStatus(400);
        }
    }
}
exports.retrievePostagem = retrievePostagem;
async function retrieveAllPostagens(req, res) {
    try {
        const postagens = await conf_bd_pg_js_1.client.query(`
        SELECT * FROM postagens`);
        res.send({ "postagens: ": postagens.rows });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao buscar postagens: ${err.message}`);
            res.sendStatus(400);
        }
    }
}
exports.retrieveAllPostagens = retrieveAllPostagens;
async function updatePostagem(req, res) {
    const { id } = req.params;
    const { text, likes } = req.body;
    if (!text && !likes || !validaid(id)) {
        res.sendStatus(400);
    }
    try {
        if (likes) {
            await conf_bd_pg_js_1.client.query(`
            UPDATE postagens SET text = '${text}', likes = ${likes} WHERE id = '${id}'`);
        }
        else {
            await conf_bd_pg_js_1.client.query(`
            UPDATE postagens SET text = '${text}' WHERE id = '${id}'`);
        }
        res.sendStatus(200);
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao atualizar postagem: ${err.message}`);
            res.sendStatus(400);
        }
    }
}
exports.updatePostagem = updatePostagem;
async function deletePostagem(req, res) {
    const { id } = req.params;
    if (!validaid(id)) {
        res.sendStatus(400);
    }
    try {
        await conf_bd_pg_js_1.client.query(`
        DELETE FROM postagens WHERE id = '${id}'`);
        res.sendStatus(200);
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao deletar postagem: ${err.message}`);
            res.sendStatus(400);
        }
    }
}
exports.deletePostagem = deletePostagem;
async function curtirPostagem(req, res) {
    const { id } = req.params;
    if (!validaid(id)) {
        res.sendStatus(400);
    }
    try {
        await conf_bd_pg_js_1.client.query(`
        UPDATE postagens SET likes = likes + 1 WHERE id = '${id}'`);
        res.sendStatus(200);
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao curtir postagem: ${err.message}`);
            res.sendStatus(400);
        }
    }
}
exports.curtirPostagem = curtirPostagem;
async function insertComentario(req, res) {
    const { text, postagem_id } = req.body;
    if (!validaid(postagem_id)) {
        res.sendStatus(400);
    }
    try {
        await conf_bd_pg_js_1.client.query(`
        INSERT INTO comentarios (id, text, postagem_id) VALUES ('${(0, uuid_1.v4)()}', '${text}', '${postagem_id}')`);
        res.sendStatus(201);
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao inserir comentario: ${err.message}`);
            res.sendStatus(400);
        }
    }
}
exports.insertComentario = insertComentario;
async function retrieveComentario(req, res) {
    const { id } = req.params;
    if (!validaid(id)) {
        res.send({
            "erro": "id inválido",
            "StatusCode": "400"
        });
    }
    try {
        const comentario = await conf_bd_pg_js_1.client.query(`
        SELECT * FROM comentarios WHERE id = '${id}'`);
        res.send({ "comentario": comentario.rows });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao buscar comentario: ${err.message}`);
            res.sendStatus(400);
        }
    }
}
exports.retrieveComentario = retrieveComentario;
async function retrieveAllComentariostoPostagem(req, res) {
    const { postagem_id } = req.params;
    if (!validaid(postagem_id)) {
        res.send({
            "erro": "id inválido",
            "StatusCode": "400"
        });
    }
    try {
        const comentarios = await conf_bd_pg_js_1.client.query(`
        SELECT * FROM comentarios WHERE postagem_id = '${postagem_id}'`);
        res.send({ "comentarios": comentarios.rows });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao buscar comentarios: ${err.message}`);
            res.sendStatus(400);
        }
    }
}
exports.retrieveAllComentariostoPostagem = retrieveAllComentariostoPostagem;
async function updateComentario(req, res) {
    const { id } = req.params;
    const { text } = req.body;
    if (!text || !validaid(id)) {
        res.sendStatus(400);
    }
    try {
        await conf_bd_pg_js_1.client.query(`
        UPDATE comentarios SET text = '${text}' WHERE id = '${id}'`);
        res.sendStatus(200);
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao atualizar comentario: ${err.message}`);
            res.sendStatus(400);
        }
    }
}
exports.updateComentario = updateComentario;
async function deleteComentario(req, res) {
    const { id } = req.params;
    if (!validaid(id)) {
        res.sendStatus(400);
    }
    try {
        await conf_bd_pg_js_1.client.query(`
        DELETE FROM comentarios WHERE id = '${id}'`);
        res.sendStatus(200);
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao deletar comentario: ${err.message}`);
            res.sendStatus(400);
        }
    }
}
exports.deleteComentario = deleteComentario;
