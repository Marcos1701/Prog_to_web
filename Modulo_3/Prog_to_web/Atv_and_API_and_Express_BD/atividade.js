"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var app = express();
var port = 3000;
var pg_1 = require("pg");
var client = new pg_1.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Aplicacao_bd',
    password: 'postgres',
    port: 5432,
});
var Postagem = /** @class */ (function () {
    function Postagem(id, text, likes) {
        this.id = id;
        this.text = text;
        this.likes = likes ? likes : 0;
    }
    Postagem.prototype.curtir = function () {
        this.likes++;
    };
    Postagem.prototype.toString = function () {
        var aux = "\n        id Postagem: ".concat(this.id, "\n        Quantidade de curtidas: ").concat(this.likes, "\n        texto inserido: ").concat(this.text, "\n        ");
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
var MicroblogPersistente = /** @class */ (function () {
    function MicroblogPersistente() {
        client.connect();
    }
    MicroblogPersistente.prototype.create = function (postagem) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.retrieve(postagem.id)) return [3 /*break*/, 2];
                        return [4 /*yield*/, client.query("INSERT INTO post VALUES ('".concat(postagem.id, "', '").concat(postagem.text, "', ").concat(postagem.likes, ")"))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        console.log("Postagem já existe!!");
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MicroblogPersistente.prototype.curtir_postagem = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.retrieve(id)];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, client.query("UPDATE post SET likes = likes + 1 WHERE id = '".concat(id, "'"))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, 200];
                    case 3: return [2 /*return*/, 404];
                }
            });
        });
    };
    MicroblogPersistente.prototype.retrieve = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var retorno;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.query("SELECT * FROM post WHERE id = '".concat(id, "'")).then(function (res) {
                            return res.rows;
                        })];
                    case 1:
                        retorno = _a.sent();
                        return [2 /*return*/, retorno.length > 0];
                }
            });
        });
    };
    MicroblogPersistente.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.query("DELETE FROM post WHERE id = '".concat(id, "'"))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MicroblogPersistente.prototype.update = function (postagem) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.query("UPDATE post SET text = '".concat(postagem.text, "', likes = ").concat(postagem.likes, " WHERE id = '").concat(postagem.id, "'"))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MicroblogPersistente.prototype.retrieveAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var retorno, postagens, _i, _a, postagem;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, client.query("SELECT * FROM post")];
                    case 1:
                        retorno = _b.sent();
                        postagens = [];
                        for (_i = 0, _a = retorno.rows; _i < _a.length; _i++) {
                            postagem = _a[_i];
                            postagens.push(new Postagem(postagem.id, postagem.text, postagem.likes));
                        }
                        return [2 /*return*/, postagens];
                }
            });
        });
    };
    MicroblogPersistente.prototype.get_postagem = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var retorno;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.query("SELECT * FROM post WHERE id = '".concat(id, "'"))];
                    case 1:
                        retorno = _a.sent();
                        return [2 /*return*/, new Postagem(retorno.rows[0].id, retorno.rows[0].text, retorno.rows[0].likes)];
                }
            });
        });
    };
    return MicroblogPersistente;
}());
var blog = new MicroblogPersistente();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/', function (request, response) {
    response.send('Bem vindo ao microblog!!');
});
app.get('/posts', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _b = (_a = response).json;
                _d = {};
                _c = "Postagens";
                return [4 /*yield*/, blog.retrieveAll()];
            case 1:
                _b.apply(_a, [(_d[_c] = _e.sent(), _d)]);
                return [2 /*return*/];
        }
    });
}); });
app.get('/posts/:id', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                id = request.body.id;
                return [4 /*yield*/, blog.retrieve(id)];
            case 1:
                if (!_e.sent()) return [3 /*break*/, 3];
                _b = (_a = response).json;
                _d = {};
                _c = "Postagem";
                return [4 /*yield*/, blog.get_postagem(id)];
            case 2:
                _b.apply(_a, [(_d[_c] = _e.sent(), _d)]);
                return [3 /*break*/, 4];
            case 3:
                response.sendStatus(404);
                _e.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
app.delete('/posts/:id', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = request.body.id;
                return [4 /*yield*/, blog.retrieve(id)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 3];
                return [4 /*yield*/, blog.delete(id)];
            case 2:
                _a.sent();
                response.sendStatus(200);
                return [3 /*break*/, 4];
            case 3:
                response.sendStatus(404);
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post('/posts', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, text, postagem;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = request.body.id;
                text = request.body.text;
                postagem = new Postagem(id, text);
                return [4 /*yield*/, blog.create(postagem)];
            case 1:
                _a.sent();
                response.sendStatus(201);
                return [2 /*return*/];
        }
    });
}); });
app.put('/posts/:id/like', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = request.body.id;
                return [4 /*yield*/, blog.retrieve(id)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 3];
                return [4 /*yield*/, blog.curtir_postagem(id)];
            case 2:
                _a.sent();
                response.sendStatus(200);
                return [3 /*break*/, 4];
            case 3:
                response.sendStatus(404);
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
app.patch('/posts/:id', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, text, likes, post, post_alterado;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = request.body.id;
                return [4 /*yield*/, blog.retrieve(id)];
            case 1:
                // let index: number = blog.retrieve(id)
                if (!(_a.sent())) {
                    response.sendStatus(404);
                }
                text = request.body.text;
                likes = parseInt(request.body.likes);
                if (!text && !likes) {
                    response.send('Ops, nenhum parâmetro foi passado para alteração..');
                }
                return [4 /*yield*/, blog.get_postagem(id).then(function (res) {
                        return res;
                    })];
            case 2:
                post = _a.sent();
                if (likes && text) {
                    post_alterado = new Postagem(id, text, likes);
                }
                else if (text) {
                    post_alterado = new Postagem(id, text, post.likes);
                }
                else {
                    post_alterado = new Postagem(id, post.text, likes);
                }
                return [4 /*yield*/, blog.update(post_alterado)];
            case 3:
                _a.sent();
                response.sendStatus(200);
                return [2 /*return*/];
        }
    });
}); });
app.patch('/posts/:id/like', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                id = request.body.id;
                _b = (_a = response).sendStatus;
                return [4 /*yield*/, blog.curtir_postagem(id)];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); });
app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});
app.listen(port, function () {
    console.log('Servidor rodando');
});
