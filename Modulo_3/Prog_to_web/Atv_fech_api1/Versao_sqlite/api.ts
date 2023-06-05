import express, { Application, Request, Response } from 'express';
import router from './router.js';

const app: Application = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(express.json())
app.use(router);

app.get('/', (req: Request, res: Response) => {
  res.send('Bem vindo ao microblog!!')
});

app.use(function (req: Request, res: Response, next: Function) {
  res.status(404).send('Sorry cant find that!');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});