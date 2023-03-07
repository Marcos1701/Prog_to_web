import * as net from 'net';


// const palavra = palavras[Math.floor(Math.random() * (palavras.length - 1))]
// let valor_continuidade: boolean = false

const Retira_caracteres = (palavra: string) => {
    let palavra_retorno: string = ''
    for (let i = 0; i < palavra.length; i++) {
        if (palavra[i] === ' ' || palavra[i] === '-') {
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
            retorno[i] = palavra_completa[i]
        }
    }
    return retorno.join('')
}

const confere_palavra = (palavra_original: string, palavra_alternativa: string) => {
    if (palavra_original.length != palavra_alternativa.length) {
        return false
    }
    for (let i = 0; i < palavra_original.length; i++) {
        if (palavra_original[i].toLowerCase() != palavra_alternativa[i].toLowerCase()) {
            return false
        }
    }
    return true
}

function sortiar_palavra() {
    const palavras: string[] = ['Teste', 'ifpi', 'Analise e Desenvolvimento de Sistemas']
    return palavras[Math.floor(Math.random() * (palavras.length - 1))]
}

let clientes: net.Socket[] = [];

const server: net.Server = net.createServer((socket: net.Socket) => {
    console.log(`Cliente conectado: ${socket.remoteAddress}:${socket.remotePort}`);
    let cliente_antigo: boolean = false;

    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].id == socket.id) {
            socket.write("Cliente já conectado anteriormente\n")
            cliente_antigo = true;
        }
    }

    if (!cliente_antigo) {
        socket.write('Olá, cliente!\n');
        clientes.push(socket);
    }

    //socket.write("Digite seu nome: ");
    socket.on('data', (data: Buffer) => {
        // console.log(`Mensagem do cliente: ${data.toString()}`);
        //const nome: string = data.toString();
        socket.write(data.toString());
        socket.write("Seja Bem vindo ao jogo da forca\n");
        socket.write("Digite sua opção: \n");
        socket.write("1 - Novo Jogo\n");
        socket.write("0 - Sair\n");
        socket.write("=> ");
        socket.on('data', (data: Buffer) => {

            if (data.toString() == "1") {
                let palavra: string = sortiar_palavra();
                let palavra_incompleta: string = Retira_caracteres(palavra);
                let valor_continuidade: boolean = true;

                if (valor_continuidade) {

                    socket.write(`Palavra incompleta: \n ----> ${palavra_incompleta} <----\n`);

                    socket.write("Digite uma letra: ");
                    socket.on('data', (data: Buffer) => {
                        const letra: string = data.toString();
                        palavra_incompleta = confere_caractere(palavra, palavra_incompleta, letra);
                    });

                    if (confere_palavra(palavra, palavra_incompleta)) {
                        valor_continuidade = false;
                    }
                }
                socket.write("Parabéns, você ganhou!\n");

            } else if (data.toString() == "0") {
                socket.write("Saindo do jogo\n");
                socket.end();
            } else {
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