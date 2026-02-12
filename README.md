**1 ER diagram**



![Project Screenshot](/src/assets/ER.svg)



**2. การติดตั้งและเริ่มใช้งาน** 
Clone และติดตั้ง Library:


````bash git clone <your-repo-url>
cd <project-folder>
npm install``` 
  

**ตั้งค่าไฟล์ .env**
เปลี่ยนชื่อ ไฟล.env.Exasample เป็น .env ส่ URL ของ Database (PostgreSQL) และ JWT Secret

**เตรียมฐานข้อมูลและ Seed ข้อมูล:**

```bash npx prisma migrate dev --name init
npx prisma db seed```
  
*(ไฟล์ Seed จะทำการสร้างเหรียญ BTC, ETH, THB และผู้ใช้ทดสอบให้โดยอัตโนมัติ)*

**รันระบบ:**

```bashnpm run dev```

 **3. ขั้นตอนการทดสอบ**


JSON
```bash
{
  "assetId": 4, "amount": 0.01,
  "type": "EXTERNAL", "externalAddress": "0x71C7656..."
}
```
