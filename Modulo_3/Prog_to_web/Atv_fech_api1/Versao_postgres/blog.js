const curtirPost = async (postid) => {
    const config = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    await fetch(`https://express-server-production-d5bc.up.railway.app/posts/${postid}/like`, config)
        .then(response => response.json())
        .then(retorno => {
            const post = retorno.postagem;
            if (response.status == 200) {
                const postElement = document.getElementById(postid);
                const postLikes = postElement.querySelectorAll('p')[1]
                postLikes.innerText = post.likes + " like(s)";
            } else {
                alert('Erro ao curtir post')
            }
        })
}


const appendPost = (post) => {
    const template = document.getElementById('post_template');
    const postElement = document.importNode(template.content, true);
    postElement.getElementById('post').id = post.id;

    const postTitle = postElement.querySelectorAll('h3')[0]
    postTitle.innerText = post.title;
    const postItens = postElement.querySelectorAll('p')
    postItens[0].innerText = post.text;
    postItens[1].innerText = post.likes + " like(s)";

    const comentarios = post.comentarios.sort((a, b) => {
        return a.data_criacao < b.data_criacao ? 1 : -1;
    });

    const comentariosdiv = postElement.querySelectorAll('div')[0]

    for (let comentario of comentarios) {
        const comentarioElement = document.createElement('p');
        comentarioElement.innerText = comentario.text;
        comentarioElement.className = 'comentario';
        comentarioElement.id = comentario.id;
        comentariosdiv.append(comentarioElement);
    }

    postItens[2].innerText = post.comentarios.length + " comentario(s)";

    document.getElementById('timeline').append(postElement);
}


const updatepost = async (postid) => {
    const postElement = document.getElementById(postid);
    const postTitle = postElement.querySelectorAll('h3')[0]
    const postText = postElement.querySelectorAll('p')[0]

    const newPost = {
        "title": postTitle.innerText,
        "text": postText.innerText,
        "likes": 0
    };

    const config = {
        'method': 'PUT',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
    };

    await fetch(`https://express-server-production-d5bc.up.railway.app/posts/${postid}`, config)
        .then(response => response.json())
        .then(retorno => {
            const post = retorno.postagem;

            if (response.status == 200) {
                postTitle.innerText = post.title;
                postText.innerText = post.text;
            } else {
                alert('Erro ao atualizar post')
            }
        });
}


const addComment = async (postid) => {
    const postElement = document.getElementById(postid);
    const commentText = postElement.querySelector('new_comment_text');
    const text = commentText.innerText

    const newComment = {
        "text": text
    };

    const config = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newComment)
    };

    await fetch(`https://express-server-production-d5bc.up.railway.app/posts/${postid}/comentarios`, config)
        .then(response => response.json())
        .then(retorno => {
            const id = retorno.id;

            if (response.status == 201) {
                const comentariosdiv = postElement.querySelectorAll('div')[0]
                const comentarioElement = document.createElement('p');
                comentarioElement.innerText = text;
                comentarioElement.className = 'comentario';
                comentarioElement.id = id;
                comentariosdiv.append(comentarioElement);
            } else {
                alert('Erro ao adicionar comentario')
            }
        });

}


const updateComment = async (postid, commentid) => {
    const postElement = document.getElementById(postid);
    const postText = postElement.querySelectorAll('p')[0]

    const newComment = {
        "text": postText.innerText
    };

    const config = {
        'method': 'PUT',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newComment)
    };

    await fetch(`https://express-server-production-d5bc.up.railway.app/posts/${postid}/comentarios/${commentid}`, config)
        .then(response => response.json())
        .then(retorno => {
            const comment = retorno.comentario;
            if (response.status == 200) {
                const comentarioElement = document.getElementById(commentid);
                comentarioElement.innerText = comment.text;
            } else {
                alert('Erro ao atualizar comentario')
            }
        });
}

const deleteComment = async (postid, commentid) => {
    const config = {
        'method': 'DELETE',
        'headers': {
            'Content-Type': 'application/json'
        }
    };

    await fetch(`https://express-server-production-d5bc.up.railway.app/posts/${postid}/comentarios/${commentid}`, config)
        .then(response => {
            if (response.status == 204) {
                const comentarioElement = document.getElementById(commentid);
                comentarioElement.remove();
            } else {
                alert('Erro ao deletar comentario')
            }
        });
}


const loadPosts = async () => {
    /*blog.js:26  Uncaught (in promise) TypeError: Cannot set properties of null (setting 'id')
    at appendPost (blog.js:26:43)
    at blog.js:182:17
    at async loadPosts (blog.js:175:5)
    at async window.onload (blog.js:294:5) */

    const config = {
        'method': 'GET',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    const response = await fetch('https://express-server-production-d5bc.up.railway.app/posts', config);
    let retorno = await response.json();
    const {postagens} = retorno
    console.log(postagens);

    for (let post of postagens) {
        appendPost(post);
    }
}

const addPost = async () => {
    const postTitle = document.getElementById('new_post_title');
    const postText = document.getElementById('new_post_text');
    const title = postTitle.value
    const text = postText.value

    const newPost = {
        "title": title,
        "text": text,
        "likes": 0
    };

    const config = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
    };

    await fetch('https://express-server-production-d5bc.up.railway.app/posts', config)
        .then(response => response.json())
        .then(retorno => {
            const id = retorno.id;
            if (response.status == 201 && id) {
                const post = {
                    "id": id,
                    "title": title,
                    "text": text,
                    "likes": 0
                };
                appendPost(post);
            } else {
                alert('Erro ao adicionar post')
            }
        });
}

const updatePost = async (postid) => {
    const postElement = document.getElementById(postid);
    const postTitle = postElement.querySelectorAll('h3')[0]
    const postText = postElement.querySelectorAll('p')[0]

    const newPost = {
        "title": postTitle.innerText,
        "text": postText.innerText
    };

    const config = {
        'method': 'PUT',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
    };

    await fetch(`https://express-server-production-d5bc.up.railway.app/posts/${postid}`, config)
        .then(response => response.json())
        .then(retorno => {
            const post = retorno.postagem;
            if (response.status == 200) {
                postTitle.innerText = post.title;
                postText.innerText = post.text;
            } else {
                alert('Erro ao atualizar post')
            }
        });
}

const likePost = async (postid) => {
    const postElement = document.getElementById(postid);
    const postLikes = postElement.querySelectorAll('p')[1]

    await fetch(`https://express-server-production-d5bc.up.railway.app/posts/${postid}/likes`)
        .then(response => response.json())
        .then(likes => {
            if (response.status == 200) {
                postLikes.innerText = likes + " like(s)";
            } else {
                alert('Erro ao atualizar post')
            }
        });
}


const deletePost = async (postid) => {
    const config = {
        'method': 'DELETE',
        'headers': {
            'Content-Type': 'application/json'
        }
    };

    await fetch(`https://express-server-production-d5bc.up.railway.app/posts/${postid}`, config)
        .then(response => {
            if (response.status == 204) {
                const postElement = document.getElementById(postid);
                postElement.remove();
            } else {
                alert('Erro ao deletar post')
            }
        });
}

window.onload = () => {
    const btnAddPost = document.getElementById('add_post')
    btnAddPost.addEventListener('click', addPost)
    loadPosts()
}
