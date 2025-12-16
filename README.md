# Homemade - Private Chef & Menu Box Experience

A premium web application for booking private chefs and ordering curated menu boxes. This project features a high-end public facing website and a comprehensive Admin Portal for content management.

## Features

### Public Website

- **Dynamic Hero Section**: Smooth cross-fade animations showcasing the experience.
- **Menu Browser**: Categorized menu display (Christmas & International).
- **Chef Profiles**: Carousel of available chefs with detailed modals.
- **Occasions**: Curated event types with visual previews.
- **Booking System**: Integrated Typeform for seamless booking requests.

### Admin Portal (`/admin`)

- **Secure Login**: Glassmorphic login screen protected by middleware.
- **CMS (Content Management System)**:
  - **Menu Manager**: Create, edit, and delete menu items visually.
  - **Chef Manager**: Manage chef profiles, specialties, and bioavailability.
  - **Occasion Manager**: Update event categories and images.
- **Live Preview**: Real-time split-screen preview for all CMS editors.
- **Form Builder**: Toggle between internal booking forms and external Typeform integration.

---

## 🚀 Getting Started

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Run Development Server**:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

3. **Access Admin Portal**:
   - URL: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
   - **Email**: `admin@homemade.com`
   - **Password**: `password`

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Database**: Supabase (Schema provided in `admin_schema.sql`)
- **Forms**: React Hook Form + Zod / Typeform Embed

## 📝 Admin Credentials (Local Dev)

> **IMPORTANT**: These are the default credentials for the local mock authentication.

| Field    | Value                  |
| :------- | :--------------------- |
| **User** | `admin@homemade.com`   |
| **Pass** | `password`             |

---

*Built with ❤️ for the Christmas Chef Event.*
