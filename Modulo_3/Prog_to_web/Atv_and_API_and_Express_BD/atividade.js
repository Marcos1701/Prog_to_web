"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var app = express();
var port = 3000;
var uuid_1 = require("uuid");
var Postagem = /** @class */ (function () {
    function Postagem(id, text, likes) {
        this.id = id;
        this.texto = text;
        this.likes = likes ? likes : 0;
    }
    Postagem.prototype.curtir = function () {
        this.likes++;
    };
    Postagem.prototype.toString = function () {
        var aux = "\n        id Postagem: ".concat(this.id, "\n        Quantidade de curtidas: ").concat(this.likes, "\n        texto inserido: ").concat(this.texto, "\n        ");
        return aux;
    };
    return Postagem;
}());
var microBlog = /** @class */ (function () {
    function microBlog() {
        this.Postagens = [];
    }
    microBlog.prototype.create = function (postagem) {
        if (this.retrieve(postagem.id) == -1) {
            this.Postagens.push(postagem);
        }
        else {
            console.log("Postagem já existe!!");
        }
    };
    microBlog.prototype.curtir_postagem = function (id) {
        var index = this.retrieve(id);
        if (index != -1) {
            this.Postagens[index].curtir();
            return 200;
        }
        return 404;
    };
    microBlog.prototype.retrieve = function (id) {
        var index = -1;
        for (var i = 0; i < this.Postagens.length; i++) {
            if (this.Postagens[i].id == id) {
                index = i;
                break;
            }
        }
        return index;
    };
    microBlog.prototype.delete = function (id) {
        var index = this.retrieve(id);
        if (index != -1) {
            for (var i = index; i < this.Postagens.length; i++) {
                this.Postagens[i] = this.Postagens[i + 1];
            }
            this.Postagens.pop();
        }
        return;
    };
    microBlog.prototype.update = function (postagem) {
        var index = this.retrieve(postagem.id);
        if (index != -1) {
            this.Postagens[index] = postagem;
        }
    };
    microBlog.prototype.retrieveAll = function () {
        return this.Postagens;
    };
    microBlog.prototype.toString_geral = function () {
        var aux = '';
        for (var _i = 0, _a = this.Postagens; _i < _a.length; _i++) {
            var postagem = _a[_i];
            aux += postagem.toString();
        }
        return aux;
    };
    microBlog.prototype.get_postagem = function (index) {
        return this.Postagens[index];
    };
    return microBlog;
}());
var blog = new microBlog();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/', function (request, response) {
    response.send('Bem vindo ao microblog!!');
});
app.get('/posts', function (request, response) {
    response.json({ "Posts": blog.retrieveAll() });
});
app.get('/posts/:id', function (request, response) {
    var id = request.body.id;
    var index = blog.retrieve(id);
    if (index != -1) {
        response.json({ "Postagem": blog.get_postagem(index) });
    }
    else {
        response.sendStatus(404).send("Postagem não encontrada!!");
    }
});
app.delete('/posts/:id', function (request, response) {
    var id = request.body.id;
    var index = blog.retrieve(id);
    if (index != -1) {
        blog.delete(id);
        response.sendStatus(204);
    }
    else {
        response.sendStatus(404);
    }
});
app.post('/posts', function (request, response) {
    //uuid
    var id = (0, uuid_1.v4)();
    var texto = request.body.texto;
    var novo_post = new Postagem(id, texto);
    blog.create(novo_post);
    response.sendStatus(201).json({ "novo_post": blog.retrieve(id) });
});
app.put('/posts/:id', function (request, response) {
    var id = request.body.id;
    var index = blog.retrieve(id);
    if (index === -1) {
        response.sendStatus(404);
    }
    var text = request.body.texto;
    var post_alterado = new Postagem(id, text);
    blog.update(post_alterado);
    response.sendStatus(200);
});
app.patch('/posts/:id', function (request, response) {
    var id = request.body.id;
    var index = blog.retrieve(id);
    if (index === -1) {
        response.sendStatus(404);
    }
    var text = request.body.texto;
    var likes = parseInt(request.body.likes);
    if (!text && !likes) {
        response.send('Ops, nenhum parâmetro foi passado para alteração..');
    }
    var post = blog.get_postagem(index);
    var post_alterado;
    if (likes && text) {
        post_alterado = new Postagem(id, text, likes);
    }
    else if (text) {
        post_alterado = new Postagem(id, text, post.likes);
    }
    else {
        post_alterado = new Postagem(id, post.texto, likes);
    }
    blog.update(post_alterado);
    response.sendStatus(200);
});
app.patch('/posts/:id/like', function (request, response) {
    var id = request.body.id;
    response.sendStatus(blog.curtir_postagem(id));
});
app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});
app.listen(port, function () {
    console.log('Servidor rodando');
});
