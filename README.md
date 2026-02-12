# P2P-Cryptocurrency

test Backend
**Node.js, Express, PostgreSQL, and Prisma ORM**.

------------------------------------------------------------------------

## 1. ER Diagram

![ER Diagram](src/assets/ER.svg)

------------------------------------------------------------------------

## 2. ฟีเจอร์

-   สมัครสมาชิก
-   บันทุกการโอนเงิน ซื้อ - ขาย เเลกเปลี่ยน
-   ชำระด้วย เงิน / Crypto

------------------------------------------------------------------------

## 3. เครื่องมือที่ใช้

-   Node.js
-   Express.js
-   PostgreSQL
-   Prisma ORM
-   JWT Authentication

------------------------------------------------------------------------

## 4. การติดตั้งระบบ และ คั้งค่า

### Clone Repository

``` bash
git clone https://github.com/nemeow0w0/P2P-Cryptocurrency.git
cd <project-folder>
npm install
```

------------------------------------------------------------------------

### Environment Config

เปลี่ยนชื่อไฟล์ `.env.example` เป็น `.env` และตั้งค่า Url database และ JWT_SECRET:

    DATABASE_URL=your_postgresql_database_url
    JWT_SECRET=your_secret_key

------------------------------------------------------------------------

### Database Migration & Seed

``` bash
npx prisma migrate dev --name init
npx prisma db seed
```

Seed file ข้อมูลเบื่องต้น ประกอบด้วย :

-   ผู้ใช้ทอดสอบ A และB
-   สกุลเงิน และ crypto : BTC, ETH, THB, USD, XRP
-   กระเป่าเงินเริ่มต้น : User A มีเงิน, UserB มี Crypto


------------------------------------------------------------------------

### รัน Server 

``` bash
npm run dev
```

------------------------------------------------------------------------

## 5. ตัวอย่างการทดสอบ API  (Transfer)

*POSTMAN:* [![Run in Postman](https://run.pstmn.io/button.svg)](https://nemeowowo-553043.postman.co/workspace/edc3cf07-6e64-45d6-93ea-bf4226fa3c7b/collection/47112588-c3bc163f-c03d-4b73-81ee-507a967f9dac?action=share&source=copy-link&creator=47112588)


------------------------------------------------------------------------

#  API Documentation

---

##  1. Authentication (ระบบสมาชิก)

จัดการผู้ใช้

| Method | Endpoint        | Description                          |
|--------|---------------|--------------------------------------|
| POST   | /register | สมัครสมาชิกใหม่                     |
| POST   | /login    | เข้าสู่ระบบเพื่อรับ JWT Token       |
| GET    |/profile      | ดึงข้อมูลโปรไฟล์ของผู้ใช้ที่ Login อยู่ |

body
*Login*
``` bash
{
  "username": "UserA",
  "password": "123456"
}
```

---

##  2. Wallets & Assets (กระเป๋าเงิน)

ดูกระเป๋าเงิน

| Method | Endpoint            | Description                                      |
|--------|--------------------|--------------------------------------------------|
| POST    | /assets            | เพิ่ม asset ใหม่        |
| GET    | /assets            | ดึงรายการเหรียญทั้งหมด (BTC, ETH, THB)        |
| GET    | /wallet | ดูยอดคงเหลือ                |


body
*add asset*
``` bash
{
    "symbol": "DOGE",
    "name": "doge",
    "type": "crypto"
}
```
---

## 3. Orders (ตั้งซื้อ-ขาย)

ตั้งรายการ ซื้อ - ขาย 

| Method | Endpoint      | Description                                           |
|--------|--------------|-------------------------------------------------------|
| GET    | /orders      | ดึงรายการออเดอร์ทั้งหมด        |
| POST   | /orders      | สร้างประกาศซื้อหรือขายใหม่           |
| PUT    | /orders   | แก้ไขออเดอร์                             |
| PATH | /orders/cancel  | ยกเลิกออเดอร์ของตนเอง                                |

body
*add order*
``` bash
{
  "assetId": 1, (ไอดีasset)
  "fiatId": 3, (ไอดี)
  "side": "buy",
  "price": 300000,
  "amount": 1
}
```

---

## 4. Trades 
ซื้อ-ขาย แลกเปลี่ยน

| Method | Endpoint  | Description                                                  |
|--------|----------|--------------------------------------------------------------|
| POST   | /trade  | ทำการเทรด (ระบุ `mode: FIAT` หรือ `CRYPTO`)             |
| GET    | /trade  | ดูประวัติการซื้อขายที่สำเร็จแล้วของตนเอง                   |


body
*transfer*
``` bash
{
    "buyOrderId": 17, เลขไอดีออเดอร์ที่ขาย
    "sellOrderId": 19, เลขไอดีออเดอร์ซื้อ
    "assetId": 4,
    "fiatId": 3,
    "mode": "CRYPTO", รูปแบบการเทรด FIAT หรือ CRYPTO
    "value": 0.1 
}
```
---

## 5. Transfers (โอนเงิน)

ใช้สำหรับการโอนเหรียญทั้งภายในและภายนอกระบบ

| Method | Endpoint   | Description                                              |
|--------|-----------|----------------------------------------------------------|
| POST   | /transfers | ทำการโอนเหรียญ (`INTERNAL` หรือ `EXTERNAL`)            |
| GET    | /transferHistory | ดูประวัติการโอนเงินทั้งหมดของตนเอง                     |


body
*transfer*
``` bash
{
  "assetId": 3,
  "amount": 5000000,
  "type": "INTERNAL", 
  "receiverAddress": "11394c3e-f7a6-4be5-b117-0ac77ccbf4f9" (WalletAddress ของคนที่เราจะโอนให้)
}
```
---

## Authentication

ทุก endpoint (ยกเว้น `/register` และ `/login` และ `/orders`)  
ต้องแนบ JWT Token ใน Header

```bash
Authorization: Bearer <your_token>

