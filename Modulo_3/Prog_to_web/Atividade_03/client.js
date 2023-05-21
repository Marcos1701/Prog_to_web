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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net = __importStar(require("net"));
const readline_1 = __importDefault(require("readline"));
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
const client = net.createConnection({ port: 3000 }, () => {
    console.clear();
    console.log('Conectado ao servidor');
});
client.on('data', (data) => {
    try {
        if (data.toString().charAt(data.toString().length - 1) === ':') {
            console.log(data.toString());
            rl.question('=> ', (resposta) => {
                client.write(resposta);
            });
        }
        else if (data.toString().charAt(0) === 'c') {
            console.clear();
        }
        else {
            console.log(data.toString());
        }
    }
    catch (error) {
        console.log(`Erro: ${error.message}`);
    }
});
client.on('error', (error) => {
    console.log(`Erro: ${error.message}`);
});
client.on('end', () => {
    console.log('Desconectado do servidor');
});
