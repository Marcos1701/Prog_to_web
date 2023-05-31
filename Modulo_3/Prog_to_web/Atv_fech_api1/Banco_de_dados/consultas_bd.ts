import {Request, Response} from 'express'

import {client} from './conf_bd_pg.js'
import {v4 as uuid} from 'uuid'

const validaid = (id: string) => {
    if(id === '' || id === undefined || id === null){
        return false
    }
    return true
}
(async () => {
    try{
        await client.connect()
  await client.query(`
    CREATE TABLE IF NOT EXISTS postagens (
        id TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        likes INTEGER
    );
`);
    await client.query(`
    CREATE TABLE IF NOT EXISTS comentarios (
        id TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        postagem_id TEXT NOT NULL,
        FOREIGN KEY (postagem_id) REFERENCES postagens(id)
    `);
    console.log("Banco de dados conectado com sucesso!!")
    // console.log("Tabelas criadas com sucesso!")
    }catch(err){
        if(err instanceof Error){
            console.log(`Erro ao criar tabelas: ${err.message}`)
        }
    }
})();

export async function insertPostagem(req: Request, res: Response) {
    const { text, likes} = req.body
    try{
        await client.query(`
        INSERT INTO postagens (id, text, likes) VALUES ('${uuid()}', '${text}', ${likes})`)
        res.sendStatus(201);
    }catch(err){
        if(err instanceof Error){
            console.log(`Erro ao inserir postagem: ${err.message}`)
            res.sendStatus(400);
        }
    }
   
}

export async function retrievePostagem(req: Request, res: Response) {

    const {id} = req.params
    if(!validaid(id)){
        res.send({"erro": "id inválido",
                  "StatusCode": "400"});
    }
    try{
        const postagem = await client.query(`
        SELECT * FROM postagens WHERE id = '${id}'`)
        res.send({"postagem": postagem.rows})
    }catch(err){
        if(err instanceof Error){
            console.log(`Erro ao buscar postagem: ${err.message}`)
            res.sendStatus(400);
        }
    }
}

export async function retrieveAllPostagens(req: Request, res: Response) {
    try{
        const postagens = await client.query(`
        SELECT * FROM postagens`)
        res.send({"postagens: ": postagens.rows})
    }catch(err){
        if(err instanceof Error){
            console.log(`Erro ao buscar postagens: ${err.message}`)
            res.sendStatus(400);
        }
    }
}

export async function updatePostagem(req: Request, res: Response) {
    const {id} = req.params
    const {text, likes} = req.body
    if(!text && !likes || !validaid(id)){
        res.sendStatus(400);
    }
    try{
        if(likes){
            await client.query(`
            UPDATE postagens SET text = '${text}', likes = ${likes} WHERE id = '${id}'`)
        }else{
            await client.query(`
            UPDATE postagens SET text = '${text}' WHERE id = '${id}'`)
        }
        res.sendStatus(200);
    }catch(err){
        if(err instanceof Error){
            console.log(`Erro ao atualizar postagem: ${err.message}`)
            res.sendStatus(400);
        }
    }
}

export async function deletePostagem(req: Request, res: Response) {
    const {id} = req.params

    if(!validaid(id)){
        res.sendStatus(400);
    }
    try{
        await client.query(`
        DELETE FROM postagens WHERE id = '${id}'`)
        res.sendStatus(200);
    }catch(err){
        if(err instanceof Error){
            console.log(`Erro ao deletar postagem: ${err.message}`)
            res.sendStatus(400);
        }
    }
}

export async function curtirPostagem(req: Request, res: Response) {
    const {id} = req.params

    if(!validaid(id)){
        res.sendStatus(400);
    }
    try{
        await client.query(`
        UPDATE postagens SET likes = likes + 1 WHERE id = '${id}'`)
        res.sendStatus(200);
    }catch(err){
        if(err instanceof Error){
            console.log(`Erro ao curtir postagem: ${err.message}`)
            res.sendStatus(400);
        }
    }
}

export async function insertComentario(req: Request, res: Response) {
    const {text, postagem_id} = req.body

    if(!validaid(postagem_id)){
        res.sendStatus(400);
    }
    try{
        await client.query(`
        INSERT INTO comentarios (id, text, postagem_id) VALUES ('${uuid()}', '${text}', '${postagem_id}')`)
        res.sendStatus(201);
    }catch(err){
        if(err instanceof Error){
            console.log(`Erro ao inserir comentario: ${err.message}`)
            res.sendStatus(400);
        }
    }
}

export async function retrieveComentario(req: Request, res: Response) {
    const {id} = req.params
    if(!validaid(id)){
        res.send({"erro": "id inválido",
                    "StatusCode": "400"});
    }
    try{
        const comentario = await client.query(`
        SELECT * FROM comentarios WHERE id = '${id}'`)
        res.send({"comentario": comentario.rows})
    }catch(err){
        if(err instanceof Error){
            console.log(`Erro ao buscar comentario: ${err.message}`)
            res.sendStatus(400);
        }
    }
}

export async function retrieveAllComentariostoPostagem(req: Request, res: Response) {
    const {postagem_id} = req.params
    if(!validaid(postagem_id)){
        res.send({"erro": "id inválido",
                    "StatusCode": "400"});
    }

    try{
        const comentarios = await client.query(`
        SELECT * FROM comentarios WHERE postagem_id = '${postagem_id}'`)
        res.send({"comentarios": comentarios.rows})
    }catch(err){
        if(err instanceof Error){
            console.log(`Erro ao buscar comentarios: ${err.message}`)
            res.sendStatus(400);
        }
    }
}

export async function updateComentario(req: Request, res: Response) {
    const {id} = req.params
    const {text} = req.body
    if(!text || !validaid(id)){
        res.sendStatus(400);
    }
    try{
        await client.query(`
        UPDATE comentarios SET text = '${text}' WHERE id = '${id}'`)
        res.sendStatus(200);
    }catch(err){
        if(err instanceof Error){
            console.log(`Erro ao atualizar comentario: ${err.message}`)
            res.sendStatus(400);
        }
    }
}

export async function deleteComentario(req: Request, res: Response) {
    const {id} = req.params
    if(!validaid(id)){
        res.sendStatus(400);
    }

    try{
        await client.query(`
        DELETE FROM comentarios WHERE id = '${id}'`)
        res.sendStatus(200);
    }catch(err){
        if(err instanceof Error){
            console.log(`Erro ao deletar comentario: ${err.message}`)
            res.sendStatus(400);
        }
    }
}