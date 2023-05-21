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
const fs = __importStar(require("fs"));
const net = __importStar(require("net"));
class Sem_Jogadores_Error extends Error {
    constructor(msg) {
        super(msg);
    }
}
class Jogador {
    _login;
    _senha;
    _nome;
    _socket;
    _pontos;
    constructor(login, senha, nome, socket) {
        this._login = login;
        this._senha = senha;
        this._nome = nome;
        this._socket = socket;
        this._pontos = 0;
    }
    get id() {
        return this._login;
    }
    get nome() {
        return this._nome;
    }
    get socket() {
        return this._socket;
    }
    set socket(novo_socket) {
        this._socket = novo_socket;
    }
    get pontos() {
        return this._pontos;
    }
    add_pontuacao(pontos) {
        this._pontos += pontos;
    }
}
class Jogo {
    _palavra;
    _palavra_incompleta;
    _jogadores;
    id = 0;
    id_jogador_atual = 0;
    _valor_continuidade;
    _letras_usadas;
    _letras_validas;
    _alfabeto;
    _rodada;
    constructor() {
        this._palavra = sortear_palavra();
        this._palavra_incompleta = this.Retira_caracteres(this._palavra);
        this._jogadores = [];
        this._valor_continuidade = true;
        this._letras_usadas = [];
        this._alfabeto = "abcdefghijklmnopqrstuvwxyz";
        this._alfabeto += this._alfabeto.toUpperCase();
        this._letras_validas = this._alfabeto.split('');
        this._rodada = 0;
    }
    add_jogador(nome, socket) {
        this._jogadores.push(new Jogador(this.id.toString(), nome, socket));
        this.id += 1;
    }
    Retira_caracteres(palavra) {
        let palavra_retorno = '';
        for (let i = 0; i < palavra.length; i++) {
            if (palavra.charAt(i) === ' ' || palavra.charAt(i) === '-') {
                palavra_retorno += palavra.charAt(i);
            }
            else {
                palavra_retorno += "_";
            }
        }
        return palavra_retorno;
    }
    get palavra() {
        return this._palavra;
    }
    get palavra_incompleta() {
        return this._palavra_incompleta;
    }
    get jogadores() {
        return this._jogadores;
    }
    get jogador_atual() {
        if (this._jogadores.length == 0) {
            throw new Sem_Jogadores_Error("Ops, Não há jogadores cadastrados");
        }
        if (this.id_jogador_atual >= this._jogadores.length) {
            this.id_jogador_atual = 0;
        }
        return this._jogadores[this.id_jogador_atual];
    }
    get valor_continuidade() {
        return this._valor_continuidade;
    }
    get letras_usadas() {
        return this._letras_usadas;
    }
    nova_letra_utilizada(letra) {
        this._letras_usadas.push(letra);
    }
    get letras_validas() {
        return this._letras_validas;
    }
    get rodada() {
        return this._rodada;
    }
    set palavra(palavra) {
        this._palavra = palavra;
    }
    set palavra_incompleta(palavra_incompleta) {
        this._palavra_incompleta = palavra_incompleta;
    }
    atualizar_palavra_incompleta(letra) {
        let novaPalavraIncompleta = "";
        for (let i = 0; i < this.palavra.length; i++) {
            if (this.palavra.charAt(i) === letra) {
                novaPalavraIncompleta += letra;
            }
            else {
                novaPalavraIncompleta += this.palavra_incompleta.charAt(i);
            }
        }
        this.palavra_incompleta = novaPalavraIncompleta;
    }
    prox_jogador() {
        this.id_jogador_atual += 1;
        if (this.id_jogador_atual >= this._jogadores.length) {
            this.id_jogador_atual = 0;
        }
    }
    set valor_continuidade(valor_continuidade) {
        this._valor_continuidade = valor_continuidade;
    }
    confere_caractere(caractere) {
        if (this._letras_usadas.includes(caractere)) {
            return 0;
        }
        let retorno = this.palavra_incompleta.split('');
        const palavra = this.palavra.toLowerCase();
        let qtd = 0;
        for (let i = 0; i < palavra.length; i++) {
            if (palavra[i] === caractere.toLowerCase()) {
                retorno[i] = this.palavra.charAt(i);
                qtd++;
            }
        }
        if (qtd > 0) {
            this.jogador_atual.add_pontuacao(qtd * 2);
            this._palavra_incompleta = retorno.join('');
            return qtd;
        }
        return 0;
    }
    confere_palavra() {
        return (this._palavra == this._palavra_incompleta);
    }
    placar_jogadores() {
        let retorno = '';
        const jogadoress_ordenados = this._jogadores.sort((a, b) => {
            return b.pontos - a.pontos;
        });
        for (let i = 0; i < jogadoress_ordenados.length; i++) {
            retorno += `${jogadoress_ordenados[i].nome} - ${jogadoress_ordenados[i].pontos} pontos\n`;
        }
        return retorno;
    }
    Msg_to_players(msg) {
        for (let player of this._jogadores) {
            enviar_msg(player.socket, msg);
        }
    }
    Msg_to_players_wait(msg) {
        for (let player of this._jogadores) {
            if (player.socket == this.jogador_atual.socket) {
                continue;
            }
            enviar_msg(player.socket, msg);
        }
    }
    Fim_de_jogo() {
        for (let player of this._jogadores) {
            enviar_msg(player.socket, `Obrigado por jogar!\n`);
            player.socket.end();
        }
    }
    remove_jogador(socket) {
        this._jogadores = this._jogadores.filter((jogador) => {
            return jogador.socket !== socket;
        });
    }
}
class Historico_P {
    _Placares = [];
    push(Placar) {
        this._Placares.push(Placar);
    }
    Exibir(socket) {
        let i = 0;
        for (let Placar of this._Placares) {
            enviar_msg(socket, `${i}°Partida\n${Placar}`);
        }
    }
}
async function leitor(socket) {
    return new Promise((resolve, reject) => {
        socket.once('data', (data) => {
            resolve(data.toString().trim());
        });
    });
}
let jogo;
async function Game_Multiplayer(socket) {
    try {
        enviar_msg(socket, "Bem vindo ao jogo da forca multiplayer\n");
        enviar_msg(socket, "Digite seu nome:");
        let nome = await leitor(socket);
        jogo.add_jogador(nome, socket);
        enviar_msg(socket, `\n\nOlá ${nome}, seja bem vindo ao jogo da forca multiplayer!\n`);
        enviar_msg(socket, `A palavra tem ${jogo.palavra.length} letras.\n`);
        enviar_msg(socket, `A palavra é: ${jogo.palavra_incompleta.split('').join(' ')}.\n`);
        while (jogo.valor_continuidade) {
            try {
                if (jogo.jogador_atual.socket === socket) {
                    enviar_msg(socket, `\n---> Digite uma letra:`);
                    let letra = await leitor(socket);
                    if (jogo.letras_usadas.includes(letra)) {
                        enviar_msg(socket, `\n--->  A letra ${letra} já foi utilizada. <---\n`);
                        enviar_msg(socket, 'Tente novamente...\n');
                        continue;
                    }
                    else if (jogo.letras_validas.includes(letra)) {
                        let qtd = jogo.confere_caractere(letra);
                        if (qtd > 0) {
                            enviar_msg(socket, `\n---> A letra ${letra} existe na palavra.  <---\n`);
                            jogo.nova_letra_utilizada(letra);
                            jogo.atualizar_palavra_incompleta(letra);
                            if (jogo.confere_palavra()) {
                                jogo.Msg_to_players(`\n\n <---> Parabéns ${jogo.jogador_atual.nome}, você acertou a palavra.  <---> \n`);
                                jogo.Msg_to_players(`A palavra era: --->  ${jogo.palavra}.    <---\n`);
                                jogo.Msg_to_players(`\n\nPlacar:\n`);
                                jogo.Msg_to_players(`${jogo.placar_jogadores()}.\n`);
                                jogo.Fim_de_jogo();
                                break;
                            }
                            enviar_msg(socket, `\n---> A palavra é: ${jogo.palavra_incompleta.split('').join(' ')}. <---\n\n`);
                            jogo.prox_jogador();
                        }
                        else {
                            enviar_msg(socket, `\n\n---> Ops... a letra ${letra} não existe na palavra.  <---\n`);
                            jogo.prox_jogador();
                            enviar_msg(socket, `\n---> Vez do jogador ${jogo.jogador_atual.nome}.  <---\n`);
                            enviar_msg(socket, `--->  A palavra é: ${jogo.palavra_incompleta.split('').join(' ')}.  <---\n`);
                        }
                    }
                    else {
                        enviar_msg(socket, `\n---> A letra ${letra} não é válida. <---\n`);
                    }
                }
                else {
                    while (jogo.jogador_atual.socket !== socket) {
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                    }
                    jogo.Msg_to_players('c');
                    jogo.Msg_to_players_wait(`Aguarde a sua vez. Jogador Atual: ${jogo.jogador_atual.nome}\n`);
                    enviar_msg(jogo.jogador_atual.socket, `\n\nSua vez, ${jogo.jogador_atual.nome}!\n`);
                    jogo.Msg_to_players(`\nA palavra é: ${jogo.palavra_incompleta.split('').join(' ')}.\n`);
                }
            }
            catch (e) {
                if (socket.destroy()) {
                    console.log('Socket desconectado');
                    jogo.remove_jogador(socket);
                    break;
                }
                if (e instanceof Sem_Jogadores_Error) {
                    if (jogo.confere_palavra()) {
                        jogo = new Jogo();
                    }
                    break;
                }
                console.log(`Erro: ${e.message}`);
            }
        }
    }
    catch (e) {
        console.log(`Erro: ${e.message}`);
        jogo.Msg_to_players(`Erro: ${e.message}`);
        jogo.Fim_de_jogo();
    }
    finally {
        jogo = new Jogo();
    }
}
function enviar_msg(socket, msg) {
    try {
        socket.write(msg);
    }
    catch (e) {
        console.log(`Erro: ${e.message}`);
    }
}
function sortear_palavra() {
    let palavras = [];
    try {
        palavras = fs.readFileSync('palavras_sem_acento.txt', 'utf-8').split(',');
    }
    catch (e) {
        jogo.Msg_to_players("Ops, houve um erro ao sortear a palavra..");
        jogo.Msg_to_players("Tente novamente mais tarde.");
        server.close();
        jogo.Fim_de_jogo();
        return '';
    }
    let palavra_sorteada = palavras[Math.floor(Math.random() * palavras.length)];
    while (palavra_sorteada.length <= 3) {
        palavra_sorteada = palavras[Math.floor(Math.random() * palavras.length)];
    }
    return palavra_sorteada;
}
async function coletar_op_menu_Inicial(socket) {
    const opcoes = ['1 - Realizar Login\n', '2 - Novo Jogador\n', '3 - Exibir Histórico de Partidas\n', '\n 0 - Sair'];
    const exibir_op = (opcoes) => {
        for (let op of opcoes) {
            enviar_msg(socket, op);
        }
    };
    let opcao = Number(await leitor(socket));
    while (isNaN(Number(opcao)) || Number(opcao) < 0 || Number(opcao) >= opcoes.length) {
        enviar_msg(socket, 'Opção inválida!!!');
        enviar_msg(socket, 'As opções válidas são: ');
        opcao = Number(await leitor(socket));
    }
    return opcao;
}
async function iniciar_game(socket) {
    try {
        if (jogo == null) {
            jogo = new Jogo();
        }
        Game_Multiplayer(socket);
    }
    catch (e) {
        console.log(`Erro: ${e.message}`);
        server.close(() => {
            console.log('Servidor encerrado.');
        });
    }
}
const Historico_Partidas = new Historico_P();
const server = net.createServer(async (socket) => {
    enviar_msg(socket, `Olá, Seja Bem vindo ao jogo de adivinhação\n`);
    enviar_msg(socket, `Selecione uma opção:\n\n`);
    let op = await coletar_op_menu_Inicial(socket);
    while (op != 0) {
        if (op == 1) { // realizar login
        }
        else if (op == 2) { // Criar novo Jogador
        }
        else if (op == 3) { // Exibir Histórico
            Historico_Partidas.Exibir(socket);
        }
        if (op != 0) {
            enviar_msg(socket, 'Certo, agora selecione outra opção:\n\n');
            op = await coletar_op_menu_Inicial(socket);
        }
    }
});
server.listen(3000, () => {
    console.log("Servidor rodando na porta 3000.");
});
