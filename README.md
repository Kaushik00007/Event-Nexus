# 🚀 EventNexus – Event Aggregator for College/University Students

## 🌐 Live Site
Check out the live application here: 👉 **[EventNexus Live Site](https://event-nexus-phi.vercel.app)**

## 🧩 Introduction
EventNexus is a full-stack web platform built to help college students easily discover and manage tech events, hackathons, workshops, and free developer resources all in one place.
Designed with a seamless user experience, EventNexus aggregates events automatically through web scraping and allows organizers to submit their own events, creating a central hub for student opportunities.

## 🎯 Features
- ✅ **Event Discovery** – Automatically scraped and manually submitted events from platforms like GDG, Devfolio, MLH, and Eventbrite.
- ✅ **Free Courses & Resources** – Curated list of free online courses with coupon codes and developer resources like GitHub Student Pack.
- ✅ **College Profiles** – Dedicated pages for individual college events and opportunities.
- ✅ **Automated Scraping** – Powered by Firecrawl and node-cron to keep event listings up to date automatically.
- ✅ **Secure Authentication** – Role-based access control (User, Organizer, Admin) powered by Supabase.
- ✅ **Admin Dashboard** – Comprehensive approval workflows, event management, and resource moderation.
- ✅ **Responsive Design** – Optimized for seamless browsing across desktop and mobile devices.

## 🛠️ Tech Stack
- **React 18 + Vite** – Frontend framework
- **Tailwind CSS v3** – Styling and responsive design
- **Node.js / Express.js** – Backend API
- **Supabase (PostgreSQL)** – Database and authentication
- **Firecrawl** – AI Web Scraping API
- **Framer Motion & OGL** – Animations and 3D canvas effects
- **Lenis** - For Smooth Scrolling
- **Railway / Vercel** – Deployment infrastructure

## ⚙️ Installation

Clone the repository:
```bash
git clone https://github.com/Kaushik00007/Event-Nexus.git
cd Event-Nexus
```

Install dependencies for both backend and frontend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

Set up your `.env` variables in both `backend` and `frontend` directories using your Supabase and Firecrawl API keys.

Run the development servers:
```bash
# Terminal 1 — backend (runs on http://localhost:5000)
cd backend
npm run dev

# Terminal 2 — frontend (runs on http://localhost:5173)
cd frontend
npm run dev
```

Your app will be available at:
👉 **http://localhost:5173**

## 💻 Usage
1. Sign up or sign in to your account.
2. Browse the homepage to discover featured and local events.
3. Filter events by category, city, or event type.
4. If you are an organizer, submit your own events for admin approval.
5. Explore the specific sections for free courses and developer resources.
6. Admins can access the dashboard to manage content and approve pending events.

## 🌟 Future Enhancements
- Team formation features for hackathons.
- Calendar integration for saving events.
- Advanced personalized event recommendations based on user interests.
- In-app messaging for event organizers and attendees.

## 🤝 Contributions
Contributions are welcome! Follow these steps:
```
1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push to your fork
5. Open a pull request
```

## 💻 Cross-Platform Development (Fedora & Windows)

This project is designed to work seamlessly on both **Fedora (Linux)** and **Windows**. To ensure a consistent experience:

1.  **Git Configuration**: This project uses a `.gitattributes` file to enforce `LF` line endings in the repository. To avoid warnings on Windows, run:
    ```bash
    git config --global core.autocrlf input
    ```

2.  **Native Modules**: If you alternate between Windows and Fedora, the `node_modules` folder will contain OS-specific binaries. Always run the following when switching:
    ```bash
    # Reinstall all dependencies for the current OS
    npm run install-all
    ```

3.  **Case Sensitivity**: Remember that Fedora is case-sensitive. Always ensure your `import` statements match the filename casing exactly (e.g., `Navbar.jsx` must be imported as `Navbar`, not `navbar`).

4.  **Build Tools**:
    - **Fedora**: Run `sudo dnf group install development-tools`.
    - **Windows**: Install [Build Tools for Visual Studio](https://visualstudio.microsoft.com/visual-cpp-build-tools/).

## 📩 Contact
For queries or collaboration, reach out via:
- 📧 Email: kaushik0007@gmail.com
- 🔗 LinkedIn: Kaushik K Dev
- 🐱 GitHub: Kaushik00007

---

💻 Built with Passion using React, Express, Tailwind CSS, and Supabase.
