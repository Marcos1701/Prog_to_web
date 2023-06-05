const posts = document.getElementsByClassName('post');

posts.forEach(async (post) => {
    const postid = post.id

    const btnLike = post.querySelector('#curtir_bnt');
    const bntcomentar = post.querySelector('#comentar_bnt');


    btnLike.onclick = async () => {
        await curtirPost(postid);
    };

    bntcomentar.onclick = async () => {
        await addComment(postid);
    };
})

loadPosts = async () => {
    const response = await fetch('http://localhost:3000/posts');
    const posts = await response.json();

    for (let post of Array.from(posts)) {
        appendPost(post);
    }
}

addPost = async () => {

    const postTitle = document.getElementById('post-tile');
    const postText = document.getElementById('post-text');

    const newPost = {
        "title": postTitle.innerText,
        "text": postText.innerText,
        "likes": 0
    };

    const config = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
    };

    const response = await fetch('http://localhost:3000/posts', config);
    const post = await response.json();

    appendPost(post);
}

curtirPost = async (postid) => {
    const response = await fetch(`http://localhost:3000/posts/${postid}/like`, { method: 'POST' })
    if (response.status == 200) {
        const { likes } = await response.json();
        const post = document.getElementById(postid);
        const postItens = post.querySelectorAll('p')
        postItens[1].innerText = `${parseInt(likes) + 1} like(s)`;
    } else {
        alert('Erro ao curtir post')
    }
}


appendPost = (post) => {
    const template = document.getElementById('post-template');
    const postElement = document.importNode(template.content, true);
    postElement.getElementById('post').id = post.id;

    const postTitle = postElement.querySelectorAll('h3')[0]
    postTitle.innerText = post.title;
    const postItens = postElement.querySelectorAll('p')
    postItens[0].innerText = post.text;
    postItens[1].innerText = post.likes + " like(s)";

    const comentarios = post.comentarios.sort((a, b) => {
        a.data_criacao < b.data_criacao ? 1 : -1
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

// appendPost = (post) => {

//     const postElement = document.createElement('div');
//     postElement.className = 'post';
//     postElement.id = post.id;

//     const postTitle = document.createElement('h3');
//     postTitle.innerText = post.title;

//     const postText = document.createElement('p');
//     postText.innerText = post.text;

//     const postLikes = document.createElement('p');
//     postLikes.innerText = `${post.likes} like(s)`;

//     const btnLike = document.createElement('button');
//     btnLike.innerText = 'Curtir';
//     btnLike.id = 'curtir_bnt';

//     const btnDelete = document.createElement('button');
//     btnDelete.innerText = 'Deletar';
//     btnDelete.id = 'deletar_bnt';

//     const btnUpdate = document.createElement('button');
//     btnUpdate.innerText = 'Atualizar';
//     btnUpdate.id = 'atualizar_bnt';

//     const btnComment = document.createElement('button');
//     btnComment.innerText = 'Comentar';
//     btnComment.id = 'comentar_bnt';

//     postElement.appendChild(postTitle);
//     postElement.appendChild(postText);
//     postElement.appendChild(postLikes);
//     postElement.appendChild(btnLike);
//     postElement.appendChild(btnDelete);
//     postElement.appendChild(btnUpdate);
//     postElement.appendChild(btnComment);

//     const posts = document.getElementById('timeline');
//     posts.appendChild(postElement);

//     btnLike.onclick = async () => {
//         await curtirPost(post.id);
//     };

//     btnDelete.onclick = async () => {
//         await deletePost(post.id);
//     };

//     btnUpdate.onclick = async () => {
//         await updatepost(post.id);
//     };

//     btnComment.onclick = async () => {
//         await addComment(post.id);
//     };
// }

deletePost = async (postid) => {
    const config = {
        'method': 'DELETE',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "id": postid })
    };

    const response = await fetch(`http://localhost:3000/posts/:id`, config);

    if (response.status == 204) {
        const postElement = document.getElementById(postid);
        postElement.remove();
    } else {
        alert('Erro ao deletar post')
    }
}


updatepost = async (postid) => {
    const postElement = document.getElementById(postid);
    const postTitle = postElement.querySelectorAll('h3')[0]
    const postText = postElement.querySelectorAll('p')[0]

    const newPost = {
        "id": postid,
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

    const response = await fetch(`http://localhost:3000/posts/:id`, config);
    const post = await response.json();

    postTitle.innerText = post.title;
    postText.innerText = post.text;
}


addComment = async (postid) => {
    const postElement = document.getElementById(postid);
    const commentText = postElement.getElementById('new_comment_text');

    const newComment = {
        "id": postid,
        "text": commentText.innerText
    };

    const config = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newComment)
    };

    const response = await fetch(`http://localhost:3000/posts/:id/comment`, config);
    const post = await response.json();

    postText.innerText = post.text;
}


updateComment = async (postid, commentid) => {
    const postElement = document.getElementById(postid);
    const postText = postElement.querySelectorAll('p')[0]

    const newComment = {
        "id": postid,
        "id_do_comentario": commentid,
        "text": postText.innerText
    };

    const config = {
        'method': 'PUT',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newComment)
    };

    const response = await fetch(`/posts/:id/comentarios/:id_comentario`, config);
    const post = await response.json();

    postText.innerText = post.text;
}


window.onload = () => {
    const btnAddPost = document.getElementById('add-post')
    btnAddPost.addEventListener('click', addPost)
    loadPosts()
}

