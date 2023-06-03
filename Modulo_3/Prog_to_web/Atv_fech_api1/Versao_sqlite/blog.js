

loadPosts = async () => {
    const config = {
        method: 'GET',
        headers: new Headers({
            'Content-type': 'application/json'
        })
    };
    await fetch('http://localhost:3000/posts', config)
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                alert('Não foi possível carregar os posts');
            }
        })
        .then((data) => {
            if (!Array.isArray(data.postagens)) {
                data.postagens = [data.postagens]
            }
            for (let post of data.postagens) {
                appendPost(post);
            }
        })
        .catch((error) => {
            console.log(`Erro: ${error.message}`);
        });
}


CommentPost = async (id) => {
    const post = document.querySelector(`#${id}`);
    const text = post.querySelector('p').innerHTML;

    const div = document.createElement('div');
    div.className = 'commentPost';
    div.id = 'commentPost';
    const h2 = document.createElement('h2');
    h2.innerHTML = 'Comment Post';
    const inputText = document.createElement('input');
    inputText.type = 'text';
    inputText.id = 'text';
    inputText.value = text;
    const button = document.createElement('button');
    button.innerHTML = 'Save';
    button.onclick = async () => {
        const post = {
            text: inputText.value
        };
        const config = {
            method: 'POST',
            headers: new Headers({
                'Content-type': 'application/json'
            }),
            body: JSON.stringify(post)
        };
        await fetch(`http://localhost:3000/posts/${id}/comentarios`, config)
            .then((response) => {

                if (response.status === 204) {
                    const post = document.querySelector(`#${id}`);
                    post.querySelector('p').innerHTML = inputText.value;
                    div.remove();
                } else {
                    alert('Não foi possível editar o post');
                }
            }).catch((error) => {
                console.log(`Erro: ${error.message}`);
            });
    };
    div.append(h2);
    div.append(inputText);
    div.append(button);
    post.append(div);
}


function appendPost(post) {
    const template = document.getElementById('post-template');
    const postElement = document.importNode(template.content, true);
    const buttons = postElement.querySelectorAll('button')

    const like = buttons[0]
    const deletebnt = buttons[1]

    const postTitle = postElement.querySelectorAll('h3')[0]
    postTitle.innerText = post.title;
    const postItens = postElement.querySelectorAll('p')
    postItens[0].innerText = post.text;
    const likeCount = postElement.querySelector('.like-count');
    likeCount.innerText = post.likes
    const article = postElement.querySelectorAll('article')[0]
    article.id = post.id

    like.onclick = (event) => {
        event.preventDefault();
        addLike(post.id);
    };

    deletebnt.onclick = () => {
        deletePost(post.id)
    };
    const comments = postElement.querySelector('#comentarios')
    const templateComment = document.getElementById('comment-template')
    for (let comment of post.comentarios) {
        const commentElement = document.importNode(templateComment.content, true);
        const commentText = commentElement.querySelectorAll('p')[0]
        commentText.innerText = comment.text
        comments.append(commentElement)
    }

    const commentButton = postElement.querySelector('#comment-button')
    commentButton.onclick = () => {
        CommentPost(post.id)
    }

    const editButton = postElement.querySelector('#edit-button')
    editButton.onclick = () => {
        editPost(post.id)
    }

    document.getElementById('timeline').append(postElement);
}

addPost = async () => {
    const post = {
        title: document.getElementById('title').value,
        text: document.getElementById('text').value
    };

    const config = {
        method: 'POST',
        headers: new Headers({
            'Content-type': 'application/json'
        }),
        body: JSON.stringify(post)
    };

    await fetch('http://localhost:3000/posts', config)
        .then((response) => {
            if (response.status === 201) {
                return response.json();
            } else {
                alert('Não foi possível criar o post');
            }
        })
        .then((data) => {
            appendPost(data);
        })
        .catch((error) => {
            console.log(`Erro: ${error.message}`);
        });
}


addLike = async (id) => {
    const config = {
        method: 'POST',
        headers: new Headers({
            'Content-type': 'application/json'
        })
    };
    await fetch(`http://localhost:3000/posts/${id}/like`, config)
        .then((response) => {
            if (response.status === 201) {
                return response.json();
            } else {
                alert('Não foi possível curtir o post');
            }
        }).then((data) => {
            const post = document.querySelector(`#${id}`);
            post.querySelector('.like-count').innerText = data.likes;
        }).catch((error) => {
            console.log(`Erro: ${error.message}`);
        });
}

deletePost = async (id) => {
    const config = {
        method: 'DELETE',
        headers: new Headers({
            'Content-type': 'application/json'
        })
    };

    await fetch(`http://localhost:3000/posts/${id}`, config)
        .then((response) => {
            if (response.status === 204) {
                const post = document.querySelector(`#${id}`);
                post.remove();
            } else {
                alert('Não foi possível excluir o post');
            }
        }).catch((error) => {
            console.log(`Erro: ${error.message}`);
        });
}

editPost = async (id) => {
    const post = document.querySelector(`#${id}`);
    const title = post.querySelector('h2').innerHTML;
    const text = post.querySelector('p').innerHTML;

    const div = document.createElement('div');
    div.className = 'editPost';
    div.id = 'editPost';
    const h2 = document.createElement('h2');
    h2.innerHTML = 'Edit Post';
    const inputTitle = document.createElement('input');
    inputTitle.type = 'text';
    inputTitle.id = 'title';
    inputTitle.value = title;
    const inputText = document.createElement('input');
    inputText.type = 'text';
    inputText.id = 'text';
    inputText.value = text;
    const button = document.createElement('button');
    button.innerHTML = 'Save';
    button.onclick = async () => {
        const post = {
            title: inputTitle.value,
            text: inputText.value
        };
        const config = {
            method: 'PUT',
            headers: new Headers({
                'Content-type': 'application/json'
            }),
            body: JSON.stringify(post)
        };
        await fetch(`http://localhost:3000/posts/${id}`, config)
            .then((response) => {
                if (response.status === 204) {
                    const post = document.querySelector(`#${id}`);
                    post.querySelector('h2').innerHTML = inputTitle.value;
                    post.querySelector('p').innerHTML = inputText.value;
                    div.remove();
                } else {
                    alert('Não foi possível editar o post');
                }
            }).catch((error) => {
                console.log(`Erro: ${error.message}`);
            });
    }
    div.append(h2);
    div.append(inputTitle);
    div.append(inputText);
    div.append(button);
    post.append(div);
}


window.onload = () => {
    loadPosts();
    document.querySelector('#addPost').onclick = addPost;
}