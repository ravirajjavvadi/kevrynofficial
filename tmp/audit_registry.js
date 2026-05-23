const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function checkInterns() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('test'); // Replace with your DB name if different
    const interns = await db.collection('interns').find({}).toArray();
    console.log('--- ALL INTERNS ---');
    interns.forEach(i => {
      console.log(`- Name: ${i.name}, Email: ${i.email}, internId: ${i.internId}, Tasks: ${i.tasks?.length || 0}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

checkInterns();
