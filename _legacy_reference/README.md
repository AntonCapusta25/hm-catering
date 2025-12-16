# Private Chef - Christmas Experience

A beautiful React + Vite application for booking private chefs and Christmas menu boxes, powered by Supabase.

## Features

- 🎄 Beautiful Christmas-themed design
- 👨‍🍳 Private chef booking system
- 📦 Menu box selection
- 🎨 Smooth animations with GSAP and Lenis
- 🎠 3D cuisine carousel with Swiper
- 📱 Fully responsive design
- ⚡ Fast performance with Vite
- 🗄️ Supabase backend

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase_schema.sql` in your Supabase SQL Editor
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Add your Supabase credentials to `.env`:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### 3. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

Vercel will automatically detect the Vite configuration and deploy correctly.

## Project Structure

```
src/
├── components/          # React components
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── Occasions.jsx
│   ├── CuisineCarousel.jsx
│   ├── HowItWorks.jsx
│   ├── MenuBoxes.jsx
│   ├── MenuModal.jsx
│   ├── BookingForm.jsx
│   └── ChefSignup.jsx
├── lib/
│   └── supabase.js     # Supabase client & helpers
├── styles/
│   └── index.css       # Global styles
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## Technologies

- **Frontend**: React 18, Vite
- **Backend**: Supabase (PostgreSQL)
- **Animations**: GSAP, Lenis
- **Carousel**: Swiper
- **Hosting**: Vercel
- **Styling**: Vanilla CSS with CSS Variables

## License

Private project
