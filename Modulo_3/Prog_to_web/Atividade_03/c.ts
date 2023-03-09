import * as net from 'net';
import readline from 'readline';
import prompt from 'prompt-sync'
const input = prompt()

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client: net.Socket = net.createConnection({ port: 3000 }, () => {
    console.log('Conectado ao servidor');
});

client.on('data', (data: Buffer) => {
    try {
        console.log(data.toString())
        //if(data.toString() == 'Digite seu nome: ' || data.toString() == 'Digite uma letra: ' || data.toString() == 'Digite 1 para jogar novamente ou 0 para sair: '){
        //console.log(data.toString());
        //rl.question('=> ', (resposta: string) => {
        //   client.write(resposta);
        //});
        //}else if(data.toString() == 'cls'){
        //    console.clear()
        //    client.write('Recebi o texto')
        //}else{
        //    console.log(data.toString())
        //    client.write('Recebi o texto')
        //}
   
    } catch (error: any) {
        console.log(`Erro: ${error.message}`);
    }
});

client.on('error', (error: Error) => {
    console.log(`Erro: ${error.message}`);
});

client.on('end', () => {
    console.log('Desconectado do servidor');
});
