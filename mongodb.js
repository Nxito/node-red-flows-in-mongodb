const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;
if(!uri){return}
const client = new MongoClient(uri);

const dbName = "nodered"
const collectionName = "flows"

async function saveDataMGDB(id, newData) {

    console.log('guarndao datos de MongoDB...');
    try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    return await collection.updateOne(
        {  _id: id },
        { $set: {flow:newData} },
        { upsert: true } 
        )
} finally {
    console.log('Closing mgdb Client');
    await client.close();
}
    
}
// saveDataMGDB("myId",flow)


async function getDataMGDB(id) {
    console.log('Obteniendo datos de MongoDB...');
try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    return await collection.findOne({ _id: id })
} finally {
    await client.close();
}
    
}
// getDataMGDB("myId") .then(res=>console.log(res))

module.exports ={
    Save:saveDataMGDB,
    Get:getDataMGDB
}