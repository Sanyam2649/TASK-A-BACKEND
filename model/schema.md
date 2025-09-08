# 📌 Profile Schema Documentation

This document describes the **Profile Schema** used in the project.  
It is implemented with **MongoDB** using **Mongoose**.

---

## 📂 Collection: `profiles`

Stores user profiles including personal details, skills, projects, work experience, education, and external links.

---

## 🏗️ Schema Structure

### 🔹 Profile
| Field         | Type     | Required | Unique | Description |
|---------------|----------|----------|--------|-------------|
| **name**      | String   | ✅ Yes   | ❌ No  | Full name of the user |
| **email**     | String   | ✅ Yes   | ✅ Yes | Email address (unique identifier) |
| **education** | [String] | ❌ No   | ❌ No | List of education details (degree, institution, etc.) |
| **skills**    | [String] | ❌ No   | ❌ No | List of technical and non-technical skills |
| **projects**  | [Project] | ❌ No  | ❌ No | List of project details (see Project schema) |
| **work**      | [Work]   | ❌ No   | ❌ No | List of work experiences (see Work schema) |
| **links**     | Object   | ❌ No   | ❌ No | External profile links |
| ┣ **github**   | String | ❌ No | ❌ No | GitHub profile URL |
| ┣ **linkedin** | String | ❌ No | ❌ No | LinkedIn profile URL |
| ┗ **portfolio**| String | ❌ No | ❌ No | Personal portfolio URL |
| **timestamps** | Date | Auto | Auto | Auto-generated `createdAt` and `updatedAt` |

---

### 🔹 Project (Embedded Schema)
| Field         | Type     | Required | Description |
|---------------|----------|----------|-------------|
| **title**     | String   | ✅ Yes   | Title of the project |
| **description** | String | ❌ No   | Short summary of the project |
| **links**     | [String] | ❌ No   | List of external links (e.g., GitHub repo, live demo) |
| **skills**    | [String] | ❌ No   | Skills/technologies used in the project |

---

### 🔹 Work (Embedded Schema)
| Field         | Type     | Required | Description |
|---------------|----------|----------|-------------|
| **company**   | String   | ✅ Yes   | Company/Organization name |
| **role**      | String   | ❌ No   | Job title or designation |
| **duration**  | String   | ❌ No   | Work duration (e.g., "Jan 2022 - Dec 2023") |
| **description** | String | ❌ No   | Job responsibilities, achievements |

---

