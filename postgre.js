let pg = require('pg');

async function init(app){	
	const client = new pg.Client({
		user: 'leejaehee',
		host: 'localhost',
		database: 'postgres',
		password: '1234',
		port: 5432
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
var app = express();
init(app);

let client = app.get('pg_client');

// query 
let getMemoTable = 'select * from memo_table;'

client.query(getMemoTable).then(function(result){
	console.log('db select success..');
	console.log(result);
}).catch(function(error){
	console.error('## db select error..');
	console.error(err.stack);
});
