"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComentario = exports.deleteComentario = exports.insertComentario = exports.retrieveComentario = exports.retrieveAllComentariostoPostagem = exports.deletePostagem = exports.updatePostagem = exports.curtirPostagem = exports.retrieveAllPostagens = exports.retrievePostagem = exports.insertPostagem = void 0;
const conf_bd_1 = require("./conf_bd");
(async () => await (0, conf_bd_1.openDb)())().then((db) => {
    db.exec(`
    CREATE TABLE IF NOT EXISTS postagens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        text TEXT NOT NULL,
        likes INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS comentarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_post INTEGER NOT NULL,
        text TEXT NOT NULL,
        FOREIGN KEY (id_post) REFERENCES postagens(id)
    );
    `);
    console.log("Banco de dados criado com sucesso!");
    return db;
}).catch((err) => {
    if (err instanceof Error) {
        console.log(`Erro ao criar o banco de dados: ${err.message}`);
    }
    return null;
});
async function insertPostagem(req, res) {
    const { title, text } = req.body;
    const db = await (0, conf_bd_1.openDb)();
    await db.run('INSERT INTO postagens (title, text) VALUES (?, ?)', [title, text]).then((postagem) => {
        res.status(201).json({ postagem: postagem.lastID });
    }).catch((err) => {
        res.status(400).json({ error: err.message });
    });
}
exports.insertPostagem = insertPostagem;
async function retrievePostagem(req, res) {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "ID não informado" });
    }
    const db = await (0, conf_bd_1.openDb)();
    await db.get('SELECT * FROM postagens WHERE id = ?', [id]).then((postagem) => {
        res.json(postagem);
    }).catch((err) => {
        res.status(400).json({ error: err.message });
    });
}
exports.retrievePostagem = retrievePostagem;
async function retrieveAllPostagens(req, res) {
    const db = await (0, conf_bd_1.openDb)();
    await db.all('SELECT * FROM postagens').then((postagens) => {
        res.json(postagens);
    }).catch((err) => {
        res.status(400).json({ error: err.message });
    });
}
exports.retrieveAllPostagens = retrieveAllPostagens;
async function curtirPostagem(req, res) {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "ID não informado" });
    }
    const db = await (0, conf_bd_1.openDb)();
    await db.run('UPDATE postagens SET likes = likes + 1 WHERE id = ?', [id]).then((postagem) => {
        res.json(postagem);
    }).catch((err) => {
        res.status(400).json({ error: err.message });
    });
}
exports.curtirPostagem = curtirPostagem;
async function updatePostagem(req, res) {
    const { id } = req.params;
    const { title, text } = req.body;
    if (!id) {
        res.status(400).json({ error: "ID não informado" });
    }
    const db = await (0, conf_bd_1.openDb)();
    await db.run('UPDATE postagens SET title = ?, text = ? WHERE id = ?', [title, text, id]).then((postagem) => {
        res.json(postagem);
    }).catch((err) => {
        res.status(400).json({ error: err.message });
    });
}
exports.updatePostagem = updatePostagem;
async function deletePostagem(req, res) {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "ID não informado" });
    }
    const db = await (0, conf_bd_1.openDb)();
    await db.run('DELETE FROM postagens WHERE id = ?', [id]).then((postagem) => {
        res.json(postagem);
    }).catch((err) => {
        res.status(400).json({ error: err.message });
    });
}
exports.deletePostagem = deletePostagem;
async function retrieveAllComentariostoPostagem(req, res) {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "ID não informado" });
    }
    const db = await (0, conf_bd_1.openDb)();
    await db.all('SELECT * FROM comentarios WHERE id_post = ?', [id]).then((comentarios) => {
        res.json(comentarios);
    }).catch((err) => {
        res.status(400).json({ error: err.message });
    });
}
exports.retrieveAllComentariostoPostagem = retrieveAllComentariostoPostagem;
async function retrieveComentario(req, res) {
    const { id, id_comentario } = req.params;
    if (!id || !id_comentario) {
        res.status(400).json({ error: "ID não informado" });
    }
    const db = await (0, conf_bd_1.openDb)();
    await db.get('SELECT * FROM comentarios WHERE id = ? AND id_post = ?', [id_comentario, id]).then((comentario) => {
        res.json(comentario);
    }).catch((err) => {
        res.status(400).json({ error: err.message });
    });
}
exports.retrieveComentario = retrieveComentario;
async function insertComentario(req, res) {
    const { id } = req.params;
    const { text } = req.body;
    const db = await (0, conf_bd_1.openDb)();
    await db.run('INSERT INTO comentarios (id_post, text) VALUES (?, ?)', [id, text]).then((comentario) => {
        res.status(201).json({ comentario: comentario.lastID });
    }).catch((err) => {
        res.status(400).json({ error: err.message });
    });
}
exports.insertComentario = insertComentario;
async function deleteComentario(req, res) {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "ID não informado" });
    }
    const db = await (0, conf_bd_1.openDb)();
    await db.run('DELETE FROM comentarios WHERE id = ?', [id]).then((comentario) => {
        res.json(comentario);
    }).catch((err) => {
        res.status(400).json({ error: err.message });
    });
}
exports.deleteComentario = deleteComentario;
async function updateComentario(req, res) {
    const { id } = req.params;
    const { text } = req.body;
    if (!id) {
        res.status(400).json({ error: "ID não informado" });
    }
    const db = await (0, conf_bd_1.openDb)();
    await db.run('UPDATE comentarios SET text = ? WHERE id = ?', [text, id]).then((comentario) => {
        res.json(comentario);
    }).catch((err) => {
        res.status(400).json({ error: err.message });
    });
}
exports.updateComentario = updateComentario;
