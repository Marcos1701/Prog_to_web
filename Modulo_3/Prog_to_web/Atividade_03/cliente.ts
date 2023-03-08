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

client.on('Error', (error: Error) => {
    console.log(`Erro: ${error.message}`);
});

client.on('end', () => {
    console.log('Desconectado do servidor');
});



// const client: net.Socket = net.createConnection({ port: 3000 }, () => {
//     console.log('Conectado ao servidor');
// });

// client.on('data', (data: Buffer) => {
//     console.log(data.toString());
//     const resposta: string = input('Digite sua resposta: ')
//     client.write(resposta)
// });

// client.on('end', () => {
//     console.log('Desconectado do servidor');
// });

// client.write('Olá, servidor!');
