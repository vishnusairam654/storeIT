# 🗄️ StoreIT — Cloud File Storage & Management

> A modern file storage platform to upload, organize, and access your files securely from anywhere.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-ram654.dev-blue?style=for-the-badge)](https://ram654.dev)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## ✨ What It Does

StoreIT is a full-stack cloud file storage application that lets users securely **upload, preview, and manage files** through a clean dashboard interface. Built with a focus on performance and UX, it handles authentication, file organization, and real-time feedback out of the box.

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| 📤 **File Upload** | Upload files with drag-and-drop support and instant preview |
| 🔐 **Authentication** | Secure JWT-based login and session management |
| 📁 **File Management** | Organize, rename, and delete your stored files |
| 👁️ **File Preview** | In-browser preview for images, PDFs, and documents |
| 📊 **Storage Dashboard** | Overview of used space and file categories |
| 📱 **Responsive UI** | Fully responsive design across mobile and desktop |

---

## 🛠️ Tech Stack

**Frontend**
- React 18
- Tailwind CSS / MUI
- React Router v5

**Backend**
- Node.js + Express (or FastAPI)
- JWT Authentication
- REST API

**Storage & DB**
- Appwrite / Firebase / Supabase _(update as applicable)_

**Deployment**
- Vercel / Render

---

## 📸 Screenshots/Video



https://github.com/user-attachments/assets/4a2ba65c-5041-477b-a8f7-424ee104aa54



---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+

### Installation

```bash
git clone https://github.com/vishnusairam654/storeit.git
cd storeit
npm install
```

### Environment Variables

Create a `.env` file:

```env
REACT_APP_API_URL=your_backend_url
REACT_APP_APPWRITE_PROJECT_ID=your_project_id
```

### Run Locally

```bash
# Frontend
npm start

# Backend
npm run server
```

---

## 📂 Project Structure

```
storeit/
├── src/
│   ├── components/     # Upload, FileCard, Dashboard, Navbar
│   ├── pages/          # Home, Login, Register, Dashboard
│   ├── context/        # Auth context
│   └── api/            # API service functions
├── server/             # Express/FastAPI backend
└── public/
```

---

## 👤 Author

**Vishnu Sai Ram**
- 🌐 [ram654.dev](https://ram654.dev)
- 💼 [LinkedIn](https://linkedin.com/in/vishnu654)
- 🐙 [GitHub](https://github.com/vishnusairam654)

---

> ⭐ If you found this project interesting, consider giving it a star!
