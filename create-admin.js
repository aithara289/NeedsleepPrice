import 'dotenv/config';
import bcrypt from 'bcryptjs';
import {pool,migrate} from '../db.js';
const email=process.env.ADMIN_EMAIL?.trim().toLowerCase(),password=process.env.ADMIN_PASSWORD;
if(!email||!email.includes('@')||!password||password.length<14)throw Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (14+ chars)');
await migrate();const hash=await bcrypt.hash(password,12);
await pool.query('INSERT INTO admins(email,password_hash) VALUES ($1,$2) ON CONFLICT(email) DO UPDATE SET password_hash=EXCLUDED.password_hash',[email,hash]);
console.log('Admin account created/updated:',email);await pool.end();
