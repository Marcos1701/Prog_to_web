"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const consultas_bd_js_1 = require("./Banco_de_dados/consultas_bd.js");
const app = (0, express_1.default)();
const router = express_1.default.Router();
app.use(express_1.default.json());
router.get('/', (req, res) => {
    res.send('Bem vindo ao microblog!!');
});
router.get('/posts', consultas_bd_js_1.retrieveAllPostagens);
router.get('/posts/:id', consultas_bd_js_1.retrievePostagem);
router.post('/posts', consultas_bd_js_1.insertPostagem);
router.put('/posts/:id', consultas_bd_js_1.updatePostagem);
router.patch('/posts/:id', consultas_bd_js_1.updatePostagem);
router.delete('/posts/:id', consultas_bd_js_1.deletePostagem);
router.patch('/posts/:id/like', consultas_bd_js_1.curtirPostagem);
router.post('/posts/:id/like', consultas_bd_js_1.curtirPostagem);
router.post('/posts/:id/comentarios', consultas_bd_js_1.insertComentario);
router.get('/posts/:id/comentarios', consultas_bd_js_1.retrieveAllComentariostoPostagem);
router.get('/posts/:id/comentarios/:id_comentario', consultas_bd_js_1.retrieveComentario);
router.put('/posts/:id/comentarios/:id_comentario', consultas_bd_js_1.updateComentario);
router.delete('/posts/:id/comentarios/:id_comentario', consultas_bd_js_1.deleteComentario);
exports.default = router;
