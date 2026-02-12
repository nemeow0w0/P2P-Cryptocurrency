**1 ER diagram**



![Project Screenshot](/src/assets/ER.svg)



**2. การติดตั้งและเริ่มใช้งาน** 
Clone และติดตั้ง Library:


<pre>```git clone <your-repo-url>
cd <project-folder>
npm install``` 
  </pre>

**ตั้งค่าไฟล์ .env**
เปลี่ยนชื่อ ไฟล.env.Exasample เป็น .env ส่ URL ของ Database (PostgreSQL) และ JWT Secret

**เตรียมฐานข้อมูลและ Seed ข้อมูล:**
<pre>
```
npx prisma migrate dev --name init
npx prisma db seed
```
  </pre>
*(ไฟล์ Seed จะทำการสร้างเหรียญ BTC, ETH, THB และผู้ใช้ทดสอบให้โดยอัตโนมัติ)*

**รันระบบ:**
<pre>>
```
npm run dev
```
  </pre

 **3. ขั้นตอนการทดสอบ**

<pre>
JSON
```
{
  "assetId": 4, "amount": 0.01,
  "type": "EXTERNAL", "externalAddress": "0x71C7656..."
}
```
  </pre>
