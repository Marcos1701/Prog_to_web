const express = require('express')
const app = express()
const port: number = 3000

import { v4 as uuidv4 } from 'uuid'


class Postagem {
    id: number
    texto: string
    qtd_curtidas: number

    constructor(id: number, text: string) {
        this.id = id
        this.texto = text
        this.qtd_curtidas = 0
    }

    curtir(): void {
        this.qtd_curtidas++
    }

    toString(): string {
        let aux: string = `
        id Postagem: ${this.id}
        Quantidade de curtidas: ${this.qtd_curtidas}
        texto inserido: ${this.texto}
        `
        return aux
    }
}

class microBlog {
    Postagens: Postagem[] = []

    create(postagem: Postagem) {
        if (this.retrieve(postagem.id) == -1) {
            this.Postagens.push(postagem)
        } else {
            console.log("Postagem já existe!!")
        }
    }

    curtir_postagem(id: number) {
        let index: number = this.retrieve(id)

        if (index != -1) {
            this.Postagens[index].curtir()
        }
    }

    retrieve(id: number): number {
        let index: number = -1

        for (let i = 0; i < this.Postagens.length; i++) {
            if (this.Postagens[i].id == id) {
                index = i
                break
            }
        }

        return index
    }

    delete(id: number): void {
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
}

let blog: microBlog = new microBlog()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (request, response) => {
    response.send('Bem vindo ao microblog!!')
})

app.get('/posts', (request, response) => {
    response.send(blog.retrieveAll())
})

app.get('/posts/:id', (request, response) => {
    let id: number = parseInt(request.params.id)
    let index: number = blog.retrieve(id)

    if (index != -1) {
        response.send(blog.Postagens[index])
    } else {
        response.sendStatus(404)
    }
})

app.delete('/posts/:id', (request, response) => {
    let id: number = parseInt(request.params.id)
    let index: number = blog.retrieve(id)

    if (index != -1) {
        blog.delete(id)
        response.sendStatus(200)
    } else {
        response.sendStatus(404)
    }
})

app.post('/posts', (request, response) => {
    //uuid
    let id: string = uuidv4()
    let texto: string = request.body.texto

})