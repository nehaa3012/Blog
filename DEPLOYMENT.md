# Blog Application Deployment Guide

## Prerequisites

- Node.js installed
- MongoDB database (MongoDB Atlas recommended for production)
- Redis instance (Upstash Redis recommended)
- SMTP credentials for email notifications

## Redis Setup with Upstash

### 1. Get Your Upstash Redis Credentials

You already have your Upstash Redis URL. It should look like:
```
rediss://default:xxxxx@your-instance.upstash.io:6379
```

### 2. Configure Environment Variables

#### For Local Development

Create a `.env` file in the `backend` directory:

```env
# For local development, use your Docker Redis
REDIS_URL=redis://localhost:6379

# Or use Upstash for local testing
# REDIS_URL=rediss://default:xxxxx@your-instance.upstash.io:6379

# Other variables...
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000
```

#### For Production Deployment

Set the following environment variables in your deployment platform:

```env
REDIS_URL=rediss://default:Aa3HAAIncDJkOGUxYjU1Y2MwZWU0NTY0ODk3MTkxYTc4OTg5OTExZXAyNDQ0ODc@quiet-mosquito-44487.upstash.io:6379
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
PORT=8000
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## Deployment Platforms

### Option 1: Render

1. **Create New Web Service**
   - Connect your GitHub repository
   - Select the `backend` directory as root
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Set Environment Variables**
   - Go to Environment tab
   - Add all variables from the production list above

3. **Deploy**
   - Render will automatically deploy your app
   - Worker will start automatically with the server

### Option 2: Railway

1. **Create New Project**
   - Connect your GitHub repository
   - Railway will auto-detect Node.js

2. **Configure**
   - Set root directory to `backend` if needed
   - Add environment variables in the Variables tab

3. **Deploy**
   - Railway will automatically build and deploy

### Option 3: Vercel (Serverless)

**Note:** Vercel is serverless and may not be ideal for BullMQ workers that need to run continuously. Consider Render or Railway for better worker support.

If you still want to use Vercel:

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Create `vercel.json` in backend directory**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "index.js"
       }
     ]
   }
   ```

3. **Deploy**
   ```bash
   cd backend
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add REDIS_URL
   # Add other variables...
   ```

**Important:** For Vercel, you may need to deploy the worker separately or use a different approach since serverless functions don't support long-running processes.

## Testing Your Deployment

### 1. Check Logs

Look for these messages in your deployment logs:
```
Worker starting...
SMTP_HOST: smtp.gmail.com
SMTP_USER: your_email@gmail.com
Post worker is now running and listening for jobs...
Server is running on port 8000
Redis connected
MongoDB connected
```

### 2. Test Post Creation

Create a new post through your API and verify:
- Post is created successfully
- Email notification is sent
- No Redis connection errors in logs

### 3. Monitor Redis

- Log into Upstash dashboard
- Check the "Metrics" tab to see connection activity
- Verify commands are being executed

## Troubleshooting

### Redis Connection Issues

**Error:** `ECONNREFUSED` or `Connection timeout`
- **Solution:** Verify your `REDIS_URL` is correct and includes `rediss://` (with double 's' for SSL)

**Error:** `Authentication failed`
- **Solution:** Check that your Upstash password in the URL is correct

### Worker Not Running

**Issue:** Jobs not being processed
- **Solution:** Check deployment logs to ensure "Post worker is now running..." message appears
- For Vercel: Consider using Render or Railway instead for better worker support

### SMTP Errors

**Error:** `Invalid login`
- **Solution:** Use an App Password for Gmail, not your regular password
- Enable 2FA and generate an App Password at https://myaccount.google.com/apppasswords

## Local Development vs Production

The code now automatically detects the environment:

- **Local:** Uses `redis://localhost:6379` (your Docker Redis) if `REDIS_URL` is not set
- **Production:** Uses `REDIS_URL` environment variable (Upstash)

This means you can:
1. Keep using Docker Redis locally without any `.env` changes
2. Deploy to production with Upstash by just setting the `REDIS_URL` environment variable

## Next Steps

1. Choose your deployment platform (Render recommended for workers)
2. Set up environment variables in the platform
3. Deploy your application
4. Test post creation and email notifications
5. Monitor logs and Redis metrics

## Support

If you encounter issues:
1. Check deployment logs for error messages
2. Verify all environment variables are set correctly
3. Test Redis connection using Upstash CLI or dashboard
4. Ensure MongoDB and SMTP credentials are valid
