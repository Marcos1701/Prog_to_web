import express, { Application, Request, Response } from 'express';
const app: Application = express()
const port: number = 3000

import { v4 as uuidv4 } from 'uuid'


class Postagem {
    id: string
    texto: string
    likes: number

    constructor(id: string, text: string, likes?: number) {
        this.id = id
        this.texto = text
        this.likes = likes? likes : 0
    }

    curtir(): void {
        this.likes++
    }

    toString(): string {
        let aux: string = `
        id Postagem: ${this.id}
        Quantidade de curtidas: ${this.likes}
        texto inserido: ${this.texto}
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

    get_postagem(index: number){
        return this.Postagens[index]
    }
}

let blog: microBlog = new microBlog()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));

app.get('/', (request: Request, response: Response) => {
    response.send('Bem vindo ao microblog!!')
})

app.get('/posts', (request: Request, response: Response) => {
    response.json({"Posts": blog.retrieveAll()})
})

app.get('/posts/:id', (request: Request, response: Response) => {
    let id: string = request.params.id
    let index: number = blog.retrieve(id)

    if (index != -1) {
        response.json({"Postagem": blog.get_postagem(index)})
    } else {
        response.sendStatus(404)
    }
})

app.delete('/posts/:id', (request: Request, response: Response) => {
    let id: string = request.params.id
    let index: number = blog.retrieve(id)

    if (index != -1) {
        blog.delete(id)
        response.sendStatus(204)
    } else {
        response.sendStatus(404)
    }
})

app.post('/posts', (request: Request, response: Response) => {
    //uuid
    let id: string = uuidv4()
    let texto: string = request.body.texto

    const novo_post: Postagem = new Postagem(id,texto)
    blog.create(novo_post)

    response.sendStatus(201)
    response.json({"novo_post": blog.retrieve(id)})
})

app.put('/posts/:id', (request: Request, response: Response) => {
    const id: string = request.params.id
    let index: number = blog.retrieve(id)

    if(index === -1){
        response.sendStatus(404)
    }
    const text: string = request.params.texto
    const post_alterado: Postagem = new Postagem(id, text)

    blog.update(post_alterado)
    response.sendStatus(200)
})

app.patch('/posts/:id', (request: Request, response: Response) => {
    const id: string = response.params.id
    let index: number = blog.retrieve(id)

    if(index === -1){
        response.sendStatus(404)
    }
    const text: string = request.params.texto
    const likes: number = parseInt(request.params.likes)
    if(!text && !likes){
        response.send('Ops, nenhum parâmetro foi passado para alteração..')
    }

    let post: Postagem = blog.get_postagem(index)
    let post_alterado: Postagem
    if(likes && text){
        post_alterado = new Postagem(id, text, likes)
    }else if(text){
        post_alterado = new Postagem(id,post.texto,likes)
    }else{
        post_alterado = new Postagem(id,text,post.likes)
    }

    blog.update(post_alterado)
    response.sendStatus(200)
})

app.patch('/posts/:id/like', (request: Request, response: Response) => {
    const id: string = response.params.id
    response.sendStatus(blog.curtir_postagem(id))
})

app.use(function (req: Request, res: Response, next: Function) {
    res.status(404).send('Sorry cant find that!');
});

app.listen(port, () => {
    console.log('Servidor rodando');
  });
