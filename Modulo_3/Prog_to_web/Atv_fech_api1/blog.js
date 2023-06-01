const posts = document.getElementsByClassName('post');

posts.forEach(async (post) => {
    const postid = post.id

    const btnLike = post.querySelector('#curtir_bnt');


    btnLike.onclick = async () => {
        const response = await fetch(`http://localhost:3000/posts/${postid}/like`, { method: 'POST' })
        if (response.status == 200) {
            const { likes } = await response.json();
            const postItens = post.querySelectorAll('p')
            postItens[1].innerText = `${parseInt(likes) + 1} like(s)`;
        } else {
            alert('Erro ao curtir post')
        }
    };
})

const loadPosts = async () => {
    const response = await fetch('http://localhost:3000/posts')
    let posts = await response.json();

    posts = posts.sort((a, b) => {
        a.data_criacao < b.data_criacao ? 1 : -1
    });
    posts.forEach(post => {
        appendPost(post);
    });
}

async function addPost() {

    const newPost = {
        "title": document.getElementById('post-tile').value,
        "text": document.getElementById('post-text').value,
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


appendPost = (post) => {
    const template = document.getElementById('post-template');
    const postElement = document.importNode(template.content, true);

    const postTitle = postElement.querySelectorAll('h3')[0]
    postTitle.innerText = post.title;
    const postItens = postElement.querySelectorAll('p')
    postItens[0].innerText = post.text;
    postItens[1].innerText = post.likes + " like(s)";

    document.getElementById('timeline').append(postElement);
}

deletePost = async (postid) => {
    const response = await fetch(`http://localhost:3000/posts/${postid}`, { method: 'DELETE' })
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

    const response = await fetch(`http://localhost:3000/posts/${postid}`, config);
    const post = await response.json();

    postTitle.innerText = post.title;
    postText.innerText = post.text;
}


window.onload = () => {
    const btnAddPost = document.getElementById('add-post')
    btnAddPost.onclick = addPost;
    loadPosts()
}