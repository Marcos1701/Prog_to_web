import { Application, Request, Response } from 'express';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
const app: Application = express();
const port: number = 3000

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

class microBlog {
    private Postagens: Postagem[] = []

    create(postagem: Postagem) {
        if (!this.retrieve(postagem.id)) {
            this.Postagens.push(postagem)
        } else {
            console.log("Postagem já existe!!")
        }
    }

    curtir_postagem(id: string): number {
        let index: number = this.get_index_postagem(id)

        if (index != -1) {
            this.Postagens[index].curtir()
            return 200
        }
        return 404
    }

    retrieve(id: string): Postagem {
        let Postagem!: Postagem

        for (let i = 0; i < this.Postagens.length; i++) {
            if (this.Postagens[i].id == id) {
                Postagem = this.Postagens[i]
                break
            }
        }

        return Postagem
    }

    private get_index_postagem(id: string): number {
        let index: number = -1

        for (let i = 0; i < this.Postagens.length; i++) {
            if (this.Postagens[i].id == id) {
                index = i
                break
            }
        }

        return index
    }

    private get_index_comentario(id: string, id_comentario: string): number {
        let index_postagem: number = this.get_index_postagem(id)

        if (index_postagem != -1) {
            let index_comentario: number = -1

            for (let i = 0; i < this.Postagens[index_postagem].comentarios.length; i++) {
                if (this.Postagens[index_postagem].comentarios[i].id == id_comentario) {
                    index_comentario = i
                    break
                }
            }

            return index_comentario
        }
        return -1
    }

    delete(id: string): void {
        let index: number = this.get_index_postagem(id)

        if (index != -1) {
            this.Postagens.splice(index, 1);
        }
    }

    update(postagem: Postagem): void {
        let index: number = this.get_index_postagem(postagem.id)

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

    add_comentario(id: string, comentario: Comentario): void {
        let index: number = this.get_index_postagem(id)

        if (index != -1) {
            this.Postagens[index].add_comentario(comentario)
        }
    }

    add_comentarios(id: string, comentarios: Comentario[]): void {
        let index: number = this.get_index_postagem(id)

        if (index != -1) {
            this.Postagens[index].add_comentarios(comentarios)
        }
    }

    get_comentarios(id: string): Comentario[] {
        let index: number = this.get_index_postagem(id)

        if (index != -1) {
            return this.Postagens[index].comentarios
        }
        return []
    }

    get_comentario(id: string, id_comentario: string): Comentario {
        let index_postagem: number = this.get_index_postagem(id)
        const index_comentario: number = this.get_index_comentario(id, id_comentario);

        if (index_comentario != -1) {
            return this.Postagens[index_postagem].comentarios[index_comentario]
        }
        return { id: "", text: "" }
    }

    delete_comentario(id: string, id_comentario: string): void {
        let index_postagem: number = this.get_index_postagem(id)

        if (index_postagem != -1) {
            let index_comentario: number = -1

            for (let i = 0; i < this.Postagens[index_postagem].comentarios.length; i++) {
                if (this.Postagens[index_postagem].comentarios[i].id == id_comentario) {
                    index_comentario = i
                    break
                }
            }

            if (index_comentario != -1) {
                this.Postagens[index_postagem].comentarios.splice(index_comentario, 1);
            }
        }
    }

    update_comentario(id: string, id_comentario: string, comentario: Comentario): void {
        let index_postagem: number = this.get_index_postagem(id)

        if (index_postagem != -1) {
            let index_comentario: number = -1

            for (let i = 0; i < this.Postagens[index_postagem].comentarios.length; i++) {
                if (this.Postagens[index_postagem].comentarios[i].id == id_comentario) {
                    index_comentario = i
                    break
                }
            }

            if (index_comentario != -1) {
                this.Postagens[index_postagem].comentarios[index_comentario] = comentario
            }
        }
    }
}

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(express.json())

let microblog: microBlog = new microBlog()

app.get('/', (req: Request, res: Response) => {
    res.send("Api funcionando")
})

app.get('/postagens', (req: Request, res: Response) => {
    res.send({ "Postagens": microblog.retrieveAll() })
})

app.get('/postagens/:id', (req: Request, res: Response) => {
    let postagem: Postagem = microblog.retrieve(req.params.id)

    if (postagem) {
        res.send({ "Postagem": postagem })
    } else {
        res.sendStatus(404)
    }
})

app.post('/postagens', (req: Request, res: Response) => {
    if (req.body.text && req.body.text != "") {
        let postagem: Postagem = new Postagem(uuidv4(), req.body.text)

        microblog.create(postagem)

        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})

app.put('/postagens/:id', (req: Request, res: Response) => {
    if (req.body.text && req.body.text != "") {
        let postagem: Postagem = new Postagem(req.params.id, req.body.text)

        microblog.update(postagem)

        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})

app.patch('/postagens/:id', (req: Request, res: Response) => {
    if (req.body.text && req.body.text != "") {
        let postagem: Postagem = new Postagem(req.params.id, req.body.text)
        microblog.update(postagem)
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})

app.delete('/postagens/:id', (req: Request, res: Response) => {
    if (microblog.retrieve(req.params.id)) {
        microblog.delete(req.params.id)
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

app.post('/postagens/:id/like', (req: Request, res: Response) => {
    if (microblog.retrieve(req.params.id)) {
        microblog.curtir_postagem(req.params.id)
        res.sendStatus(200)
    } else {
        res.sendStatus(404)
    }
})

app.get('/postagens/:id/comentarios', (req: Request, res: Response) => {
    if (microblog.retrieve(req.params.id)) {
        res.send({ "Comentarios": microblog.get_comentarios(req.params.id) })
    } else {
        res.sendStatus(404)
    }
})

app.get('/postagens/:id/comentarios/:id_comentario', (req: Request, res: Response) => {
    if (microblog.retrieve(req.params.id)) {
        const comentario: Comentario = microblog.get_comentario(req.params.id, req.params.id_comentario)
        res.send({ "Comentario": comentario })
    } else {
        res.sendStatus(404)
    }
})

app.post('/postagens/:id/comentarios', (req: Request, res: Response) => {
    if (req.body.text && req.body.text != "") {
        let comentario: Comentario = { id: uuidv4(), text: req.body.text }
        microblog.add_comentario(req.params.id, comentario)
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})

app.put('/postagens/:id/comentarios/:id_comentario', (req: Request, res: Response) => {
    if (req.body.text && req.body.text != "") {
        let comentario: Comentario = { id: req.params.id_comentario, text: req.body.text }
        microblog.update_comentario(req.params.id, req.params.id_comentario, comentario)
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})

app.delete('/postagens/:id/comentarios/:id_comentario', (req: Request, res: Response) => {
    if (microblog.retrieve(req.params.id)) {
        microblog.delete_comentario(req.params.id, req.params.id_comentario)
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

app.use(function (req: Request, res: Response, next: Function) {
    res.status(404).send('Sorry cant find that!');
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
})