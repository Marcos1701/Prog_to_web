import { Request, Response } from 'express'

import { client } from './conf_bd_pg.js'
import { v4 as uuid } from 'uuid'
import crypto from 'crypto'

const validastring = (id: string) => {
    if (id === '' || id === undefined || id === null) {
        return false
    }
    return true
}

(async () => {
    try {
        await client.connect()

        await client.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id varchar not null PRIMARY KEY,
            nome_de_usuario varchar NOT NULL,
            senha varchar NOT NULL,
            token varchar not null
        )
    `);
        await client.query(`
        CREATE TABLE IF NOT EXISTS postagens (
         id varchar not null PRIMARY KEY,
         id_usuario varchar NOT NULL,
         title varchar NOT NULL,
         text varchar NOT NULL,
         likes INT,
         data_criacao DATE DEFAULT CURRENT_DATE,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
        )
    `);
        await client.query(`
    CREATE TABLE IF NOT EXISTS comentarios (
        id varchar PRIMARY KEY,
        text varchar NOT NULL,
        postagem_id varchar NOT NULL,
        data_criacao DATE DEFAULT CURRENT_DATE,
        FOREIGN KEY (postagem_id) REFERENCES postagens(id)
    );
    `);

        console.log("Banco de dados conectado com sucesso!!")
        // console.log("Tabelas criadas com sucesso!")
    } catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao criar tabelas: ${err.message}`)
        }
    }
})();

export async function insertUsuario(req: Request, res: Response) {
    const { nome_de_usuario, senha } = req.body
    const id: string = uuid()
    const header_token = JSON.stringify({
        "alg": "HS256",
        "typ": "JWT"
    })

    const payload_token = JSON.stringify({
        "nome_de_usuario": nome_de_usuario,
        "senha": senha
    })

    const base64Header = Buffer.from(header_token).toString('base64').replace(/=/g, '');
    const base64Payload = Buffer.from(payload_token).toString('base64').replace(/=/g, '');

    const data = base64Header + "." + base64Payload;
    const signature = crypto.createHmac('sha256', data)
        .update('segredo')
        .digest('base64').replace(/=/g, '');

    const token = data + "." + signature;
    if (!validastring(nome_de_usuario) && !validastring(senha)) {
        res.sendStatus(400);
    }
    try {
        await client.query(`INSERT INTO usuarios VALUES ('${id}','${nome_de_usuario}', '${senha}', '${token}')`)

        res.status(201).json({ "id": id, "token": token });
    } catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao inserir usuario: ${err.message}`)
            res.sendStatus(400);
        }
    }
}

export async function retrieveUsuario(req: Request, res: Response) {
    const { id } = req.params
    if (!validastring(id)) {
        res.sendStatus(400);
    }
    try {
        const usuario = await client.query(`SELECT * FROM usuarios WHERE id = '${id}'`)
        res.status(200).json({ "usuario": usuario.rows })
    } catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao buscar usuario: ${err.message}`)
            res.sendStatus(400);
        }
    }
}
export async function insertPostagem(req: Request, res: Response) {
    const { title, text, likes } = req.body
    const qtd_likes: number = Number(likes)
    try {
        const id: string = uuid()
        await client.query(`
        INSERT INTO postagens VALUES ('${id}','${title}', '${text}',${(!isNaN(qtd_likes)) ? qtd_likes : 0} , DEFAULT)`)
        res.status(201).json({ "id": id });
    } catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao inserir postagem: ${err.message}`)
            res.sendStatus(400);
        }
    }

}

export async function retrievePostagem(req: Request, res: Response) {

    const { id } = req.params
    if (!validastring(id)) {
        res.sendStatus(400);
    }
    try {
        const postagem = await client.query(`
        SELECT * FROM postagens WHERE id = '${id}'`)
        res.status(200).json({ "postagem": postagem.rows })
    } catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao buscar postagem: ${err.message}`)
            res.sendStatus(400);
        }
    }
}

export async function retrieveAllPostagens(req: Request, res: Response) {
    try {
        const postagens = await client.query(`
        SELECT * FROM postagens
        order by data_criacao desc`)
        res.status(200).json({ "postagens": postagens.rows })
    } catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao buscar postagens: ${err.message}`)
            res.sendStatus(400);
        }
    }
}

// export async function updatePostagem(req: Request, res: Response) {
//     const { id } = req.params
//     let { title, text, likes } = req.body
//     likes = parseInt(likes)
//     if (!validastring(text) && isNaN(likes) && validastring(title) || !validastring(id)) {
//         res.sendStatus(400);
//     }
//     try {
//         if (likes && title && text && !isNaN(likes)) {
//             await client.query(`
//             UPDATE postagens SET title = '${title}', text = '${text}', likes = ${likes} WHERE id = '${id}'`)

//         } else if (!isNaN(likes)) {
//             await client.query(`
//             UPDATE postagens SET text = '${text}', likes = ${likes} WHERE id = '${id}'`)
//         } else {
//             await client.query(`
//             UPDATE postagens SET text = '${text}' WHERE id = '${id}'`)
//         }
//         const novaPostagem = await client.query(`
//         SELECT * FROM postagens WHERE id = '${id}'`)
//         res.status(200).json({ "postagem": novaPostagem.rows });
//     } catch (err) {
//         if (err instanceof Error) {
//             console.log(`Erro ao atualizar postagem: ${err.message}`)
//             res.sendStatus(400);
//         }
//     }
// }

export async function deletePostagem(req: Request, res: Response) {
    const { id } = req.params

    if (!validastring(id)) {
        res.sendStatus(400);
    }
    try {
        await client.query(`
        DELETE FROM postagens WHERE id = '${id}'`)
        res.sendStatus(204);
    } catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao deletar postagem: ${err.message}`)
            res.sendStatus(400);
        }
    }
}

export async function curtirPostagem(req: Request, res: Response) {
    const { id } = req.params

    if (!validastring(id)) {
        res.sendStatus(400);
    }
    try {
        await client.query(`
        UPDATE postagens SET likes = likes + 1 WHERE id = '${id}'`)
        const likes = await client.query(`
        SELECT likes FROM postagens WHERE id = '${id}'`)
        const qtd_likes = likes.rows[0].likes
        res.status(200).json({ "likes": qtd_likes });
    } catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao curtir postagem: ${err.message}`)
            res.sendStatus(400);
        }
    }
}

export async function insertComentario(req: Request, res: Response) {
    const { id } = req.params
    const { text } = req.body

    if (!validastring(id) || !text || text === '') {
        res.sendStatus(400);
    }
    try {
        const id_comentario = uuid()
        await client.query(`
        INSERT INTO comentarios VALUES ('${id_comentario}', '${text}', '${id}', DEFAULT)`)
        res.status(201).json({ "id": id_comentario });
    } catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao inserir comentario: ${err.message}`)
            res.sendStatus(400);
        }
    }
}

export async function retrieveComentario(req: Request, res: Response) {
    const { id, id_comentario } = req.params
    if (!validastring(id) || !validastring(id_comentario)) {
        res.sendStatus(400);
    }
    try {
        const comentario = await client.query(`
        SELECT * FROM comentarios WHERE id = '${id_comentario}' and postagem_id = '${id}'`)
        res.json({ "comentario": comentario.rows })

    } catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao buscar comentario: ${err.message}`)
            res.sendStatus(400);
        }
    }
}

export async function retrieveAllComentariostoPostagem(req: Request, res: Response) {
    const { id } = req.params
    if (!validastring(id)) {
        res.sendStatus(400);
    }

    try {
        const comentarios = await client.query(`
        SELECT * FROM comentarios WHERE postagem_id = '${id}'
        `)
        res.status(200).json({ "comentarios": comentarios.rows })
    } catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao buscar comentarios: ${err.message}`)
            res.sendStatus(400);
        }
    }
}

export async function updateComentario(req: Request, res: Response) {
    const { id, id_comentario } = req.params
    const { text } = req.body
    if (!text || !validastring(id_comentario) || !validastring(id)) {
        res.sendStatus(400);
    }
    try {
        await client.query(`
        UPDATE comentarios SET text = '${text}' WHERE id = '${id_comentario}' and postagem_id = '${id}'`)

        const novoComentario = await client.query(`
        SELECT * FROM comentarios WHERE id = '${id_comentario}' and postagem_id = '${id}'`)
        res.status(200).json({ "comentario": novoComentario.rows });
    } catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao atualizar comentario: ${err.message}`)
            res.sendStatus(400);
        }
    }
}

export async function deleteComentario(req: Request, res: Response) {
    const { id, id_comentario } = req.params
    if (!validastring(id_comentario) || !validastring(id)) {
        res.sendStatus(400);
    }

    try {
        await client.query(`
        DELETE FROM comentarios WHERE id = '${id_comentario}' and postagem_id = '${id}'`)
        res.sendStatus(204);
    } catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao deletar comentario: ${err.message}`)
            res.sendStatus(400);
        }
    }
}
