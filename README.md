# Hylmi Rafif Rabbani - Personal Portfolio Website

A modern, responsive personal portfolio website showcasing my experience as a Technology & Cybersecurity Professional. Built with Next.js 15, TypeScript, and featuring a secure admin dashboard with contact management system.

## 🛡️ SECURITY NOTICE

**This portfolio includes protected admin areas. Default credentials MUST be changed before deployment:**

- **Admin Username**: `hylmi` 
- **Admin Password**: `admin2024`

**🚨 CRITICAL**: Change these credentials in `src/app/admin/page.tsx` and `src/app/database/page.tsx` before deploying to production!

## 🚀 Features

### 🎨 Design & Interface
- **Modern Design**: Clean, professional layout with gradient effects
- **Responsive**: Fully responsive design for all devices  
- **Interactive**: Smooth animations with Framer Motion
- **Query Theme**: Database/coding themed decorative elements

### 📧 Contact System
- **Contact Form**: Functional contact form with validation
- **Email Integration**: Automated email sending via Nodemailer
- **Database Storage**: All messages saved to database (MySQL/SQLite)
- **Status Tracking**: Message status management

### 🔒 Admin Dashboard
- **Authentication**: Username/password protected access
- **Contact Management**: View, update, and manage all submissions
- **Statistics**: Dashboard with contact analytics
- **Database Viewer**: Direct database inspection tools
- **CRUD Operations**: Full contact management capabilities

### 💾 Database System
- **Dual Database**: MySQL primary with SQLite fallback
- **Automatic Setup**: Database tables created automatically
- **Error Handling**: Robust error handling and recovery

## 🔧 Quick Setup

### 1. Installation

## 🚀 Professional Highlights

- **Current Role**: Chairperson at Nextzenith Ventures MiRoom
- **Background**: Cybersecurity, Project Management, Business Development
- **Experience**: Google, Traveloka, PT Pertamina Gas Negara Tbk, and more
- **Education**: BINUS University (Cybersecurity), Harvard Business School, Purwadhika
```bash
git clone <repository-url>
cd personal-website-main
npm install
```

### 2. Environment Setup

Create `.env.local` file:
```bash
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional MySQL Configuration
MYSQL_HOST=localhost
MYSQL_USER=your-mysql-user
MYSQL_PASSWORD=your-mysql-password
MYSQL_DATABASE=portfolio_db
```

### 3. Security Configuration (CRITICAL)

**BEFORE DEPLOYMENT**, change admin credentials in:

**File: `src/app/admin/page.tsx` (lines 28-29)**
```javascript
const ADMIN_USERNAME = 'your-secure-username';
const ADMIN_PASSWORD = 'your-secure-password';
```

**File: `src/app/database/page.tsx` (lines 38-39)**
```javascript
const ADMIN_USERNAME = 'your-secure-username';
const ADMIN_PASSWORD = 'your-secure-password';
```

### 4. Development

```bash
npm run dev
```

Access:
- Portfolio: http://localhost:3000
- Admin: http://localhost:3000/admin
- Database: http://localhost:3000/database

## 🚀 Deployment to Vercel

### 1. Prepare for Deployment
```bash
# Test build
npm run build

# Ensure no errors and all routes work
```

### 2. Deploy to Vercel

**Option A: GitHub Integration (Recommended)**
1. Push code to GitHub
2. Connect repository at [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically

**Option B: Vercel CLI**
```bash
npm i -g vercel
vercel --prod
```

### 3. Configure Environment Variables in Vercel

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### 4. Verify Deployment

1. ✅ Portfolio loads correctly
2. ✅ Contact form sends emails
3. ✅ Admin login works with your new credentials
4. ✅ Database operations function properly

## 🔒 Security Features

### Protected Routes
- `/admin` - Admin dashboard (authentication required)
- `/database` - Database viewer (authentication required)

### Authentication System
- Username/password protection
- Session management via localStorage
- Automatic logout functionality
- Protection against unauthorized access

### Production Security Checklist
- [ ] Changed default admin credentials
- [ ] Set strong password (12+ characters)
- [ ] Configured email credentials
- [ ] Tested authentication in production
- [ ] Verified no sensitive data exposed

## 🧑‍💼 About Hylmi Rafif Rabbani

This portfolio represents my professional journey in technology and cybersecurity, featuring:

### Current Role
- **Chairperson**: Nextzenith Ventures MiRoom

### Professional Background  
- **Expertise**: Cybersecurity, Project Management, Business Development
- **Experience**: Google, Traveloka, PT Pertamina Gas Negara Tbk
- **Education**: BINUS University (Cybersecurity), Harvard Business School, Purwadhika
- **Entrepreneur**: Founder of Kedai Mas Yo & Cafe & Angkringan Bawah Kabel

## 📧 Contact Information

- **Email**: hylmi.rabbani@binus.ac.id
- **LinkedIn**: [linkedin.com/in/hylmiirafif](https://www.linkedin.com/in/hylmiirafif/)
- **GitHub**: [github.com/Hylmii](https://github.com/Hylmii)
- **Instagram**: [instagram.com/hirafmy](https://www.instagram.com/hirafmy/)
- **YouTube**: [youtube.com/@hylmiirafif](https://www.youtube.com/@hylmiirafif)
- **Location**: West Jakarta, Jakarta, Indonesia
- **Phone**: +62 857 1777 5232

## 📋 Portfolio Sections

### 🏠 Hero Section
- Name and job title
- Professional photo/avatar
- Brief introduction
- Call-to-action buttons

### 👤 About Me
- Personal bio
- Core skills highlights
- Work values and principles

### 🛠️ Skills
- **Frontend**: HTML, CSS, JavaScript, React, Next.js, Tailwind CSS
- **Backend**: Node.js, Express.js, PostgreSQL, MongoDB
- **DevOps & Tools**: Git, Docker, AWS, Vercel

### 💼 Portfolio
- Project showcase with STAR method format:
  - **Situation**: Project context
  - **Task**: Objectives and goals
  - **Action**: Steps taken and technologies used
  - **Result**: Outcomes and achievements
- Live demo and source code links
- Technology stack for each project

### 💼 Experience
- Work history timeline
- Job positions and companies
- Key responsibilities and achievements
- Career progression

### 💬 Testimonials
- Client and colleague feedback
- Professional recommendations
- Star ratings and reviews

### 📧 Contact
- Contact form with validation
- Social media links (Email, LinkedIn, GitHub, Instagram, YouTube)
- Quick response information

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **Image Optimization**: Next/Image
- **TypeScript**: Full type safety
- **Font**: Inter (Google Fonts)

## 🚦 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-hylmi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Customization

### 1. Personal Information
Edit `/src/data/portfolio.ts` to update:
- Personal details (name, job title, contact info)
- Bio and introduction
- Skills and expertise
- Work experience
- Project details using STAR method
- Testimonials

### 2. Images
Replace placeholder images in `/public/` folder:
- `placeholder-avatar.svg` - Your professional photo
- `placeholder-project.svg` - Project screenshots
- `placeholder-testimonial.svg` - Testimonial provider photos

### 3. Styling
- Modify `/src/app/globals.css` for global styles
- Update Tailwind classes in components
- Customize color scheme and typography

### 4. Content Structure
- Add/remove sections by editing `/src/app/page.tsx`
- Modify section components in `/src/components/sections/`
- Update navigation in `/src/components/Header.tsx`

## 📁 Project Structure

```
portfolio-hylmi/
├── public/                 # Static assets
│   ├── placeholder-*.svg  # Placeholder images
│   └── ...
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   └── globals.css    # Global styles
│   ├── components/        # React components
│   │   ├── sections/      # Page sections
│   │   ├── ui/           # Reusable UI components
│   │   ├── Header.tsx    # Navigation header
│   │   ├── Footer.tsx    # Page footer
│   │   └── index.ts      # Component exports
│   └── data/
│       └── portfolio.ts   # Portfolio data and types
├── package.json
└── README.md
```

## 🎨 Design Principles

- **Clean & Modern**: Minimalist design with focus on content
- **User Experience**: Smooth animations and intuitive navigation
- **Accessibility**: Proper semantic HTML and keyboard navigation
- **Performance**: Optimized images and lazy loading
- **Mobile First**: Responsive design for all screen sizes

## 📱 Responsive Design

- **Mobile**: Optimized for phones (320px+)
- **Tablet**: Enhanced layout for tablets (768px+)
- **Desktop**: Full-featured experience (1024px+)
- **Large Screens**: Utilizes large displays (1440px+)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `./clean-restart.sh` - Clean cache and restart (if needed)

## 🐛 Troubleshooting

### Next.js Multiple Lockfiles Warning
If you see a warning about multiple package-lock.json files, this has been fixed with:
```typescript
// next.config.ts
turbopack: {
  root: __dirname,
}
```

### Internal Server Error / Cache Issues
If you encounter cache-related errors, run:
```bash
./clean-restart.sh
```
Or manually:
```bash
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

### Email Functionality
Make sure your `.env.local` file contains:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📞 Support

If you need help customizing this portfolio, feel free to reach out through the contact form or social media links.
