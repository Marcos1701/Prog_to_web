import * as net from 'net';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client: net.Socket = net.createConnection({ port: 3000 }, () => {
  console.log('Conectado ao servidor');
});

client.on('data', (data: Buffer) => {
  console.log(data.toString());
  rl.question('=> ', (resposta) => {
    client.write(resposta);
  });
});

client.on('end', () => {
  console.log('Desconectado do servidor');
});

client.on('error', (err) => {
  console.error('Erro na conexão:', err);
});

rl.question('Digite sua mensagem: ', (mensagem) => {
  client.write(mensagem);
});
