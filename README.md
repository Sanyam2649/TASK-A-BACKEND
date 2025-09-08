
# 🚀 Task A Backend  

A **Node.js + Express + MongoDB** backend for managing developer profiles.  
Includes CRUD operations, search, project filtering, skills tracking, and JWT-based authentication with CORS support.

---

## 📂 Directory Structure  

<details>
<summary>
sanyam2649-task-a-backend/
├── README.md             # Project documentation
├── app.js                # Main entry point
├── mongoDB.js            # MongoDB connection
├── package.json          # Dependencies and scripts
├── router.js             # API routes
└── model/
├── schema.md         # Schema documentation
└── user.js           # Mongoose schema & model

</summary>
</details>

---

## 🗄️ Database  

- **Database:** MongoDB  
- **ODM:** Mongoose  
- **Main Collection:** `profiles`  
- **Embedded Schemas:** `projects`, `work`  

---

## 📬 Postman Collection  

Test the API using this Postman collection:  
👉 [Open Postman Collection](https://cloudy-firefly-69138.postman.co/workspace/Sanyam-Bansal~1e58cae1-7e55-4883-96fd-4462de73c76c/collection/31953662-68263de6-04e6-4f8b-8f69-ca5e6fa6d0ca?action=share&source=copy-link&creator=31953662)

---

## ⚡ Installation & Setup  

```bash
# 1. Clone the repository
git clone https://github.com/sanyam2649/task-a-backend.git
cd sanyam2649-task-a-backend

# 2. Install dependencies
npm install

# 3. Create a .env file in the root directory
````

### Example `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7
CORS_ORIGINS=http://localhost:3000,http://yourfrontend.com
```

```bash
# 4. Start the server
npm start
```

---

## ✨ Features

* 👤 User Profiles – create, update, delete, fetch profiles
* 🎓 Education – manage multiple education entries
* 🛠️ Skills – track and fetch top skills (per profile & globally)
* 📂 Projects – add projects, filter by skills
* 💼 Work Experience – company, role, duration, description
* 🔍 Search – across name, email, skills, projects, work, education
* 🔗 Links – GitHub, LinkedIn, portfolio integration
* 🌍 CORS Enabled – safe cross-origin requests
* 🕒 Timestamps – auto-generated `createdAt` & `updatedAt`



