"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const port = 3000;
class Postagem {
    _id;
    _text;
    _likes;
    _comentarios;
    constructor(id, text, likes) {
        this._id = id;
        this._text = text;
        this._likes = likes ? likes : 0;
        this._comentarios = [];
    }
    get id() {
        return this._id;
    }
    get text() {
        return this._text;
    }
    get likes() {
        return this._likes;
    }
    get comentarios() {
        return this._comentarios;
    }
    curtir() {
        this._likes++;
    }
    toString() {
        let aux = `
        id Postagem: ${this.id}
        Quantidade de curtidas: ${this.likes}
        texto inserido: ${this.text}
        `;
        return aux;
    }
    add_comentario(comentario) {
        this.comentarios.push(comentario);
    }
    add_comentarios(comentarios) {
        this._comentarios = comentarios;
    }
}
class microBlog {
    Postagens = [];
    create(postagem) {
        if (!this.retrieve(postagem.id)) {
            this.Postagens.push(postagem);
        }
        else {
            console.log("Postagem já existe!!");
        }
    }
    curtir_postagem(id) {
        let index = this.get_index_postagem(id);
        if (index != -1) {
            this.Postagens[index].curtir();
            return 200;
        }
        return 404;
    }
    retrieve(id) {
        let Postagem;
        for (let i = 0; i < this.Postagens.length; i++) {
            if (this.Postagens[i].id == id) {
                Postagem = this.Postagens[i];
                break;
            }
        }
        return Postagem;
    }
    get_index_postagem(id) {
        let index = -1;
        for (let i = 0; i < this.Postagens.length; i++) {
            if (this.Postagens[i].id == id) {
                index = i;
                break;
            }
        }
        return index;
    }
    get_index_comentario(id, id_comentario) {
        let index_postagem = this.get_index_postagem(id);
        if (index_postagem != -1) {
            let index_comentario = -1;
            for (let i = 0; i < this.Postagens[index_postagem].comentarios.length; i++) {
                if (this.Postagens[index_postagem].comentarios[i].id == id_comentario) {
                    index_comentario = i;
                    break;
                }
            }
            return index_comentario;
        }
        return -1;
    }
    delete(id) {
        let index = this.get_index_postagem(id);
        if (index != -1) {
            this.Postagens.splice(index, 1);
        }
    }
    update(postagem) {
        let index = this.get_index_postagem(postagem.id);
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
    add_comentario(id, comentario) {
        let index = this.get_index_postagem(id);
        if (index != -1) {
            this.Postagens[index].add_comentario(comentario);
        }
    }
    add_comentarios(id, comentarios) {
        let index = this.get_index_postagem(id);
        if (index != -1) {
            this.Postagens[index].add_comentarios(comentarios);
        }
    }
    get_comentarios(id) {
        let index = this.get_index_postagem(id);
        if (index != -1) {
            return this.Postagens[index].comentarios;
        }
        return [];
    }
    get_comentario(id, id_comentario) {
        let index_postagem = this.get_index_postagem(id);
        const index_comentario = this.get_index_comentario(id, id_comentario);
        if (index_comentario != -1) {
            return this.Postagens[index_postagem].comentarios[index_comentario];
        }
        return { id: "", text: "" };
    }
    delete_comentario(id, id_comentario) {
        let index_postagem = this.get_index_postagem(id);
        if (index_postagem != -1) {
            let index_comentario = -1;
            for (let i = 0; i < this.Postagens[index_postagem].comentarios.length; i++) {
                if (this.Postagens[index_postagem].comentarios[i].id == id_comentario) {
                    index_comentario = i;
                    break;
                }
            }
            if (index_comentario != -1) {
                this.Postagens[index_postagem].comentarios.splice(index_comentario, 1);
            }
        }
    }
    update_comentario(id, id_comentario, comentario) {
        let index_postagem = this.get_index_postagem(id);
        if (index_postagem != -1) {
            let index_comentario = -1;
            for (let i = 0; i < this.Postagens[index_postagem].comentarios.length; i++) {
                if (this.Postagens[index_postagem].comentarios[i].id == id_comentario) {
                    index_comentario = i;
                    break;
                }
            }
            if (index_comentario != -1) {
                this.Postagens[index_postagem].comentarios[index_comentario] = comentario;
            }
        }
    }
}
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
app.use(express_1.default.json());
let microblog = new microBlog();
app.get('/', (req, res) => {
    res.send("Api funcionando");
});
app.get('/postagens', (req, res) => {
    res.send({ "Postagens": microblog.retrieveAll() });
});
app.get('/postagens/:id', (req, res) => {
    let postagem = microblog.retrieve(req.params.id);
    if (postagem) {
        res.send({ "Postagem": postagem });
    }
    else {
        res.sendStatus(404);
    }
});
app.post('/postagens', (req, res) => {
    if (req.body.text && req.body.text != "") {
        let postagem = new Postagem((0, uuid_1.v4)(), req.body.text);
        microblog.create(postagem);
        res.sendStatus(200);
    }
    else {
        res.sendStatus(400);
    }
});
app.put('/postagens/:id', (req, res) => {
    if (req.body.text && req.body.text != "") {
        let postagem = new Postagem(req.params.id, req.body.text);
        microblog.update(postagem);
        res.sendStatus(200);
    }
    else {
        res.sendStatus(400);
    }
});
app.patch('/postagens/:id', (req, res) => {
    if (req.body.text && req.body.text != "") {
        let postagem = new Postagem(req.params.id, req.body.text);
        microblog.update(postagem);
        res.sendStatus(200);
    }
    else {
        res.sendStatus(400);
    }
});
app.delete('/postagens/:id', (req, res) => {
    if (microblog.retrieve(req.params.id)) {
        microblog.delete(req.params.id);
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
app.post('/postagens/:id/like', (req, res) => {
    if (microblog.retrieve(req.params.id)) {
        microblog.curtir_postagem(req.params.id);
        res.sendStatus(200);
    }
    else {
        res.sendStatus(404);
    }
});
app.get('/postagens/:id/comentarios', (req, res) => {
    if (microblog.retrieve(req.params.id)) {
        res.send({ "Comentarios": microblog.get_comentarios(req.params.id) });
    }
    else {
        res.sendStatus(404);
    }
});
app.get('/postagens/:id/comentarios/:id_comentario', (req, res) => {
    if (microblog.retrieve(req.params.id)) {
        const comentario = microblog.get_comentario(req.params.id, req.params.id_comentario);
        res.send({ "Comentario": comentario });
    }
    else {
        res.sendStatus(404);
    }
});
app.post('/postagens/:id/comentarios', (req, res) => {
    if (req.body.text && req.body.text != "") {
        let comentario = { id: (0, uuid_1.v4)(), text: req.body.text };
        microblog.add_comentario(req.params.id, comentario);
        res.sendStatus(200);
    }
    else {
        res.sendStatus(400);
    }
});
app.put('/postagens/:id/comentarios/:id_comentario', (req, res) => {
    if (req.body.text && req.body.text != "") {
        let comentario = { id: req.params.id_comentario, text: req.body.text };
        microblog.update_comentario(req.params.id, req.params.id_comentario, comentario);
        res.sendStatus(200);
    }
    else {
        res.sendStatus(400);
    }
});
app.delete('/postagens/:id/comentarios/:id_comentario', (req, res) => {
    if (microblog.retrieve(req.params.id)) {
        microblog.delete_comentario(req.params.id, req.params.id_comentario);
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
