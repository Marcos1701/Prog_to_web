import { Application, Request, Response } from 'express';
import express from 'express';
const app: Application = express();
const port: number = 3000

import { v4 as uuidv4 } from 'uuid'

import {
    openDb,
    createTable, insertPostagem, deletePostagem,
    retrieveAllPostagens, retrievePostagem, updatePostagem,
    curtirPostagem, retrieveComentarios, insertComentario,
    deleteComentario, retrieveComentario,
    updateComentario
} from './Banco_de_dados/conf_bd.js'

interface Comentario {
    id: string,
    text: string
}

class Postagem {
    private _id: string
    private _text: string
    private _likes: number
    private _comentarios: Comentario[]

    constructor(id: string, text: string, likes?: number) {
        this._id = id
        this._text = text
        this._likes = likes ? likes : 0
        this._comentarios = []
    }

    get id(): string {
        return this._id
    }

    get text(): string {
        return this._text
    }

    get likes(): number {
        return this._likes
    }

    get comentarios(): Comentario[] {
        return this._comentarios
    }

    curtir(): void {
        this._likes++
    }

    toString(): string {
        let aux: string = `
        id Postagem: ${this.id}
        Quantidade de curtidas: ${this.likes}
        texto inserido: ${this.text}
        `
        return aux
    }

    add_comentario(comentario: Comentario): void {
        this.comentarios.push(comentario)
    }

    add_comentarios(comentarios: Comentario[]): void {
        this._comentarios = comentarios
    }
}

class MicroblogPersistente {

    constructor() {
        this.inicializar()
    }

    async inicializar(): Promise<void> {
        try {
            await openDb()
            await createTable()
        } catch (err: any) {
            console.error(err)
        }
    }

    async create(postagem: Postagem): Promise<void> {
        try {
            await insertPostagem(postagem.id, postagem.text, postagem.likes)
        } catch (err: any) {
            console.error(err)
        }
    }

    async curtir_postagem(id: string): Promise<void> {
        try {
            await curtirPostagem(id)
        } catch (err: any) {
            console.error(err)
        }
    }

    async retrieve(id: string): Promise<Postagem> {
        let postagem!: Postagem
        try {
            let aux = await retrievePostagem(id)
            postagem = new Postagem(aux.id, aux.text, aux.likes)
            postagem.add_comentarios(await this.retrieveComentarios(id))


        } catch (err: any) {
            console.error(err)
        } finally {
            return postagem
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await deletePostagem(id)
            return true
        } catch (err: any) {
            console.error(err)
            return false
        }
    }

    async retrieveAll(): Promise<Postagem[]> {
        try {
            let postagens: Postagem[] = []
            let postagens_bd: any[] = await retrieveAllPostagens()

            for (let postagem of postagens_bd) {
                postagens.push(new Postagem(postagem.id, postagem.text, postagem.likes));
                postagens[postagens.length - 1].add_comentarios(await this.retrieveComentarios(postagem.id));
            }

            return postagens
        } catch (err: any) {
            console.error(err)
            return []
        }
    }

    async update(postagem: Postagem): Promise<void> {
        try {
            await updatePostagem(postagem.id, postagem.text, postagem.likes)
        } catch (err: any) {
            console.error(err)
        }
    }

    async retrieveComentarios(id: string): Promise<Comentario[]> {
        try {
            let comentarios: Comentario[] = []
            let comentarios_bd: any[] = await retrieveComentarios(id)

            for (let comentario of comentarios_bd) {
                comentarios.push({ id: comentario.id, text: comentario.text })
            }

            return comentarios
        } catch (err: any) {
            console.error(err)
            return []
        }
    }

    async retrieveComentario(id_postagem: string, id_comentario: string): Promise<Comentario> {
        let comentario_bd: any = await retrieveComentario(id_postagem, id_comentario)
        const comentario: Comentario = { id: comentario_bd.id, text: comentario_bd.text }
        return comentario
    }

    async insertComentario(id_postagem: string, comentario: string): Promise<void> {
        try {
            await insertComentario(uuidv4(), comentario, id_postagem)
        } catch (err: any) {
            console.error(err)
        }
    }

    async deleteComentario(id_postagem: string, id_comentario: string): Promise<void> {
        try {
            await deleteComentario(id_postagem, id_comentario)
        } catch (err: any) {
            console.error(err)
        }
    }

    async updateComentario(id_postagem: string, id_comentario: string, comentario: string): Promise<void> {
        try {
            await updateComentario(id_postagem, id_comentario, comentario)
        } catch (err: any) {
            console.error(err)
        }
    }

}

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(express.json())
let blog: MicroblogPersistente = new MicroblogPersistente()


app.get('/', (request: Request, response: Response) => {
    response.send('Bem vindo ao microblog!!')
})

app.get('/posts', async (request: Request, response: Response) => {
    try {
        const postagens: Postagem[] = await blog.retrieveAll();
        response.json({ Postagens: postagens });
    } catch (err: any) {
        console.error(err);
        response.sendStatus(500)
    }
});

app.get('/posts/:id', async (request: Request, response: Response) => {
    let id: string = request.body.id;

    try {
        const postagem: Postagem = await blog.retrieve(id);
        if (postagem) {
            response.json({ "Postagem": postagem });
        } else {
            response.sendStatus(404);
        }
    } catch (err: any) {
        console.error(err);
    }
});


app.delete('/posts/:id', async (request: Request, response: Response) => {
    let id: string = request.body.id;

    if (await blog.delete(id)) {
        response.sendStatus(204);
    } else {
        response.sendStatus(404);
    }
})

app.post('/posts', async (request: Request, response: Response) => {
    const { text } = request.body;
    if (!text) {
        response.sendStatus(400);
        return;
    }
    let postagem: Postagem = new Postagem(uuidv4(), text)

    await blog.create(postagem)
    response.sendStatus(201);
})

app.put('/posts/:id', async (request: Request, response: Response) => {
    let { id, text, likes }:
        { id: string, text: string, likes: string } = request.body;

    if (!id || id == '' || !text || text == '' || !likes || likes == '') {
        response.sendStatus(400)
    }
    const postagem_antiga: Postagem = await blog.retrieve(id);
    if (postagem_antiga) {
        await blog.update(new Postagem(id, text, Number(likes)))
        response.sendStatus(200);
    } else {
        response.sendStatus(404);
    }

})

app.patch('/posts/:id', async (request: Request, response: Response) => {
    // faz a mesma coisa que o put, mas não precisa passar todos os dados
    let { id, text, likes }:
        { id: string, text: string, likes: string } = request.body;

    if (!id || id == '') {
        response.sendStatus(400).send('Id não informado');
    }

    if (!text && !likes) {
        response.sendStatus(400).send('Nenhum dado informado');
    }
    const postagem_antiga: Postagem = await blog.retrieve(id);
    if (postagem_antiga) {
        if (text && likes) {
            await blog.update(new Postagem(id, text, Number(likes)))
        } else if (text) {
            await blog.update(new Postagem(id, text, postagem_antiga.likes))
        } else {
            await blog.update(new Postagem(id, postagem_antiga.text, Number(likes)))
        }
        response.sendStatus(200);
    } else {
        response.sendStatus(404);
    }
})

app.patch('/posts/:id/like', async (request: Request, response: Response) => {
    let id: string = request.body.id;

    if (await blog.retrieve(id)) {
        await blog.curtir_postagem(id)
        response.sendStatus(200)
    } else {
        response.sendStatus(404)
    }
})

app.get('/posts/:id/comentarios', async (request: Request, response: Response) => {
    let id_postagem: string = request.body.id;

    if (await blog.retrieve(id_postagem)) {
        const comentarios: Comentario[] = await blog.retrieveComentarios(id_postagem);
        response.json({ "Comentarios_postagem": comentarios });
    } else {
        response.sendStatus(404);
    }
})

app.post('/posts/:id/comentarios', async (request: Request, response: Response) => {
    let id_postagem: string = request.body.id;
    let comentario: string = request.body.comentario;

    if (!comentario || comentario == '') {
        response.sendStatus(400)
        return
    }
    if (await blog.retrieve(id_postagem)) {
        await blog.insertComentario(id_postagem, comentario)
        response.sendStatus(201)
    } else {
        response.sendStatus(404)
    }
})

app.post('/posts/:id/comments/', async (request: Request, response: Response) => {
    let id_postagem: string = request.body.id;

    if (await blog.retrieve(id_postagem)) {
        const comentarios: Comentario[] = await blog.retrieveComentarios(id_postagem);
        response.json({ "Comentarios_postagem": comentarios });
    } else {
        response.sendStatus(404);
    }
})

app.put('/posts/:id/comentarios/:id_comentario', async (request: Request, response: Response) => {
    let id_postagem: string = request.body.id;
    let id_comentario: string = request.body.id_comentario;
    let comentario: string = request.body.comentario;

    try {
        await blog.retrieveComentario(id_postagem, id_comentario)
        await blog.updateComentario(id_postagem, id_comentario, comentario)
        response.sendStatus(200)
    } catch (err: any) {
        if (err instanceof Error) {
            response.sendStatus(404)
        }
        console.log(err.message);
    }
})

app.patch('/posts/:id/comentarios/:id_comentario', async (request: Request, response: Response) => {
    let id_postagem: string = request.body.id;
    let id_comentario: string = request.body.id_comentario;
    let comentario: string = request.body.comentario;

    if (!comentario || comentario == '') {
        response.sendStatus(400)
        return;
    }
    try {
        await blog.retrieveComentario(id_postagem, id_comentario)
        await blog.updateComentario(id_postagem, id_comentario, comentario)
        response.sendStatus(200)
    } catch (err: any) {
        if (err instanceof Error) {
            response.sendStatus(404)
        }
        console.log(err.message);
    }
})

app.delete('/posts/:id/comentarios/:id_comentario', async (request: Request, response: Response) => {
    let id_postagem: string = request.body.id;
    let id_comentario: string = request.body.id_comentario;

    try {
        retrieveComentario(id_postagem, id_comentario)
        await blog.deleteComentario(id_postagem, id_comentario)
        response.sendStatus(204)
    } catch (err: any) {
        if (err instanceof Error) {
            response.sendStatus(404)
        }
        console.log(err.message);
    }
})

app.use(function (req: Request, res: Response, next: Function) {
    res.status(404).send('Sorry cant find that!');
});

app.listen(port, () => {
    console.log('Servidor rodando');
});