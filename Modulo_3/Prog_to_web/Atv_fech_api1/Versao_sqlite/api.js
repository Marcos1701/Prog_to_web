"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router"));
// import {
//   insertPostagem, retrievePostagem, retrieveAllPostagens, curtirPostagem,
//   updatePostagem, deletePostagem, retrieveAllComentariostoPostagem, retrieveComentario,
//   insertComentario, updateComentario, deleteComentario
// } from './Banco_de_dados/consultas_bd.js'
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
app.use(express_1.default.json());
app.use(router_1.default);
// app.get('/', (req: Request, res: Response) => {
//   res.send('Bem vindo ao microblog!!')
// });
// app.get('/posts', retrieveAllPostagens, (req: Request, res: Response) => {
//   console.log("cheguei aqui")
//   res.send(res.locals.postagens);
// });
// app.get('/posts/:id', retrievePostagem, (req: Request, res: Response) => {
//   console.log("cheguei aqui")
//   res.send(res.locals.postagem);
// });
// app.post('/posts', insertPostagem, (req: Request, res: Response) => {
//   console.log("cheguei aqui")
//   res.send(res.locals.postagem);
// });
// app.put('/posts/:id', updatePostagem);
// app.patch('/posts/:id', updatePostagem);
// app.delete('/posts/:id', deletePostagem);
// app.patch('/posts/:id/like', curtirPostagem);
// app.post('/posts/:id/like', curtirPostagem)
// app.post('/posts/:id/comentarios', insertComentario);
// app.get('/posts/:id/comentarios', retrieveAllComentariostoPostagem);
// app.get('/posts/:id/comentarios/:id_comentario', retrieveComentario);
// app.put('/posts/:id/comentarios/:id_comentario', updateComentario);
// app.delete('/posts/:id/comentarios/:id_comentario', deleteComentario);
app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
