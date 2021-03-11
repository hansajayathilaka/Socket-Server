const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const promptSync = require('prompt-sync')()
dotenv.config();

/*
* @param
*   email
*   secret
*   expire time
* */

const secret = process.argv[3] ? process.argv[3] : process.env.JWT_KEY;
const data = { email: process.argv[2] ? process.argv[2] : promptSync('Enter Email > ') };
const exp = process.argv[4] ? parseInt(eval(process.argv[4])) : 600
const token = jwt.sign(data, secret, { expiresIn: exp });

console.log(`Data : ${JSON.stringify(data)}`);
console.log(`Secret : ${secret}`);
console.log(`Token : ${token}`);
console.log(`Expiration Time : ${exp}s`);
