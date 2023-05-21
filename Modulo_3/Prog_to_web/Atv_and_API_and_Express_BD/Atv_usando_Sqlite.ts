import { Application, Request, Response } from 'express';
import express from 'express';
const app: Application = express();
const port: number = 3000

import { v4 as uuidv4 } from 'uuid'

import {
    openDb,
    createTable, insertPostagem, deletePostagem,
    retrieveAllPostagens, retrievePostagem, updatePostagem,
    curtirPostagem
} from './config_bd.js'

class Postagem {
    id: string
    text: string
    likes: number

    constructor(id: string, text: string, likes?: number) {
        this.id = id
        this.text = text
        this.likes = likes ? likes : 0
    }

    curtir(): void {
        this.likes++
    }

    toString(): string {
        let aux: string = `
        id Postagem: ${this.id}
        Quantidade de curtidas: ${this.likes}
        texto inserido: ${this.text}
        `
        return aux
    }
}

class microBlog {
    private Postagens: Postagem[] = []

    create(postagem: Postagem) {
        if (this.retrieve(postagem.id) == -1) {
            this.Postagens.push(postagem)
        } else {
            console.log("Postagem já existe!!")
        }
    }

    curtir_postagem(id: string): number {
        let index: number = this.retrieve(id)

        if (index != -1) {
            this.Postagens[index].curtir()
            return 200
        }
        return 404
    }

    retrieve(id: string): number {
        let index: number = -1

        for (let i = 0; i < this.Postagens.length; i++) {
            if (this.Postagens[i].id == id) {
                index = i
                break
            }
        }

        return index
    }

    delete(id: string): void {
        let index: number = this.retrieve(id)

        if (index != -1) {
            this.Postagens.splice(index, 1);
        }
    }

    update(postagem: Postagem): void {
        let index: number = this.retrieve(postagem.id)

        if (index != -1) {
            this.Postagens[index] = postagem
        }
    }

    retrieveAll(): Postagem[] {
        return this.Postagens
    }

    toString_geral(): string {
        let aux: string = ''

        for (let postagem of this.Postagens) {
            aux += postagem.toString()
        }

        return aux
    }

    get_postagem(index: number) {
        return this.Postagens[index]
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
        } catch (err: any) {
            console.error(err)
        }
        return postagem
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
                postagens.push(new Postagem(postagem.id, postagem.text, postagem.likes))
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

    if (!id || id == '') {
        response.sendStatus(400)
    }

    if (!text && !likes) {
        response.sendStatus(400)
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

app.use(function (req: Request, res: Response, next: Function) {
    res.status(404).send('Sorry cant find that!');
});

app.listen(port, () => {
    console.log('Servidor rodando');
});