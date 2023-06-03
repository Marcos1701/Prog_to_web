const curtirPost = async (postid) => {
    const config = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    await fetch(`http://localhost:3000/posts/${postid}/like`, config)
        .then(response => response.json())
        .then(post => {
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

    await fetch(`http://localhost:3000/posts/${postid}`, config)
        .then(response => response.json())
        .then(post => {
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

    const newComment = {
        "text": commentText.innerText
    };

    const config = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newComment)
    };

    await fetch(`http://localhost:3000/posts/${postid}/comentarios`, config)
        .then(response => response.json())
        .then(post => {
            if (response.status == 201) {
                const comentariosdiv = postElement.querySelectorAll('div')[0]
                const comentarioElement = document.createElement('p');
                comentarioElement.innerText = post.text;
                comentarioElement.className = 'comentario';
                comentarioElement.id = post.id;
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

    await fetch(`/posts/${postid}/comentarios/${commentid}`, config)
        .then(response => response.json())
        .then(post => {
            if (response.status == 200) {
                const comentarioElement = document.getElementById(commentid);
                comentarioElement.innerText = post.text;
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

    await fetch(`/posts/${postid}/comentarios/${commentid}`, config)
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
    await fetch('http://localhost:3000/posts')
        .then(response => response.json())
        .then(posts => {
            for (let post of posts) {
                appendPost(post);
            }
        });
}

const addPost = async () => {
    const postTitle = document.getElementById('new_post_title');
    const postText = document.getElementById('new_post_text');

    const newPost = {
        "title": postTitle.value,
        "text": postText.value,
        "likes": 0
    };

    const config = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
    };

    await fetch('http://localhost:3000/posts', config)
        .then(response => response.json())
        .then(post => {
            if (response.status == 201) {
                appendPost(post);
            } else {
                alert('Erro ao adicionar post')
            }
        });
}

// const appendPost = (post) => {
//     const postElement = document.createElement('div');
//     postElement.className = 'post';
//     postElement.id = post.id;

//     const postTitle = document.createElement('h3');
//     postTitle.innerText = post.title;
//     postTitle.contentEditable = true;
//     postTitle.addEventListener('blur', () => updatepost(post.id));
//     postElement.append(postTitle);

//     const postText = document.createElement('p');
//     postText.innerText = post.text;
//     postText.contentEditable = true;
//     postText.addEventListener('blur', () => updatepost(post.id));
//     postElement.append(postText);

//     const postLikes = document.createElement('p');
//     postLikes.innerText = post.likes + " like(s)";
//     postElement.append(postLikes);

//     const btnLike = document.createElement('button');
//     btnLike.innerText = 'Like';
//     btnLike.addEventListener('click', () => likePost(post.id));
//     postElement.append(btnLike);

//     const btnDelete = document.createElement('button');
//     btnDelete.innerText = 'Delete';
//     btnDelete.addEventListener('click', () => deletePost(post.id));
//     postElement.append(btnDelete);

//     const comentariosdiv = document.createElement('div');
//     comentariosdiv.className = 'comentarios';
//     postElement.append(comentariosdiv);

//     const newCommentText = document.createElement('p');
//     newCommentText.innerText = 'New comment';
//     newCommentText.contentEditable = true;
//     comentariosdiv.append(newCommentText);

//     const btnAddComment = document.createElement('button');
//     btnAddComment.innerText = 'Add comment';
//     btnAddComment.addEventListener('click', () => addComment(post.id));
//     comentariosdiv.append(btnAddComment);

//     for (let comment of post.comentarios) {
//         const comentarioElement = document.createElement('p');
//         comentarioElement.innerText = comment.text;
//         comentarioElement.className = 'comentario';
//         comentarioElement.id = comment.id;
//         comentarioElement.contentEditable = true;
//         comentarioElement.addEventListener('blur', () => updateComment(post.id, comment.id));
//         comentariosdiv.append(comentarioElement);

//         const btnDeleteComment = document.createElement('button');
//         btnDeleteComment.innerText = 'Delete';
//         btnDeleteComment.addEventListener('click', () => deleteComment(post.id, comment.id));
//         comentariosdiv.append(btnDeleteComment);
//     }

//     const postsdiv = document.getElementById('posts');
//     postsdiv.append(postElement);

// }

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

    await fetch(`http://localhost:3000/posts/${postid}`, config)
        .then(response => response.json())
        .then(post => {
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

    await fetch(`http://localhost:3000/posts/${postid}/likes`)
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

    await fetch(`http://localhost:3000/posts/${postid}`, config)
        .then(response => {
            if (response.status == 204) {
                const postElement = document.getElementById(postid);
                postElement.remove();
            } else {
                alert('Erro ao deletar post')
            }
        });
}

window.onload = async () => {
    const btnAddPost = document.getElementById('add_post')
    btnAddPost.addEventListener('click', addPost)
    await loadPosts()
}