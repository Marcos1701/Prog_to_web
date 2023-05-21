"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComentario = exports.deleteComentario = exports.retrieveComentario = exports.retrieveComentarios = exports.insertComentario = exports.curtirPostagem = exports.deletePostagem = exports.updatePostagem = exports.retrieveAllPostagens = exports.retrievePostagem = exports.insertPostagem = exports.createTable = exports.openDb = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
async function openDb() {
    return (0, sqlite_1.open)({
        filename: './app.db',
        driver: sqlite3_1.default.Database
    });
}
exports.openDb = openDb;
async function createTable() {
    const db = await openDb();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS postagens (
            id TEXT PRIMARY KEY,
            text TEXT NOT NULL,
            likes INTEGER
        );
    `);
    await db.exec(`
        CREATE TABLE IF NOT EXISTS comentarios (
            id TEXT PRIMARY KEY,
            text TEXT NOT NULL,
            postagem_id TEXT NOT NULL,
            FOREIGN KEY (postagem_id) REFERENCES postagens(id)
        );
    `);
}
exports.createTable = createTable;
async function insertPostagem(id, text, likes) {
    const db = await openDb();
    await db.run(`
        INSERT INTO postagens (id, text, likes) VALUES ('${id}', '${text}', ${likes})
    `);
}
exports.insertPostagem = insertPostagem;
async function retrievePostagem(id) {
    const db = await openDb();
    const postagem = await db.get(`
        SELECT * FROM postagens WHERE id = '${id}'
    `).then((row) => {
        return row;
    }).catch((err) => {
        console.log(err);
    });
    if (postagem) {
        return postagem;
    }
    else {
        throw new Error("Postagem não encontrada");
    }
}
exports.retrievePostagem = retrievePostagem;
async function retrieveAllPostagens() {
    const db = await openDb();
    const postagens = await db.all(`
        SELECT * FROM postagens
    `).then((rows) => {
        return rows;
    });
    return postagens;
}
exports.retrieveAllPostagens = retrieveAllPostagens;
async function updatePostagem(id, text, likes) {
    const db = await openDb();
    await db.run(`
        UPDATE postagens SET text = '${text}', likes = ${likes} WHERE id = '${id}'
    `);
}
exports.updatePostagem = updatePostagem;
async function deletePostagem(id) {
    const db = await openDb();
    await db.run(`
        DELETE FROM postagens WHERE id = '${id}'
    `).then((row) => {
        return row;
    }).catch((err) => {
        console.log(err);
    });
}
exports.deletePostagem = deletePostagem;
async function curtirPostagem(id) {
    const db = await openDb();
    await db.run(`
        UPDATE postagens SET likes = likes + 1 WHERE id = '${id}'
    `);
}
exports.curtirPostagem = curtirPostagem;
async function insertComentario(id, text, postagem_id) {
    const db = await openDb();
    await db.run(`
        INSERT INTO comentarios (id, text, postagem_id) VALUES ('${id}', '${text}', '${postagem_id}')
    `);
}
exports.insertComentario = insertComentario;
async function retrieveComentarios(postagem_id) {
    const db = await openDb();
    const comentarios = await db.all(`
        SELECT * FROM comentarios WHERE postagem_id = '${postagem_id}'
    `).then((rows) => {
        return rows;
    });
    return comentarios;
}
exports.retrieveComentarios = retrieveComentarios;
async function retrieveComentario(id_postagem, id) {
    const db = await openDb();
    const comentario = await db.get(`
        SELECT * FROM comentarios WHERE id = '${id}' AND postagem_id = '${id_postagem}'
    `).then((row) => {
        return row;
    }).catch((err) => {
        console.log(err);
    });
    if (!comentario) {
        throw new Error("Comentário não encontrado");
    }
    return comentario;
}
exports.retrieveComentario = retrieveComentario;
async function deleteComentario(id_postagem, id) {
    const db = await openDb();
    await db.run(`
        DELETE FROM comentarios WHERE id = '${id}' AND postagem_id = '${id_postagem}'
    `);
}
exports.deleteComentario = deleteComentario;
async function updateComentario(id_postagem, id, text) {
    const db = await openDb();
    await db.run(`
        UPDATE comentarios SET text = '${text}' WHERE id = '${id}' AND postagem_id = '${id_postagem}'
    `);
}
exports.updateComentario = updateComentario;
