import Client from 'pg'

const client = new Client.Client({

    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'db_atv_fech_api1'
});

export { client }