import pg from 'pg';
const { Pool } = pg;
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
export const pool = new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_SSL==='true'?{rejectUnauthorized:true}:false,max:10});
export async function migrate(){
 await pool.query(`CREATE TABLE IF NOT EXISTS admins (id BIGSERIAL PRIMARY KEY,email TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT now());
 CREATE TABLE IF NOT EXISTS orders (id UUID PRIMARY KEY,public_code TEXT UNIQUE NOT NULL,lookup_secret TEXT NOT NULL,uid VARCHAR(32) NOT NULL,server VARCHAR(32) NOT NULL,contact VARCHAR(120),requested INTEGER NOT NULL,echoes INTEGER NOT NULL,total INTEGER NOT NULL,packs JSONB NOT NULL,status TEXT NOT NULL DEFAULT 'awaiting_payment' CHECK (status IN ('awaiting_payment','review','processing','completed','rejected','cancelled')),created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
 CREATE TABLE IF NOT EXISTS receipts (order_id UUID PRIMARY KEY REFERENCES orders(id) ON DELETE CASCADE,mime TEXT NOT NULL,content BYTEA NOT NULL,uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now());
 CREATE INDEX IF NOT EXISTS orders_created_idx ON orders(created_at DESC);`);
}
