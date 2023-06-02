"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const pg_1 = __importDefault(require("pg"));
// const client = new Client.Client({
//     host: 'localhost',
//     port: 5432,
//     user: 'postgres',
//     password: 'postgres',
//     database: 'db_atv_fech_api1'
// });
const client = new pg_1.default.Client({
    host: 'containers-us-west-153.railway.app',
    port: 5614,
    user: 'postgres',
    password: 'hKxtoKX5KNwH5KJEqaTR',
    database: 'railway'
});
exports.client = client;
