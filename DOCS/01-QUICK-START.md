# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18+ installed
- ✅ MongoDB installed (or access to MongoDB Atlas)

## Step 1: Start MongoDB

### Option A: Local MongoDB (Windows)
```powershell
# If MongoDB is installed as a service
net start MongoDB

# Check if it's running
mongod --version
```

### Option B: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update `.env.local` with your connection string

## Step 2: Configure Environment

The `.env.local` file is already created. Update if needed:

```env
MONGODB_URI=mongodb://localhost:27017
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 3: Install Dependencies

```powershell
npm install
```

## Step 4: Start Development Server

```powershell
npm run dev
```

## Step 5: Access the Application

Open your browser and navigate to:
- **Dashboard (Instructor)**: http://localhost:3000
- **Attendance Page (Student)**: http://localhost:3000/attend?sessionId=XXX

## Step 6: Test the System

### Create a Session

1. Go to http://localhost:3000
2. Fill in the form:
   - **Course Name**: Test Course
   - **Course ID**: TEST101
   - **Semester**: Fall 2025
   - **Section**: A
   - **Student List**: 
     ```
     S001,John Doe
     S002,Jane Smith
     S003,Bob Johnson
     ```
3. Click "Start Attendance Session"

### Mark Attendance

1. You'll see a QR code generated
2. Copy the URL from below the QR code
3. Open it in a new browser window or incognito mode
4. Enter student ID (e.g., `S001`)
5. Click "Mark Attendance"
6. Return to dashboard to see the update

### Export Data

1. Click "Export & End Session"
2. A JSON file will download
3. The session will be cleared from MongoDB

## Common Issues

### MongoDB Connection Error
- **Error**: "MongoServerError: connect ECONNREFUSED"
- **Solution**: Make sure MongoDB is running (`net start MongoDB`)

### Port Already in Use
- **Error**: "Port 3000 is already in use"
- **Solution**: 
  ```powershell
  # Kill the process using port 3000
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

### QR Code Not Displaying
- **Solution**: Clear browser cache and refresh

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [SAMPLE_DATA.md](SAMPLE_DATA.md) for test data
- Customize the UI in `app/page.tsx` and `app/attend/page.tsx`
- Add authentication if needed
- Deploy to production (Vercel recommended)

## Production Deployment Checklist

- [ ] Update `MONGODB_URI` to production database
- [ ] Update `NEXT_PUBLIC_SITE_URL` to production URL (with HTTPS)
- [ ] Set up MongoDB Atlas for cloud database
- [ ] Enable MongoDB authentication
- [ ] Set up automatic backups
- [ ] Configure CORS if needed
- [ ] Add rate limiting for API routes
- [ ] Set up monitoring/logging

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify MongoDB is running
3. Check environment variables
4. Review the troubleshooting section in README.md
