// test-redis.js
const dotenv = require('dotenv');// dotenv is always required
dotenv.config();// always config before using DB
const Redis = require('ioredis');


const redis = new Redis(process.env.REDIS_URI); // always put the URI inside quodes ("")
// console.log(process.env.URI);

redis.on('connect', () => {
  console.log(' Redis connected successfully!');
  process.exit(0);// all thing good sab thik hai!
});

redis.on('error', (err) => {
  console.error(' Redis connection failed:', err.message);
  process.exit(1);//any non-zero number .... kuch tho gadbad che!
});