let pg = require('pg');
let client;
async function init(app){	
	client = new pg.Client({
		user: 'leejaehee',
		host: 'localhost',
		database: 'postgres',
		password: '1234',
		port: '5432',
	});
	await client.connect(function(err){
		if(err != null){
			console.error('## db connection error..');
			console.error(err.stack);
		}else{
			console.log('database connected..');
		}
	});
	app.set('pg_client', client);
}

let express = require('express');
var app = express();
init(app);

//let client = app.get('pg_client');

// query 
const getMemo = (request,response) => {
    client.query('select * from "vueTest".memo_table order by wrt_dt desc ',(error,result) => {
        if(error){
            throw error 
        }
        response.status(200).json(result.rows)
    })
}
const getMemoByWord = (request,response) => {
    const word = request.params.search
    client.query('select * from memo_table where cntnt like $1 order by wrt_dt desc ', ['%' + word + '%'], (error, result) => {
                                                // or " ~ '%' || $1 || '%'", [word]
        if(error){
            throw error 
        }
        response.status(200).json(result.rows)
    })
}
const createMemo = (request,response) => {
    const memo = request.params.con 
    client.query('insert into memo_table (wrt_dt,cntnt,updt_dt) values (now(),$1,now())', [memo], (error, result) => {
        if(error){
            throw error 
        }
        response.status(201).send(`User added in DT : ${result.updt_dt}`)
    })
}
const updateMemo = (request,response) => {
    // const {memo,wrtDt} = request.body 
    const wrtDt = request.params.wrtDt
    const memo = request.params.con  
    client.query('update memo_table set cntnt = $1, updt_dt = now() where wrt_dt = $2', [memo,wrtDt], (error, result) => {
        if(error){
            throw error 
        }
        response.status(200).send(`User updated in DT : ${result.updt_dt}`)
    })
}
const deleteMemo = (request,response) => {
    // const {memo,wrtDt} = request.body 
    const wrtDt = request.params.wrtDt
    client.query('delete from memo_table where wrt_dt = $1', [wrtDt], (error, result) => {
        if(error){
            throw error 
        }
        response.status(200).send(`User deleted in wrtDT : ${wrtDt}`)
    })
}

module.exports = {
    getMemo,
    getMemoByWord,
    createMemo,
    updateMemo,
    deleteMemo,
}
