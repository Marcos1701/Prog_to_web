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
        );
    `);
    await db.exec(`
        CREATE TABLE IF NOT EXISTS comentarios (
            id TEXT PRIMARY KEY,
            text TEXT NOT NULL,
            postagem_id TEXT NOT NULL,
            FOREIGN KEY (postagem_id) REFERENCES postagens(id)
        );
    `);
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

export async function insertComentario(id: string, text: string, postagem_id: string) {
    const db = await openDb()
    await db.run(`
        INSERT INTO comentarios (id, text, postagem_id) VALUES ('${id}', '${text}', '${postagem_id}')
    `)
}

export async function retrieveComentarios(postagem_id: string) {
    const db = await openDb()
    const comentarios = await db.all(`
        SELECT * FROM comentarios WHERE postagem_id = '${postagem_id}'
    `).then((rows) => {
        return rows
    })
    return comentarios
}

export async function retrieveComentario(id_postagem: string, id: string) {
    const db = await openDb()
    const comentario = await db.get(`
        SELECT * FROM comentarios WHERE id = '${id}' AND postagem_id = '${id_postagem}'
    `).then((row) => {
        return row
    }).catch((err) => {
        console.log(err)
    })

    if (!comentario) {
        throw new Error("Comentário não encontrado");
    }
    return comentario

}

export async function deleteComentario(id_postagem: string, id: string) {
    const db = await openDb()
    await db.run(`
        DELETE FROM comentarios WHERE id = '${id}' AND postagem_id = '${id_postagem}'
    `)
}

export async function updateComentario(id_postagem: string, id: string, text: string) {
    const db = await openDb()
    await db.run(`
        UPDATE comentarios SET text = '${text}' WHERE id = '${id}' AND postagem_id = '${id_postagem}'
    `)
}
// Import the functions you need from the SDKs you need
// import { initializeApp,FirebaseApp } from "firebase/app";
// import { getAnalytics, Analytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDE29LyTBwnUrcDDHZMcvKjZU-301tu2f4",
//   authDomain: "atv-fech-api.firebaseapp.com",
//   projectId: "atv-fech-api",
//   storageBucket: "atv-fech-api.appspot.com",
//   messagingSenderId: "595036280141",
//   appId: "1:595036280141:web:20b0d36d86213e2cb5d304",
//   measurementId: "G-B6HKVTXLYH"
// };

// // Initialize Firebase
// const app: FirebaseApp = initializeApp(firebaseConfig);
// const analytics: Analytics = getAnalytics(app);

//consulta de dados

// const db = getFirestore(app);

// const querySnapshot = await getDocs(collection(db, "postagens"));

// export default app;