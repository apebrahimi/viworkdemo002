# ViWorkS Admin Panel Frontend

A modern, responsive admin panel for managing ViWorkS VPN infrastructure built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX** - Clean, professional interface with Tailwind CSS
- **Real-time Dashboard** - Live monitoring of VPN clients and servers
- **User Management** - Complete user administration system
- **Security Monitoring** - Real-time security alerts and threat detection
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **TypeScript** - Full type safety and better developer experience

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Configure the API URL in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard page
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   └── ui/               # Base UI components
├── lib/                  # Utility libraries
│   ├── api.ts            # API client
│   └── utils.ts          # Utility functions
└── types/                # TypeScript type definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🌐 API Integration

The frontend communicates with the ViWorkS Admin Panel Backend API:

- **Base URL**: `http://localhost:8080`
- **API Version**: `v1`
- **Authentication**: JWT Bearer tokens
- **Endpoints**: See `src/lib/api.ts` for complete API documentation

## 🎨 UI Components

The admin panel includes several reusable components:

- **Button** - Multiple variants (primary, secondary, danger, ghost)
- **Card** - Content containers with shadows
- **Table** - Data display with sorting and pagination
- **Modal** - Overlay dialogs
- **Form** - Input components with validation

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Different permission levels
- **CSRF Protection** - Built-in Next.js security
- **Input Validation** - Zod schema validation
- **XSS Prevention** - React's built-in XSS protection

## 📱 Responsive Design

The admin panel is fully responsive and works on:

- **Desktop** (1200px+) - Full dashboard layout
- **Tablet** (768px - 1199px) - Adapted layout
- **Mobile** (< 768px) - Mobile-optimized interface

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker
```bash
docker build -t viworks-admin-frontend .
docker run -p 3000:3000 viworks-admin-frontend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the ViWorkS platform and is proprietary software.

## 🆘 Support

For support and questions:
- Check the documentation in `/docs`
- Review the backend API documentation
- Contact the development team

---

**ViWorkS Admin Panel Frontend** - Enterprise-grade VPN management interface
