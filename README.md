# เติมเกมกับคุณนี้ด — IDV Echoes Shop

เว็บร้านโทนชมพู-ขาวพร้อมระบบคำนวณแพ็ค, รับออเดอร์, PromptPay แบบโอนมือ, อัปโหลดสลิปแบบส่วนตัว, ติดตามออเดอร์ และหลังบ้านแอดมิน

## สำคัญก่อนใช้งานจริง

- **ไม่ได้ตรวจสอบสลิปหรือเงินเข้าอัตโนมัติ** แอดมินต้องตรวจยอดเงินเข้าธนาคารด้วยตนเองก่อนเติม
- **ไม่มีการส่งข้อความ Facebook อัตโนมัติ** มีลิงก์ไปเพจ https://www.facebook.com/needxsleep เพื่อให้ลูกค้าติดต่อร้านเอง การแจ้งเตือนผ่าน Messenger อัตโนมัติต้องพัฒนาและขอสิทธิ์ Meta เพิ่ม
- ไม่รับรหัสผ่านเกม เก็บ UID และข้อมูลติดต่อเฉพาะเท่าที่จำเป็น
- การเก็บสลิปใช้ BYTEA ใน PostgreSQL ที่เข้าถึงได้ผ่าน API ของแอดมินที่เข้าสู่ระบบเท่านั้น (ไม่มี public URL) ฐานข้อมูลอาจโตเร็วเมื่อมีออเดอร์จำนวนมาก ควรเพิ่มนโยบายลบสลิป/ย้ายไป private object storage เมื่อขยายร้าน
- ราคาคำนวณบนเซิร์ฟเวอร์ซ้ำเสมอ และใช้วิธีหาแพ็คที่จ่ายน้อยที่สุดเพื่อให้ได้ Echoes อย่างน้อยตามจำนวนที่ต้องการ (อาจได้ Echoes เกิน)
- รหัสติดตามลับถูกเก็บใน localStorage ของอุปกรณ์ลูกค้า และแสดงตอนสร้างออเดอร์ ลูกค้าควรเก็บไว้ ไม่ควรแชร์ให้ผู้อื่น
- การใช้งานจริงควรตรวจสอบนโยบายผู้ให้บริการเกมและกฎหมายที่เกี่ยวข้อง

## A. ทดลองบนคอมพิวเตอร์

1. ติดตั้ง Node.js 20+ และ PostgreSQL
2. แตก ZIP เปิด Terminal ในโฟลเดอร์โปรเจกต์
3. `npm install`
4. คัดลอก `.env.example` เป็น `.env` แล้วกรอก `DATABASE_URL`, `SESSION_SECRET` (สุ่มอย่างน้อย 32 ตัว), `ADMIN_EMAIL`, `ADMIN_PASSWORD` (14 ตัวขึ้นไป), `PAYMENT_NAME`, `PAYMENT_NUMBER` และ `PUBLIC_BASE_URL=http://localhost:3000`
5. `npm run setup:admin` (สร้างบัญชีแอดมินในฐานข้อมูล)
6. `npm start`
7. เปิด http://localhost:3000 และ http://localhost:3000/admin.html

## B. นำขึ้น GitHub + Railway ทีละขั้น

1. สร้าง GitHub repository ใหม่ (แนะนำ Private) และอัปโหลดไฟล์ที่แตกจาก ZIP โดย **ไม่อัปโหลด `.env` หรือ `node_modules`**
2. Railway > New Project > Deploy from GitHub repo > เลือก repo ของร้าน
3. Railway > New > Database > PostgreSQL (ในโปรเจกต์เดียวกัน)
4. เปิด service ของเว็บ > Variables > เพิ่ม `DATABASE_URL` เป็น **reference** ไปยังตัวแปร `DATABASE_URL` ของ PostgreSQL ใน Railway (ใช้เมนู Add Reference อย่าคัดลอก URL ไปโพสต์สาธารณะ)
5. เพิ่ม Variables: `SESSION_SECRET` เป็นค่าสุ่มยาว 64 ตัว, `NODE_ENV=production`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `PAYMENT_NAME`, `PAYMENT_NUMBER`, `DATABASE_SSL=false`
6. เปิดเว็บ service > Settings > Networking > Generate Domain เพื่อได้ `https://...up.railway.app`
7. ตั้ง `PUBLIC_BASE_URL` เป็น URL HTTPS จริงของเว็บไซต์ **ไม่มี / ปิดท้าย** แล้ว Redeploy
8. สร้างแอดมินครั้งแรก: ใน Railway service เปิด Shell/Terminal (ถ้ามี) แล้วรัน `npm run setup:admin` หรือใช้ Railway CLI (`railway run npm run setup:admin`) โดยตรวจสอบให้แน่ใจว่า command ได้รับ Variables และเชื่อมต่อ PostgreSQL จริง หาก Shell ไม่พร้อม ใช้ CLI/one-off job ที่เชื่อม service เดียวกัน
9. รอ Deploy เสร็จ ทดสอบ `/health`, หน้าร้าน, สร้างออเดอร์ทดสอบ, อัปโหลดสลิป, ล็อกอิน `/admin.html`, เปิดดูสลิป และเปลี่ยนสถานะ
10. เมื่อเสร็จแล้วลบ `ADMIN_PASSWORD` จาก Railway Variables ได้ (hash อยู่ใน DB แล้ว) แต่ถ้าจะรีเซ็ตรหัสผ่าน ต้องตั้งตัวแปรใหม่แล้วรัน `npm run setup:admin` อีกครั้ง

**Railway หมายเหตุ:** ไม่ต้องกำหนด Start Command ถ้าระบบตรวจจับ Node.js ได้ โดยค่าเริ่มต้นใช้ `npm start` หาก deploy ไม่ผ่านให้ตั้ง Start Command เป็น `npm start` และดู Deploy Logs

## C. ความปลอดภัยและข้อจำกัด

- Password hash bcrypt, session เก็บใน PostgreSQL, secure HTTP-only cookie ใน production, CSRF token + origin check, rate limit, Helmet CSP, prepared queries, ไฟล์ไม่เกิน 3 MB และตรวจ file signature
- อย่าเปิดเผย `SESSION_SECRET`, `DATABASE_URL`, รหัสผ่านแอดมิน หรือรหัสติดตามออเดอร์
- เปิดใช้งาน HTTPS (Railway domain มี HTTPS), สำรองฐานข้อมูล, จัดการสิทธิ์ Railway/GitHub และทดสอบการกู้คืนข้อมูล
- ระบบนี้เป็น **เวอร์ชันเริ่มต้นสำหรับร้านเล็ก** ไม่ใช่ระบบรับชำระเงินอัตโนมัติ และไม่ได้ผ่าน penetration test ภายนอก
- ถ้าร้านมีออเดอร์มาก ควรเพิ่ม audit log, จำกัดจำนวนออเดอร์ต่อ IP, retention policy, backup, malware scanning สลิป, 2FA แอดมิน, การยืนยันการชำระเงินผ่านผู้ให้บริการที่ได้รับอนุญาต
- รายละเอียดบัญชีรับเงินต้องตรวจทานก่อนเปิดเว็บจริง โดยเฉพาะชื่อผู้รับและหมายเลข PromptPay

## API หลัก

`GET /api/config`, `GET /api/quote?echoes=1500`, `POST /api/orders`, `GET /api/orders/:code` (ต้องส่ง `x-order-secret`), `POST /api/orders/:code/receipt` (ต้องส่ง `x-order-secret`), `POST /api/admin/login`, `GET /api/admin/orders`, `GET /api/admin/orders/:code/receipt`, `PATCH /api/admin/orders/:code`, `POST /api/admin/logout`.

POST/PATCH ต้องส่ง `x-csrf-token` จาก `/api/config` หรือ login response
