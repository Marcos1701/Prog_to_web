import { Application, Request, Response } from 'express';
const express = require('express')
const app: Application = express() as Application;
const port: number = 3000

import { v4 as uuidv4 } from 'uuid'

import { Pool, QueryResult } from 'pg';
const pool = new Pool({
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
        pool.connect()
    }

    async create(postagem: Postagem): Promise<void> {
        if (!(await this.retrieve(postagem.id))) {
            try {
                await pool.query(`INSERT INTO post VALUES('${postagem.id}','${postagem.text}', ${postagem.likes})`)
            } catch (err: any) {
                console.error(err.message);
            }
        }
    }

    async curtir_postagem(id: string): Promise<number> {
        if (await this.retrieve(id)) {
            try {
                await pool.query(`UPDATE post SET likes = likes + 1 WHERE id = '${id}'`)
                return 200
            } catch (err: any) {
                console.error(err.message);
            }
        }
        return 404
    }

    async retrieve(id: string): Promise<boolean> {
        try {
            const retorno: QueryResult = await pool.query(`SELECT * FROM post WHERE id ilike '${id}'`)
            if (retorno.rows.length == 1) {
                return true
            }
        } catch (err: any) {
            console.error(err.message);
        }
        return false
    }

    async delete(id: string): Promise<boolean> {
        if (await this.retrieve(id)) {
            try {
                await pool.query(`DELETE FROM post WHERE id = '${id}'`)
                return true
            } catch (err: any) {
                console.error(err.message);
            }
        }
        return false
    }

    async update(postagem: Postagem): Promise<boolean> {
        try {
            if (await this.retrieve(postagem.id)) {
                await pool.query(`UPDATE post SET text = '${postagem.text}', likes = ${postagem.likes} WHERE id = '${postagem.id}'`)
                console.log(`Postagem com id ${postagem.id} atualizada com sucesso`)
                return true
            }
        } catch (err: any) {
            console.error(err)
        }
        return false
    }

    async retrieveAll(): Promise<Postagem[]> {
        try {
            const retorno: QueryResult = await pool.query(`SELECT * FROM post`)
            let postagens: Postagem[] = []

            for (let postagem of retorno.rows) {
                postagens.push(new Postagem(postagem.id, postagem.text, postagem.likes))
            }
            console.log(`Postagens recuperadas com sucesso`)
            return postagens
        } catch (err: any) {
            console.error(err)
        }
        return []
    }

    async get_postagem(id: string): Promise<Postagem> {
        let postagem_retorno !: Postagem
        try {
            const retorno: QueryResult = await pool.query(`SELECT * FROM post WHERE id = '${id}'`)
            postagem_retorno = new Postagem(retorno.rows[0].id, retorno.rows[0].text, retorno.rows[0].likes)
            console.log(`Postagem com id ${id} recuperada com sucesso`)
        } catch (err: any) {
            console.error(err)
        }
        return postagem_retorno
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
    try {
        const postagens: Postagem[] = await blog.retrieveAll();
        response.json({ Postagens: postagens });
    } catch (err: any) {
        console.error(err);
        response.sendStatus(500)
    }
});

app.get('/posts/:id', async (request: Request, response: Response) => {
    let id: string = request.params.id;

    try {
        if (await blog.retrieve(id)) {
            const postagem: Postagem = await blog.get_postagem(id);
            response.json({ Postagem: postagem });
        } else {
            response.status(404)
        }
    } catch (err: any) {
        console.error(err);
        response.sendStatus(500)
    }
});


app.delete('/posts/:id', async (request: Request, response: Response) => {
    let id: string = request.params.id

    if (await blog.delete(id)) {
        response.sendStatus(200);
    } else {
        response.sendStatus(404);
    }
})

app.post('/posts', async (request: Request, response: Response) => {
    let postagem: Postagem = new Postagem(uuidv4(), request.body.text)
    await blog.create(postagem)
    response.sendStatus(200)
})

app.put('/posts/:id/like', async (request: Request, response: Response) => {
    let id: string = request.params.id

    if (await blog.curtir_postagem(id) === 200) {
        response.sendStatus(200);
    } else {
        response.sendStatus(404);
    }

})

app.patch('/posts/:id', async (request: Request, response: Response) => {

    let id: string = request.params.id
    const postagem_antiga: Postagem = await blog.get_postagem(id)
    let postagem: Postagem = new Postagem(id, request.body.text ? request.body.text : postagem_antiga.text, request.body.likes ? request.body.likes : postagem_antiga.likes)

    if (await blog.update(postagem)) {
        response.sendStatus(200)
    } else {
        response.sendStatus(404)
    }
})

app.patch('/posts/:id/like', async (request: Request, response: Response) => {
    let id: string = request.body.id

    if (await blog.retrieve(id)) {
        if (await blog.curtir_postagem(id) == 200) {
            response.sendStatus(200)
        }
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


