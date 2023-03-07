import * as net from 'net';
import prompt from 'prompt-sync'
const input = prompt()

const client: net.Socket = net.createConnection({ port: 3000 }, () => {
    console.log('Conectado ao servidor');
});

client.on('data', (data: Buffer) => {
    try {
        console.log(data.toString());
        const resposta: string = input('=> ')
        client.write(resposta)
    } catch (error: any) {
        console.log(`Erro: ${error.message}`);
    }
});

client.on('end', () => {
    console.log('Desconectado do servidor');
});

