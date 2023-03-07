

import * as net from 'net';

function isSpecialCharacter(char) {
    var pattern = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g;
    return pattern.test(char);
}


const Retira_caracteres = (palavra: string) => {
    let palavra_retorno: string = ''
    for (let i = 0; i < palavra.length; i++) {
        if (palavra.charAt(i) === ' ' || palavra.charAt(i) === '-') {
            palavra_retorno += palavra[i]
        } else {
            palavra_retorno += "_"
        }
    }
    return palavra_retorno
}

const confere_caractere = (palavra_completa: string, palavra_incompleta: string, caractere: string) => {
    let retorno: string[] = palavra_incompleta.split('')
    const palavra: string = palavra_completa.toLowerCase()

    for (let i = 0; i < palavra_completa.length; i++) {
        if (palavra[i] === caractere.toLowerCase()) {
            retorno[i] = palavra_completa.charAt(i)
        }
    }
    return retorno.join('')
}

const confere_palavra = (palavra_original: string, palavra_alternativa: string) => {
    if (palavra_original.length != palavra_alternativa.length) {
        return false
    }
    for (let i = 0; i < palavra_original.length; i++) {
        if (palavra_original.charAt(i).toLowerCase() !== palavra_alternativa.charAt(i).toLowerCase()) {
            return false
        }
    }
    return true
}

function sortiar_palavra() {
    const palavras: string[] = ['Teste', 'ifpi', 'Analise e Desenvolvimento de Sistemas']
    return palavras[Math.floor(Math.random() * palavras.length)]
}

function exibe_op(socket: net.Socket, opcoes: string[]) {
    for (let op of opcoes) {
        socket.write(op)
    }
}


async function tratarEntradaUsuario(socket: net.Socket, valores_validos: string[], opcoes?: string[],): Promise<string> {

    return new Promise((resolve, reject) => {
        socket.once('data', (data: Buffer) => {
            const opcao: string = data.toString();
            if (valores_validos.includes(opcao)) {
                resolve(opcao)
            } else {
                if (opcoes) {
                    socket.write("Opção inválida, escolha uma opção dentre as abaixo: ");
                    exibe_op(socket, opcoes);
                    resolve(tratarEntradaUsuario(socket, valores_validos, opcoes))
                } else {
                    socket("Valor inválido, digite novamente: ")
                    resolve(tratarEntradaUsuario(socket, valores_validos))
                }
            }
        });
    })
}

let clientes: net.Socket[] = [];
let clientCounter = 0;

async function Game_Multiplayer(socket: net.Socket): Promise<void> {
    let palavra: string = sortiar_palavra();
    let palavra_incompleta: string = Retira_caracteres(palavra);
    let valor_continuidade: boolean = true;

    while (valor_continuidade) {

        socket.write(`Palavra incompleta:   ---->   ${palavra_incompleta.split('').join(' ')}   <----   \n\n`);
        let alfabeto: string = "abcdefghijklmnopqrstuvwxyz";
        alfabeto += alfabeto.toUpperCase();
        const letras_validas: string[] = alfabeto.split('');

        socket.write("Digite uma letra: ");
        let letra: string = await tratarEntradaUsuario(socket, letras_validas);

        palavra_incompleta = confere_caractere(palavra, palavra_incompleta, letra);

        if (confere_palavra(palavra, palavra_incompleta)) {
            valor_continuidade = false;
        }
    }
    socket.write(`Palavra completa:   ----> ${palavra} <----   \n\n`)
    socket.write("Parabéns, você ganhou!\n");
    return;
}


const server = net.createServer((socket: net.Socket) => {
    try {
        socket.id = 0;
        socket.write("Seja Bem vindo ao jogo da forca\n");
        socket.write("Digite seu nome: ");
        socket.once('data', (data: Buffer) => {
            const nome: string = data.toString().trim();
            socket.write(`Seja bem vindo ${nome}\n`);
            socket.write("Escolha uma opção: \n");
            const opcoes: string[] = ["1 - Novo Jogo\n", "0 - Sair\n"]
            exibe_op(socket, opcoes);
            let opcao: Promise<string> = tratarEntradaUsuario(socket, ["0", "1"], opcoes);

            opcao.then((opcao: string) => {
                if (opcao == "1") {
                    Game_Multiplayer(socket);
                } else {
                    socket.write(`op ${opcao}`);
                    socket.write("Certo, até mais!!\n")
                    socket.end()
                }
                socket.write("Obrigado por jogar!\n");
                socket.end();
            });
        });
    } catch (e: any) {
        console.log(`Erro: ${e.message}`)
        socket.end();
    }

});

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
