import sqlite3 from "sqlite3";
import { open } from "sqlite";


export async function openDb() {
    return open({
        filename: './app.db',
        driver: sqlite3.Database
    })
}
export async function createTable() {
    const db = await openDb()
    await db.exec(`
        CREATE TABLE IF NOT EXISTS postagens (
            id TEXT PRIMARY KEY,
            text TEXT NOT NULL,
            likes INTEGER
        )
    `)
}

export async function insertPostagem(id: string, text: string, likes: number): Promise<void> {
    const db = await openDb()
    await db.run(`
        INSERT INTO postagens (id, text, likes) VALUES ('${id}', '${text}', ${likes})
    `)
}

export async function retrievePostagem(id: string): Promise<any> {
    const db = await openDb()
    const postagem = await db.get(`
        SELECT * FROM postagens WHERE id = '${id}'
    `).then((row) => {
        return row
    }).catch((err) => {
        console.log(err)
    })

    if (postagem) {
        return postagem;
    } else {
        throw new Error("Postagem não encontrada");
    }
}


export async function retrieveAllPostagens() {
    const db = await openDb()
    const postagens = await db.all(`
        SELECT * FROM postagens
    `).then((rows) => {
        return rows
    })
    return postagens
}

export async function updatePostagem(id: string, text: string, likes: number) {
    const db = await openDb()
    await db.run(`
        UPDATE postagens SET text = '${text}', likes = ${likes} WHERE id = '${id}'
    `)
}

export async function deletePostagem(id: string) {
    const db = await openDb()
    await db.run(`
        DELETE FROM postagens WHERE id = '${id}'
    `).then((row) => {
        return row
    }).catch((err) => {
        console.log(err)
    })
}

export async function curtirPostagem(id: string) {
    const db = await openDb()
    await db.run(`
        UPDATE postagens SET likes = likes + 1 WHERE id = '${id}'
    `)
}