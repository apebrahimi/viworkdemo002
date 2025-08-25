# 🌐 ViWorkS Website

## 📋 **Overview**

The ViWorkS Website is a marketing and documentation website built with Next.js and TypeScript. It provides comprehensive information about the ViWorkS platform with Persian/Farsi RTL support and lead generation capabilities.

---

## 🗂️ **Directory Structure**

```
website/
├── src/                  # Source code
│   ├── app/             # Next.js App Router
│   ├── components/      # React components
│   ├── lib/             # Utility libraries
│   ├── types/           # TypeScript types
│   └── styles/          # CSS/SCSS files
├── public/              # Static assets
├── docs/                # Documentation
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

---

## 🎯 **Website Features**

### **📄 Content & Marketing**
- **Homepage**: Hero section with value proposition
- **Product Features**: Comprehensive feature showcase
- **Security Documentation**: Technical security details
- **Use Cases**: Industry-specific applications
- **Pricing**: Transparent pricing information

### **🌍 Internationalization**
- **Persian/Farsi Support**: Full RTL language support
- **SEO Optimization**: Multi-language SEO
- **Content Management**: Easy content updates
- **Localization**: Culture-specific content

### **📊 Lead Generation**
- **Contact Forms**: Lead capture forms
- **Demo Requests**: Interactive demo scheduling
- **Newsletter**: Email subscription
- **Analytics**: Conversion tracking

### **🔧 Technical Features**
- **Performance**: Optimized for speed
- **Accessibility**: WCAG compliance
- **Mobile Responsive**: Cross-device compatibility
- **Progressive Web App**: PWA capabilities

---

## 🛠️ **Technology Stack**

### **⚛️ Next.js 14**
- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: React components
- **Routing**: File-based routing

### **🎨 UI/UX**
- **Design System**: Consistent component library
- **Typography**: Persian-optimized fonts
- **Icons**: SVG icon system
- **Animations**: Framer Motion
- **Responsive**: Mobile-first design

### **📊 Analytics & SEO**
- **SEO**: Next.js SEO optimization
- **Analytics**: Google Analytics, Plausible
- **Performance**: Core Web Vitals optimization
- **Structured Data**: JSON-LD markup

---

## 🚀 **Development Status**

### **⏳ Website - PLANNED**
- **Status**: Development planned
- **Content**: Persian content requirements defined
- **Design**: UI/UX design planned
- **Features**: Lead generation system planned

---

## 🔧 **Development Commands**

### **📋 Setup**
```bash
# Navigate to website
cd products/website

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### **🧪 Testing**
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### **📦 Building**
```bash
# Build for production
npm run build

# Export static site
npm run export

# Analyze bundle
npm run analyze
```

---

## 🌍 **Internationalization**

### **📝 Persian/Farsi Support**
- **RTL Layout**: Right-to-left text direction
- **Persian Fonts**: Optimized typography
- **Content**: Persian marketing content
- **SEO**: Persian meta tags and keywords

### **🔧 i18n Configuration**
```typescript
// next.config.js
const nextConfig = {
  i18n: {
    locales: ['en', 'fa'],
    defaultLocale: 'fa',
    localeDetection: true,
  },
}
```

---

## 📊 **Content Structure**

### **🏠 Homepage**
- **Hero Section**: Value proposition and CTAs
- **Features**: Key platform features
- **Benefits**: Business value demonstration
- **Social Proof**: Customer testimonials
- **Call-to-Action**: Lead generation forms

### **📋 Product Pages**
- **Features**: Detailed feature descriptions
- **Security**: Security architecture details
- **Use Cases**: Industry applications
- **Pricing**: Transparent pricing
- **Documentation**: Technical documentation

### **📞 Contact & Support**
- **Contact Form**: Lead capture
- **Demo Request**: Interactive scheduling
- **Support**: Help and documentation
- **Newsletter**: Email subscription

---

## 🚀 **Deployment**

### **🐳 Docker Deployment**
```bash
# Build Docker image
docker build -t viworks-website .

# Run container
docker run -p 3000:3000 viworks-website

# Deploy with Docker Compose
docker-compose up -d
```

### **☁️ Cloud Deployment**
```bash
# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod

# Deploy to AWS Amplify
amplify publish
```

### **📊 Performance Optimization**
```bash
# Analyze performance
npm run lighthouse

# Optimize images
npm run optimize-images

# Bundle analysis
npm run analyze
```

---

## 📝 **Documentation**

### **📚 Website Documentation**
- **Content Guide**: Content creation guidelines
- **Design System**: UI component documentation
- **SEO Guide**: Search engine optimization
- **Performance**: Performance optimization guide

### **🔧 Development Guides**
- **Setup**: Development environment setup
- **Components**: Component development guide
- **Styling**: CSS and design guidelines
- **Deployment**: Deployment procedures

---

## 🎯 **Next Steps**

### **🔄 Immediate Actions**
1. **Website Development**
   - Set up Next.js project structure
   - Implement Persian/Farsi RTL support
   - Create component library
   - Build homepage and key pages

2. **Content Creation**
   - Write Persian marketing content
   - Create technical documentation
   - Design lead generation forms
   - Implement analytics tracking

3. **SEO & Performance**
   - Optimize for search engines
   - Implement structured data
   - Optimize Core Web Vitals
   - Set up monitoring and analytics

---

**The ViWorkS Website provides comprehensive marketing and documentation with Persian/Farsi support and lead generation capabilities.**
