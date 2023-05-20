import { Application, Request, Response } from 'express';
const express = require('express')
const app: Application = express() as Application;
const port: number = 3000

import { v4 as uuidv4 } from 'uuid'

import { Client, QueryResult } from 'pg';
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Aplicacao_bd',
    password: 'postgres',
    port: 5432,
});


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
            for (let i = index; i < this.Postagens.length; i++) {
                this.Postagens[i] = this.Postagens[i + 1]
            }
            this.Postagens.pop()
        }
        return
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
        client.connect()
    }

    async create(postagem: Postagem) {
        if (!this.retrieve(postagem.id)) {
            await client.query(`INSERT INTO post VALUES ('${postagem.id}', '${postagem.text}', ${postagem.likes})`)
        } else {
            console.log("Postagem já existe!!")
        }
    }

    async curtir_postagem(id: string): Promise<number> {

        if (await this.retrieve(id)) {
            await client.query(`UPDATE post SET likes = likes + 1 WHERE id = '${id}'`)
            return 200
        }
        return 404
    }

    async retrieve(id: string): Promise<boolean> {
        const retorno = await
            client.query(`SELECT * FROM post WHERE id = '${id}'`).then((res: QueryResult) => {
                return res.rows
            })

        return retorno.length > 0
    }

    async delete(id: string): Promise<void> {
        await client.query(`DELETE FROM post WHERE id = '${id}'`)
    }

    async update(postagem: Postagem): Promise<void> {
        await client.query(`UPDATE post SET text = '${postagem.text}', likes = ${postagem.likes} WHERE id = '${postagem.id}'`)
    }

    async retrieveAll(): Promise<Postagem[]> {
        const retorno: QueryResult = await client.query(`SELECT * FROM post`)
        let postagens: Postagem[] = []

        for (let postagem of retorno.rows) {
            postagens.push(new Postagem(postagem.id, postagem.text, postagem.likes))
        }
        return postagens
    }

    async get_postagem(id: string): Promise<Postagem> {
        const retorno: QueryResult = await client.query(`SELECT * FROM post WHERE id = '${id}'`)

        return new Postagem(retorno.rows[0].id, retorno.rows[0].text, retorno.rows[0].likes)
    }

}

let blog: MicroblogPersistente = new MicroblogPersistente()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));

app.get('/', (request: Request, response: Response) => {
    response.send('Bem vindo ao microblog!!')
})

app.get('/posts', async (request: Request, response: Response) => {
    response.json({ "Postagens": await blog.retrieveAll() })
})

app.get('/posts/:id', async (request: Request, response: Response) => {
    let id: string = request.body.id

    if (await blog.retrieve(id)) {
        response.json({ "Postagem": await blog.get_postagem(id) })

    } else {
        response.sendStatus(404)
    }
})

app.delete('/posts/:id', async (request: Request, response: Response) => {
    let id: string = request.body.id

    if (await blog.retrieve(id)) {
        await blog.delete(id)
        response.sendStatus(200)
    } else {
        response.sendStatus(404)
    }
})

app.post('/posts', async (request: Request, response: Response) => {
    const id: string = request.body.id
    const text: string = request.body.text
    const postagem: Postagem = new Postagem(id, text)

    await blog.create(postagem)
    response.sendStatus(201)
})

app.put('/posts/:id/like', async (request: Request, response: Response) => {
    const id: string = request.body.id

    if (await blog.retrieve(id)) {
        await blog.curtir_postagem(id)
        response.sendStatus(200)
    } else {
        response.sendStatus(404)
    }
})

app.patch('/posts/:id', async (request: Request, response: Response) => {
    const id: string = request.body.id
    // let index: number = blog.retrieve(id)

    if (!(await blog.retrieve(id))) {
        response.sendStatus(404)
    }
    const text: string = request.body.text
    const likes: number = parseInt(request.body.likes)
    if (!text && !likes) {
        response.send('Ops, nenhum parâmetro foi passado para alteração..')
    }

    let post: Postagem = await blog.get_postagem(id).then((res: Postagem) => {
        return res
    })
    let post_alterado: Postagem
    if (likes && text) {
        post_alterado = new Postagem(id, text, likes)
    } else if (text) {
        post_alterado = new Postagem(id, text, post.likes)
    } else {
        post_alterado = new Postagem(id, post.text, likes)
    }

    await blog.update(post_alterado)
    response.sendStatus(200)
})

app.patch('/posts/:id/like', async (request: Request, response: Response) => {
    const id: string = request.body.id
    response.sendStatus(await blog.curtir_postagem(id))
})

app.use(function (req: Request, res: Response, next: Function) {
    res.status(404).send('Sorry cant find that!');
});

app.listen(port, () => {
    console.log('Servidor rodando');
});


