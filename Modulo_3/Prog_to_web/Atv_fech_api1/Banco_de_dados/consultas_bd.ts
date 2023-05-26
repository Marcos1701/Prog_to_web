import {Request, Response} from 'express'
//npm i firestore-wrapper
//npm install firebase

import app from './conf_bd.js'
import { getFirestore, Firestore } from 'firebase/firestore/lite';
import {collection, getDocs, addDoc} from "firebase/firestore";
// import { DocumentData, DocumentReference } from '@firebase/firestore-types';



export async function retrievePostagens(req: Request, res: Response) {
    const db: Firestore = getFirestore(app)
    const postagens = await getDocs(collection(db, "postagens")).then((querySnapshot) => {
        const aux = querySnapshot.docs.map((doc) => {
            return {id: doc.id, ...doc.data()}
        })
        return aux
    }).catch((err) => {
        console.log(err)
        res.json({"StatusCode": 500, "Message": "Internal Server Error"})
        return
    })
    res.json(postagens)
}

export async function retrievePostagem(req: Request, res: Response) {
    const {id} = req.params

    if(!id) {
        res.json({"StatusCode": 400, "Message": "Bad Request"})
        return
    }

    const db: Firestore = getFirestore(app)
    const postagem = await getDocs(collection(db, "postagens")).then((querySnapshot) => {
        const aux = querySnapshot.docs.map((doc) => {
            return {id: doc.id, ...doc.data()}
        })
        return aux
    }).catch((err) => {
        console.log(err)
        res.json({"StatusCode": 500, "Message": "Internal Server Error"})
        return
    })

    if(postagem) {
        res.json(postagem)
        return
    }
    res.json({"StatusCode": 404, "Message": "Not Found"})
}

export async function insertPostagem(req: Request, res: Response) {

    const db: Firestore = getFirestore(app)

    const {id, text, likes} = req.body

    const postagem = await
        addDoc(collection(db, "postagens"), {
            id: id,
            text: text,
            likes: likes
        }).then((docRef) => {
            return docRef
        }
    ).catch((err) => {
        console.log(err)
        res.json({"StatusCode": 500, "Message": "Internal Server Error"})
        return
    })

    if(postagem != null) {
        res.json({"StatusCode": 201, "Message": "Created"})
        return
    }
    res.json({"StatusCode": 400, "Message": "Bad Request"})
}
