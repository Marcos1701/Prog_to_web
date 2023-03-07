

import * as net from 'net';

function isSpecialCharacter(char) {
    var pattern = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g;
    return pattern.test(char);
  }
  

const Retira_caracteres = (palavra: string) => {
    let palavra_retorno: string = ''
    for (let i = 0; i < palavra.length; i++) {
        if (palavra.charAt(i) === ' ' || palavra.charAt(i) === '-'){
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

function exibe_op(socket: net.Socket,opcoes: string[]) {
    for(let op of opcoes){
        socket.write(op)
    }
}


function tratarEntradaUsuario(socket: net.Socket, opcoes: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      socket.once('data', (data: Buffer) => {
        const opcao: string = data.toString().trim();
        if (opcoes.includes(opcao)) {
          resolve(opcao);
        } else {
          socket.write("Opção inválida, escolha uma opção dentre as abaixo: ");
          exibe_op(socket,opcoes);
          tratarEntradaUsuario(socket, opcoes).then(resolve).catch(reject);
        }
      });
    });
  }
  

let clientes: net.Socket[] = [];
let clientCounter = 0;

const server: net.Server = net.createServer((socket: net.Socket) => {
    console.log(`Cliente conectado: ${socket.remoteAddress}:${socket.remotePort}`);

    let cliente_antigo: boolean = false;
    let index_cli: number
    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].id == socket.id) {
          // Cliente já está conectado
          socket.write("Seja Bem vindo ao jogo da forca, novamente\n");
          cliente_antigo = true;
          index_cli = i;
          break
        }
    }

    if(!cliente_antigo){
        clientCounter++
        socket.id = clientCounter
        socket.write("Seja Bem vindo ao jogo da forca\n");
        clientes.push(socket);
        index_cli = clientes.length - 1
    }

    const opcoes: string[] = ["1 - Novo Jogo\n", "0 - Sair\n\n"]
    socket.write("Opções disponiveis: \n")
    exibe_op(socket,opcoes)

    socket.on('data', (data: Buffer) => {
        let opcao: string = data.toString()
        while(opcao != "1" && opcao != "2"){
            socket.write("Opção inválida, escolha uma opção dentre as abaixo: ")
            exibe_op(socket, opcoes)
            socket.on('data', (op: Buffer) => {
                opcao = op.toString()
            });
             
        }

        

            if (opcao == "1") {
                let palavra: string = sortiar_palavra();
                let palavra_incompleta: string = Retira_caracteres(palavra);
                let valor_continuidade: boolean = true;

                while (valor_continuidade) {

                    socket.write(`Palavra incompleta:   ----> ${palavra_incompleta} <----   \n\n`);

                    socket.write("Digite uma letra: ");
                    socket.on('data', (data: Buffer) => {
                        let letra: string = data.toString();
                        let caractere_esp: boolean = isSpecialCharacter(letra)
                        while(!isNaN(Number(letra)) || letra.length > 1 || caractere_esp){
                            socket.write("Letra inválida, insira novamente: ")
                            socket.on('data', (entrada: Buffer) => {
                                letra = entrada.toString()
                                caractere_esp = isSpecialCharacter(letra)
                            });

                        }
                        palavra_incompleta = confere_caractere(palavra, palavra_incompleta, letra);
                    });

                    if (confere_palavra(palavra, palavra_incompleta)) {
                        valor_continuidade = false;
                    }
                }
                socket.write("Parabéns, você ganhou!\n");

            } else if (data.toString() == "0") {
                socket.write("Certo, saindo do jogo..\n");
                socket.end();
            }
    });



    socket.on('end', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(3000, () => {
    console.log('Servidor inicializado na porta 3000');
});
