const token = localStorage.getItem('token');
const id_usuario = localStorage.getItem("id_usuario");
const nome_de_usuario = localStorage.getItem('nome_de_usuario');

const curtirPost = async (postid) => {
    try {
        const config = {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "token": token })
        };
        const response = await fetch(`https://express-server-production-d5bc.up.railway.app/posts/${postid}/like`, config)
        const retorno = await response.json();
        if (response.status == 200) {
            const postElement = document.getElementById(postid);
            const postLikes = postElement.querySelector('#qtd_likes')
            const { likes } = retorno;

            postLikes.innerText = likes + " like(s)";
        } else {
            document.querySelector(`#${postid} #msg_erro-post`).innerText = 'Erro ao curtir post'
        }
    } catch (error) {
        console.log(error)
    }
}

const getusernameById = async (id) => {
    try {
        const config = {
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json'
            }
        };
        const response = await fetch(`https://express-server-production-d5bc.up.railway.app/usuarios/${id}`, config)
        const { nome_de_usuario } = await response.json();
        if (response.status == 200) {
            return nome_de_usuario;
        } else {
            document.querySelector(`#${postid} #msg_erro-post`).innerText = 'Erro ao curtir post'
        }
    } catch (error) {
        console.log(error)
    }
}


const appendPost = async (post) => {

    try {
        if (!post) {
            return;
        }
        const template = document.getElementById('post_template');
        const postElement = document.importNode(template.content, true);
        const id = post.id;
        postElement.querySelector('.post').id = id;


        if (post["id_usuario"] === id_usuario) {
            postElement.querySelector('#excluir_post_bnt').addEventListener('click', function () {
                const confirma = confirm('Deseja excluir o post?')
                if (confirma) {
                    deletePost(id);
                }
            });
        } else {
            postElement.querySelector('#excluir_post_bnt').remove();
        }
        postElement.querySelector('#criador').innerText = "Criado por: " + post.criador;


        const postTitle = postElement.querySelector('#post_title')
        postTitle.innerText = post.title;
        postElement.querySelector('#content-post').innerText = post.text;
        const divLikes = postElement.querySelector('#likes');
        divLikes.querySelector('#qtd_likes').innerText = post.likes + " like(s)";
        divLikes.querySelector('a').addEventListener('click', () => {
            curtirPost(id);
        });
        const divComments = postElement.querySelector('#comentarios-conteiner');
        const add_comment_bnt = divComments.querySelector('#add_comment');
        add_comment_bnt.addEventListener('click', () => {
            const div = divComments.querySelector('#new_comment');
            div.removeAttribute('hidden');
            add_comment_bnt.setAttribute('hidden', true);
        });
        const enviar_comentario_bnt = divComments.querySelector('#comentar_bnt');
        enviar_comentario_bnt.addEventListener('click', () => {
            addComment(id);
        });

        const cancelar_comentario_bnt = divComments.querySelector('#cancelar_comentario_bnt');
        cancelar_comentario_bnt.addEventListener('click', () => {
            const div = divComments.querySelector('#new_comment');
            div.setAttribute('hidden', true);
            add_comment_bnt.removeAttribute('hidden');
        });

        const comentariosdiv = postElement.querySelector('#comentarios-conteiner');
        comentariosdiv.querySelector('#count_comments').innerText = post.comentarios.length + " comentario(s)";

        const primeiroPost = document.getElementById('timeline').firstChild;
        if (primeiroPost) {
            document.getElementById('timeline').insertBefore(postElement, primeiroPost);
        } else {
            document.getElementById('timeline').appendChild(postElement);
        }
        const comentariosElement = comentariosdiv.querySelector('#comentarios')
        if (post.comentarios && post.comentarios.length > 0) {

            for (let comentario of post.comentarios) {
                comentario.criador = await getusernameById(comentario["id_usuario"]);
                appendComment(id, comentario);
            }

            if (comentariosElement.children.length > 3) {
                const verMaisBnt = comentariosdiv.querySelector('#ver_mais');
                verMaisBnt.removeAttribute('hidden');
                verMaisBnt.addEventListener('click', () => {
                    for (let i = 3; i < comentariosElement.children.length; i++) {
                        comentariosElement.children[i].removeAttribute('hidden');
                    }
                    verMaisBnt.innerText = "Ver menos";
                    verMaisBnt.addEventListener('click', () => {
                        for (let i = 3; i < comentariosElement.children.length; i++) {
                            comentariosElement.children[i].setAttribute('hidden', true);
                        }
                        verMaisBnt.innerText = "Ver mais";
                    });
                });
                atualizacomentariosPost(post.id);
            }

        } else {
            comentariosElement.innerText = "Sem comentarios";
        }
    } catch (error) {
        console.log(`Ocorreu um erro ao carregar o post ${post.id}`)
        console.log(error)

    }
}

const appendComment = async (postid, comment) => {
    try {
        const postElement = document.getElementById(postid);

        if (postElement) {
            const comentariosdiv = postElement.querySelector('#comentarios');
            const template = document.getElementById('comentario-template');
            const comentarioElement = document.importNode(template.content, true);

            comentarioElement.querySelector('.comentario').id = comment.id;
            comentarioElement.querySelector('.comentario #comment_text').innerText = comment.text;
            if (comment.id_usuario === id_usuario) {
                comentarioElement.querySelector('.comentario #excluir_comentario_bnt').addEventListener('click', function () {
                    const confirma = confirm('Deseja excluir o comentario?')
                    if (confirma) {
                        deleteComment(postid, comment.id);
                    }
                });
            } else {
                comentarioElement.querySelector('.comentario #excluir_comentario_bnt').remove();
            }
            comentarioElement.querySelector('.comentario #criador').innerText = "Criado por: " + comment.criador;

            const primeiroComentario = comentariosdiv.firstChild;
            if (primeiroComentario) {
                comentariosdiv.insertBefore(comentarioElement, primeiroComentario);
            } else {
                comentariosdiv.append(comentarioElement);
            }
        } else {
            console.log(`post id ${postid} não encontrado`)
        }
    }
    catch (error) {
        console.log(`Ocorreu um erro ao carregar o comentario ${comment.id}`)
        console.log(error)
    }
}

const addComment = async (postid) => {
    try {
        const postElement = document.getElementById(postid);
        const commentText = postElement.querySelector('#new_comment_text');
        const text = commentText.value;

        if (!text || text.length < 1 || text === "") {
            document.getElementById(postid).querySelector(`#comments_error`).innerText = "Comentario vazio!!";
            return;
        }

        const newComment = {
            "text": text,
            "token": token
        };

        const config = {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newComment)
        };

        await fetch(`https://express-server-production-d5bc.up.railway.app/posts/${postid}/comentarios`, config)
            .then(async response => {
                const retorno = await response.json();
                const id = retorno.id;

                if (response.status === 201) {
                    appendComment(postid, { id, text, criador: nome_de_usuario, id_usuario });
                    atualizaQtdComentarios(postid)
                    atualizacomentariosPost(postid);
                    document.getElementById(postid).querySelector(`#comments_error`).innerText = "";
                } else {
                    document.getElementById(postid).querySelector(`#comments_error`).innerText = "Erro ao adicionar comentario!!";
                }
                commentText.value = "";
            });
    } catch (error) {
        console.log(error)
    }
}

const atualizacomentariosPost = async (postid) => {
    try {
        const comentariosElement = document.getElementById(postid).querySelector('#comentarios');

        if (comentariosElement) {
            if (comentariosElement.children.length === 0) {
                comentariosElement.innerText = "Sem comentarios";
            } else if (comentariosElement.children.length > 3) {
                for (let i = 3; i < comentariosElement.children.length; i++) {
                    comentariosElement.children[i].setAttribute('hidden', true);
                }
                const verMaisBnt = comentariosElement.querySelector('#ver_mais');
                verMaisBnt.innerText = "Ver mais";

                verMaisBnt.addEventListener('click', () => {
                    for (let i = 3; i < comentariosElement.children.length; i++) {
                        comentariosElement.children[i].removeAttribute('hidden');
                    }
                    verMaisBnt.innerText = "Ver menos";
                    verMaisBnt.addEventListener('click', () => {
                        for (let i = 3; i < comentariosElement.children.length; i++) {
                            comentariosElement.children[i].setAttribute('hidden', true);
                        }
                        verMaisBnt.innerText = "Ver mais";
                    });
                });
                verMaisBnt.removeAttribute('hidden');
            }
        }
    } catch (error) {
        console.log(error)
    }
}



const deleteComment = async (postid, commentid) => {
    try {
        const config = {
            'method': 'DELETE',
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "token": token })
        };

        await fetch(`https://express-server-production-d5bc.up.railway.app/posts/${postid}/comentarios/${commentid}`, config)
            .then(response => {
                if (response.status == 204) {
                    const comentarioElement = document.getElementById(commentid);
                    comentarioElement.remove();
                    atualizaQtdComentarios(postid);
                    document.getElementById(postid).querySelector(`#comments_error`).innerText = "";
                    atualizacomentariosPost(postid);

                } else {
                    response.text().then(text => {
                        document.getElementById(postid).querySelector(`#comments_error`).innerText = text;
                    });
                }
            });
    } catch (error) {
        console.log(`Ocorreu um erro ao excluir o comentario ${commentid}`)
        console.log(error)
    }
}

const atualizaQtdComentarios = (postid) => {
    const postElement = document.getElementById(postid);
    const comentariosconteiner = postElement.querySelector('#comentarios-conteiner');
    const comentariosdiv = comentariosconteiner.querySelector('#comentarios');

    const qtdComments = comentariosdiv.children.length;
    if (qtdComments) {
        if (qtdComments == 0) {
            comentariosdiv.innerText = "Sem comentarios";
        } else {
            comentariosconteiner.querySelector('#count_comments').innerText = `${qtdComments} comentario(s)`
        }
    }
}



const loadPosts = async () => {
    try {
        const config = {
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json'
            }
        };
        const response = await fetch('https://express-server-production-d5bc.up.railway.app/posts', config);
        const retorno = await response.json();
        let { postagens } = retorno;

        // Ordenar as postagens com base na data de criação (da mais recente para a mais antiga)
        postagens.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        for (let i = 0; i < postagens.length; i++) {
            const post = postagens[i];
            post.comentarios = await getComments(post["id"]);
            post.criador = await getusernameById(post["id_usuario"])

            appendPost(post);
        }
    } catch (error) {
        console.log(`Ocorreu um erro ao carregar os posts`)
        console.log(error)
    }
}


const getComments = async (postid) => {
    try {
        const config = {
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json'
            }
        };

        const response = await fetch(`https://express-server-production-d5bc.up.railway.app/posts/${postid}/comentarios`, config);
        const retorno = await response.json();
        let { comentarios } = retorno;

        // Ordenar os comentários com base na data de criação (do mais recente para o mais antigo)
        comentarios.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // console.log(comentarios)

        return comentarios;
    } catch (error) {
        console.log(`Ocorreu um erro ao carregar os comentarios do post ${postid}`)
        console.log(error)
    }
};


const addPost = async () => {
    try {
        const postTitle = document.getElementById('input-post_title');
        const postText = document.getElementById('input-post_text');
        const title = postTitle.value
        const text = postText.value

        if (!title || title.length < 1 || title === "") {
            postTitle.focus();
            return;
        }

        if (!text || text.length < 1 || text === "") {
            postText.focus();
            return;
        }

        const newPost = {
            "title": title,
            "text": text,
            "token": token
        };

        const config = {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPost)
        };

        const response = await fetch('https://express-server-production-d5bc.up.railway.app/posts', config);
        const retorno = await response.json()
            .catch(e => console.log(`Erro: ${e}`));
        const { id } = retorno;
        if (response.status == 201 && id) {
            const post = {
                "id": id,
                "title": title,
                "text": text,
                "likes": 0,
                "comentarios": [],
                "criador": nome_de_usuario,
                "id_usuario": id_usuario
            };
            appendPost(post);
            postTitle.value = '';
            postText.value = '';
            document.getElementById('msg_erro').innerText = '';
        } else {
            response.text().then(text => {
                console.log(text);
            });
            document.getElementById('msg_erro').innerText = 'Erro ao adicionar post';
        }
    } catch (e) {
        console.log(e)
    }

}


const likePost = async (postid) => {
    try {
        const postElement = document.getElementById(postid);
        const postLikes = postElement.querySelectorAll('p')[1]

        const config = {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "token": token })
        };

        await fetch(`https://express-server-production-d5bc.up.railway.app/posts/${postid}/likes`, config)
            .then(response => response.json())
            .then(likes => {
                if (response.status == 200) {
                    postLikes.innerText = likes + " like(s)";
                } else {
                    alert('Erro ao atualizar post')
                }
            });
    } catch (error) {
        console.log(`Ocorreu um erro ao curtir o post ${postid}`)
        console.log(error)
    }
}


const deletePost = async (postid) => {
    try {
        const config = {
            'method': 'DELETE',
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "token": token })
        };

        await fetch(`https://express-server-production-d5bc.up.railway.app/posts/${postid}`, config)
            .then(response => {
                if (response.status == 204) {
                    const postElement = document.getElementById(postid);
                    postElement.remove();
                } else {
                    response.text().then(text => {
                        document.getElementById('msg_erro').innerText = text;
                    });
                }
            });
    } catch (error) {
        console.log(`Ocorreu um erro ao excluir o post ${postid}`)
        console.log(error)
    }
}

const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('id')
    localStorage.removeItem('nome_de_usuario')
    window.location.href = 'login.html'
}

window.onload = () => {
    if (!token || token == 'undefined' || !id_usuario || !nome_de_usuario) {
        window.location.href = 'login.html';
    }
    const btnLogout = document.getElementById('logout')
    btnLogout.addEventListener('click', logout)
    const boas_vindas = document.getElementById('nome_usuario-msg')
    boas_vindas.innerText = `Olá, ${nome_de_usuario}`
    const btnAddPost = document.getElementById('add_post')
    btnAddPost.addEventListener('click', addPost)
    loadPosts()
}
