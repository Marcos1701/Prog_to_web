const posts = document.getElementsByClassName('post');

posts.forEach(async (post) => {
    const postid = post.id

    const btnLike = post.querySelector('#curtir_bnt');


    btnLike.onclick = async () => {
        const response = await fetch(`http://localhost:3000/posts/${postid}/like`, { method: 'POST' })
        if (response.status == 200) {
            const likeCount = post.querySelector('#qtd_likes');
            likeCount.innerText = parseInt(likeCount.innerText) + 1;
        } else {
            alert('Erro ao curtir post')
        }
    };
})

const loadPosts = async () => {
    const response = await fetch('http://localhost:3000/posts')
    const posts = await response.json();

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

window.onload = () => {
    const btnAddPost = document.getElementById('add-post')
    btnAddPost.onclick = addPost;
    loadPosts()
}