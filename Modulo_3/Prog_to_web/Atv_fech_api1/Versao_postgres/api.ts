import express, { Application, Request, Response } from 'express';
// import router from './router';

import {
  insertPostagem, retrievePostagem, retrieveAllPostagens, curtirPostagem,
  updatePostagem, deletePostagem, retrieveAllComentariostoPostagem, retrieveComentario,
  insertComentario, updateComentario, deleteComentario
} from './Banco_de_dados/consultas_bd.js'

const app: Application = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(express.json())
// app.use(router);

app.get('/', (req: Request, res: Response) => {
  res.send('Bem vindo ao microblog!!')
});

app.get('/posts', retrieveAllPostagens, (req: Request, res: Response) => {
  console.log("cheguei aqui")
  res.send(res.locals.postagens);
});
app.get('/posts/:id', retrievePostagem, (req: Request, res: Response) => {
  console.log("cheguei aqui")
  res.send(res.locals.postagem);
});
app.post('/posts', insertPostagem, (req: Request, res: Response) => {
  console.log("cheguei aqui")
  res.send(res.locals.postagem);
});
app.put('/posts/:id', updatePostagem);
app.patch('/posts/:id', updatePostagem);
app.delete('/posts/:id', deletePostagem);
app.patch('/posts/:id/like', curtirPostagem);
app.post('/posts/:id/like', curtirPostagem)
app.post('/posts/:id/comentarios', insertComentario);
app.get('/posts/:id/comentarios', retrieveAllComentariostoPostagem);
app.get('/posts/:id/comentarios/:id_comentario', retrieveComentario);
app.put('/posts/:id/comentarios/:id_comentario', updateComentario);
app.delete('/posts/:id/comentarios/:id_comentario', deleteComentario);



app.use(function (req: Request, res: Response, next: Function) {
  res.status(404).send('Sorry cant find that!');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});