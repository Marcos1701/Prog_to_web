"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const net = __importStar(require("net"));
// const palavra = palavras[Math.floor(Math.random() * (palavras.length - 1))]
// let valor_continuidade: boolean = false
const Retira_caracteres = (palavra) => {
    let palavra_retorno = '';
    for (let i = 0; i < palavra.length; i++) {
        if (palavra[i] === ' ' || palavra[i] === '-') {
            palavra_retorno += palavra[i];
        }
        else {
            palavra_retorno += "_";
        }
    }
    return palavra_retorno;
};
const confere_caractere = (palavra_completa, palavra_incompleta, caractere) => {
    let retorno = palavra_incompleta.split('');
    const palavra = palavra_completa.toLowerCase();
    for (let i = 0; i < palavra_completa.length; i++) {
        if (palavra[i] === caractere.toLowerCase()) {
            retorno[i] = palavra_completa[i];
        }
    }
    return retorno.join('');
};
const confere_palavra = (palavra_original, palavra_alternativa) => {
    if (palavra_original.length != palavra_alternativa.length) {
        return false;
    }
    for (let i = 0; i < palavra_original.length; i++) {
        if (palavra_original[i].toLowerCase() != palavra_alternativa[i].toLowerCase()) {
            return false;
        }
    }
    return true;
};
function sortiar_palavra() {
    const palavras = ['Teste', 'ifpi', 'Analise e Desenvolvimento de Sistemas'];
    return palavras[Math.floor(Math.random() * (palavras.length - 1))];
}
let clientes = [];
const server = net.createServer((socket) => {
    console.log(`Cliente conectado: ${socket.remoteAddress}:${socket.remotePort}`);
    let cliente_antigo = false;
    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].id == socket.id) {
            socket.write("Cliente já conectado anteriormente\n");
            cliente_antigo = true;
        }
    }
    if (!cliente_antigo) {
        socket.write('Olá, cliente!\n');
        clientes.push(socket);
    }
    //socket.write("Digite seu nome: ");
    socket.on('data', (data) => {
        // console.log(`Mensagem do cliente: ${data.toString()}`);
        //const nome: string = data.toString();
        socket.write(data.toString());
        socket.write("Seja Bem vindo ao jogo da forca\n");
        socket.write("Digite sua opção: \n");
        socket.write("1 - Novo Jogo\n");
        socket.write("0 - Sair\n");
        socket.write("=> ");
        socket.on('data', (data) => {
            if (data.toString() == "1") {
                let palavra = sortiar_palavra();
                let palavra_incompleta = Retira_caracteres(palavra);
                let valor_continuidade = true;
                if (valor_continuidade) {
                    socket.write(`Palavra incompleta: \n ----> ${palavra_incompleta} <----\n`);
                    socket.write("Digite uma letra: ");
                    socket.on('data', (data) => {
                        const letra = data.toString();
                        palavra_incompleta = confere_caractere(palavra, palavra_incompleta, letra);
                    });
                    if (confere_palavra(palavra, palavra_incompleta)) {
                        valor_continuidade = false;
                    }
                }
                socket.write("Parabéns, você ganhou!\n");
            }
            else if (data.toString() == "0") {
                socket.write("Saindo do jogo\n");
                socket.end();
            }
            else {
                socket.write("Opção inválida\n");
                socket.write("Digite sua opção: \n");
                socket.write("1 - Novo Jogo\n");
                socket.write("0 - Sair\n");
                socket.write("=> ");
            }
        });
    });
    socket.on('end', () => {
        console.log('Cliente desconectado');
    });
});
server.listen(3000, () => {
    console.log('Servidor inicializado na porta 3000');
});
