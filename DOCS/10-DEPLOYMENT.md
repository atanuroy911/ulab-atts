# Deployment Checklist

## Local Development ✅

Your attendance management system is now ready for local development!

### What's Been Set Up

- ✅ Next.js 14 project with TypeScript
- ✅ MongoDB integration
- ✅ QR code generation
- ✅ CSV parsing and export
- ✅ Real-time dashboard updates
- ✅ Student attendance interface
- ✅ API routes (course, attend, export)
- ✅ Duplicate prevention system
- ✅ Environment configuration (.env.local)
- ✅ Comprehensive documentation

### To Start Development

```powershell
# 1. Ensure MongoDB is running
net start MongoDB

# 2. Install dependencies (already done)
npm install

# 3. Start development server
npm run dev
```

Visit: http://localhost:3000

## Production Deployment Checklist

### Pre-deployment Steps

- [ ] **Test Locally**
  - [ ] Create a session with sample data
  - [ ] Mark attendance from different devices
  - [ ] Test duplicate prevention
  - [ ] Export data (JSON and CSV)
  - [ ] Verify exports are saved correctly

- [ ] **Set Up Production Database**
  - [ ] Create MongoDB Atlas account
  - [ ] Set up a cluster
  - [ ] Create database user
  - [ ] Whitelist IP addresses (or allow all: 0.0.0.0/0)
  - [ ] Get connection string

- [ ] **Configure Environment Variables**
  - [ ] Update MONGODB_URI with production database
  - [ ] Update NEXT_PUBLIC_SITE_URL with production URL
  - [ ] Ensure HTTPS is used in production URL

### Deployment Options

#### Option 1: Vercel (Recommended - Easiest)

1. **Push to GitHub**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit - Attendance Management System"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Configure environment variables:
     - `MONGODB_URI`: Your production MongoDB connection string
     - `NEXT_PUBLIC_SITE_URL`: Your Vercel deployment URL (e.g., https://your-app.vercel.app)
   - Deploy!

3. **Post-Deployment**
   - [ ] Test all features on production
   - [ ] Verify QR codes work
   - [ ] Test from mobile devices
   - [ ] Check MongoDB connections

#### Option 2: Custom Server

1. **Build the Application**
   ```powershell
   npm run build
   ```

2. **Set Environment Variables**
   ```bash
   export MONGODB_URI="your-production-mongodb-uri"
   export NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
   ```

3. **Start Production Server**
   ```powershell
   npm start
   ```

4. **Set Up Reverse Proxy** (Nginx/Apache)
   - Configure HTTPS
   - Point domain to Next.js server (port 3000)

#### Option 3: Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Run**
   ```powershell
   docker build -t attendance-system .
   docker run -p 3000:3000 -e MONGODB_URI="..." -e NEXT_PUBLIC_SITE_URL="..." attendance-system
   ```

### Post-Deployment Configuration

- [ ] **MongoDB Security**
  - [ ] Enable authentication
  - [ ] Use strong passwords
  - [ ] Limit network access
  - [ ] Enable audit logging

- [ ] **Application Security**
  - [ ] Enable HTTPS
  - [ ] Set up CORS if needed
  - [ ] Add rate limiting (optional)
  - [ ] Set up monitoring

- [ ] **Backups**
  - [ ] Configure MongoDB automated backups
  - [ ] Backup `public/exports/` directory
  - [ ] Set up automated export archiving

- [ ] **Monitoring**
  - [ ] Set up error tracking (e.g., Sentry)
  - [ ] Monitor database performance
  - [ ] Track API response times
  - [ ] Set up uptime monitoring

### Environment Variables Reference

```env
# Production .env.local or Vercel Environment Variables

# MongoDB Connection (Required)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance_system

# Site URL (Required)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Optional: Node Environment
NODE_ENV=production
```

### Testing Checklist

Before going live, test:

- [ ] Create a course session
- [ ] Generate QR code
- [ ] Scan QR code from mobile device
- [ ] Mark attendance
- [ ] Verify real-time updates work
- [ ] Test duplicate prevention
- [ ] Export to CSV
- [ ] Export to JSON and end session
- [ ] Verify exports are saved
- [ ] Test on different browsers
- [ ] Test on mobile devices
- [ ] Test with slow network

### Performance Optimization

- [ ] Enable Next.js Image Optimization
- [ ] Configure CDN for static assets
- [ ] Enable MongoDB connection pooling
- [ ] Add database indexes:
  ```javascript
  db.courses.createIndex({ sessionId: 1 })
  db.courses.createIndex({ active: 1 })
  db.attendance_records.createIndex({ sessionId: 1 })
  db.attendance_records.createIndex({ ipAddress: 1, userAgent: 1 })
  ```
- [ ] Enable gzip compression
- [ ] Set cache headers

### Support and Maintenance

- [ ] Document admin procedures
- [ ] Set up backup and restore process
- [ ] Create runbook for common issues
- [ ] Schedule regular database maintenance
- [ ] Plan for scaling if needed

### Future Enhancements (Optional)

- [ ] Add user authentication for instructors
- [ ] Implement role-based access control
- [ ] Add email notifications
- [ ] Create analytics dashboard
- [ ] Add multi-language support
- [ ] Implement attendance reports
- [ ] Add bulk operations
- [ ] Create mobile app
- [ ] Add face recognition (advanced)
- [ ] Integrate with LMS (e.g., Canvas, Moodle)

## Quick Reference

### Important URLs

- **Dashboard**: `https://yourdomain.com`
- **Attendance**: `https://yourdomain.com/attend?sessionId=XXX`
- **API Base**: `https://yourdomain.com/api`

### API Endpoints

- `POST /api/course` - Create session
- `GET /api/course?sessionId=XXX` - Get course data
- `POST /api/attend` - Mark attendance
- `GET /api/attend?sessionId=XXX` - Get course info
- `POST /api/export` - Export and end session

### Support Contacts

- MongoDB Atlas: https://cloud.mongodb.com
- Vercel Support: https://vercel.com/support
- Next.js Docs: https://nextjs.org/docs

## Current Status: Ready for Local Development ✅

Your system is fully functional locally. Follow the production checklist when ready to deploy!
