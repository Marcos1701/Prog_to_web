"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
const uuid_1 = require("uuid");
const config_bd_js_1 = require("./config_bd.js");
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
        this.inicializar();
    }
    async inicializar() {
        try {
            await (0, config_bd_js_1.openDb)();
            await (0, config_bd_js_1.createTable)();
        }
        catch (err) {
            console.error(err);
        }
    }
    async create(postagem) {
        try {
            await (0, config_bd_js_1.insertPostagem)(postagem.id, postagem.text, postagem.likes);
        }
        catch (err) {
            console.error(err);
        }
    }
    async curtir_postagem(id) {
        try {
            await (0, config_bd_js_1.curtirPostagem)(id);
        }
        catch (err) {
            console.error(err);
        }
    }
    async retrieve(id) {
        let postagem;
        try {
            let aux = await (0, config_bd_js_1.retrievePostagem)(id);
            postagem = new Postagem(aux.id, aux.text, aux.likes);
        }
        catch (err) {
            console.error(err);
        }
        return postagem;
    }
    async delete(id) {
        try {
            await (0, config_bd_js_1.deletePostagem)(id);
            return true;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
    async retrieveAll() {
        try {
            let postagens = [];
            let postagens_bd = await (0, config_bd_js_1.retrieveAllPostagens)();
            for (let postagem of postagens_bd) {
                postagens.push(new Postagem(postagem.id, postagem.text, postagem.likes));
            }
            return postagens;
        }
        catch (err) {
            console.error(err);
            return [];
        }
    }
    async update(postagem) {
        try {
            await (0, config_bd_js_1.updatePostagem)(postagem.id, postagem.text, postagem.likes);
        }
        catch (err) {
            console.error(err);
        }
    }
}
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
app.use(express_1.default.json());
let blog = new MicroblogPersistente();
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
    let id = request.body.id;
    try {
        const postagem = await blog.retrieve(id);
        if (postagem) {
            response.json({ "Postagem": postagem });
        }
        else {
            response.sendStatus(404);
        }
    }
    catch (err) {
        console.error(err);
    }
});
app.delete('/posts/:id', async (request, response) => {
    let id = request.body.id;
    if (await blog.delete(id)) {
        response.sendStatus(204);
    }
    else {
        response.sendStatus(404);
    }
});
app.post('/posts', async (request, response) => {
    const { text } = request.body;
    if (!text) {
        response.sendStatus(400);
        return;
    }
    let postagem = new Postagem((0, uuid_1.v4)(), text);
    await blog.create(postagem);
    response.sendStatus(201);
});
app.put('/posts/:id', async (request, response) => {
    let { id, text, likes } = request.body;
    if (!id || id == '') {
        response.sendStatus(400);
    }
    if (!text && !likes) {
        response.sendStatus(400);
    }
    const postagem_antiga = await blog.retrieve(id);
    if (postagem_antiga) {
        if (text && likes) {
            await blog.update(new Postagem(id, text, Number(likes)));
        }
        else if (text) {
            await blog.update(new Postagem(id, text, postagem_antiga.likes));
        }
        else {
            await blog.update(new Postagem(id, postagem_antiga.text, Number(likes)));
        }
        response.sendStatus(200);
    }
    else {
        response.sendStatus(404);
    }
});
app.patch('/posts/:id', async (request, response) => {
    // faz a mesma coisa que o put, mas não precisa passar todos os dados
    let { id, text, likes } = request.body;
    if (!id || id == '') {
        response.sendStatus(400).send('Id não informado');
    }
    if (!text && !likes) {
        response.sendStatus(400).send('Nenhum dado informado');
    }
    const postagem_antiga = await blog.retrieve(id);
    if (postagem_antiga) {
        if (text && likes) {
            await blog.update(new Postagem(id, text, Number(likes)));
        }
        else if (text) {
            await blog.update(new Postagem(id, text, postagem_antiga.likes));
        }
        else {
            await blog.update(new Postagem(id, postagem_antiga.text, Number(likes)));
        }
        response.sendStatus(200);
    }
    else {
        response.sendStatus(404);
    }
});
app.patch('/posts/:id/like', async (request, response) => {
    let id = request.body.id;
    if (await blog.retrieve(id)) {
        await blog.curtir_postagem(id);
        response.sendStatus(200);
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
