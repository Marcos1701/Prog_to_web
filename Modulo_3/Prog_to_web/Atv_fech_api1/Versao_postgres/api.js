"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import router from './router';
const consultas_bd_js_1 = require("./Banco_de_dados/consultas_bd.js");
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
app.use(express_1.default.json());
// app.use(router);
app.get('/', (req, res) => {
    res.send('Bem vindo ao microblog!!');
});
app.get('/posts', consultas_bd_js_1.retrieveAllPostagens, (req, res) => {
    console.log("cheguei aqui");
    res.send(res.locals.postagens);
});
app.get('/posts/:id', consultas_bd_js_1.retrievePostagem, (req, res) => {
    console.log("cheguei aqui");
    res.send(res.locals.postagem);
});
app.post('/posts', consultas_bd_js_1.insertPostagem, (req, res) => {
    console.log("cheguei aqui");
    res.send(res.locals.postagem);
});
app.put('/posts/:id', consultas_bd_js_1.updatePostagem);
app.patch('/posts/:id', consultas_bd_js_1.updatePostagem);
app.delete('/posts/:id', consultas_bd_js_1.deletePostagem);
app.patch('/posts/:id/like', consultas_bd_js_1.curtirPostagem);
app.post('/posts/:id/like', consultas_bd_js_1.curtirPostagem);
app.post('/posts/:id/comentarios', consultas_bd_js_1.insertComentario);
app.get('/posts/:id/comentarios', consultas_bd_js_1.retrieveAllComentariostoPostagem);
app.get('/posts/:id/comentarios/:id_comentario', consultas_bd_js_1.retrieveComentario);
app.put('/posts/:id/comentarios/:id_comentario', consultas_bd_js_1.updateComentario);
app.delete('/posts/:id/comentarios/:id_comentario', consultas_bd_js_1.deleteComentario);
app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
