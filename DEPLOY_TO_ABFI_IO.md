# Deploy ABFI Platform to abfi.io Domain

## Overview

This guide will help you deploy the ABFI platform to your custom domain **abfi.io** using Vercel.

---

## Prerequisites

✅ GitHub repository: https://github.com/steeldragon666/abfi-platform-1
✅ Code committed and pushed to main branch
✅ Build successful
✅ Custom domain: abfi.io (purchased from Manus)

---

## Deployment Options

### Option 1: Vercel Dashboard (Recommended for Custom Domain)

This is the easiest way to deploy and configure your custom domain.

#### Step 1: Import Project to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select **GitHub** as the provider
5. Search for `steeldragon666/abfi-platform-1`
6. Click **"Import"**

#### Step 2: Configure Build Settings

On the import screen, configure:

**Framework Preset**: Other
**Root Directory**: `./`
**Build Command**: `pnpm run build`
**Output Directory**: `dist/public`
**Install Command**: `pnpm install`

#### Step 3: Add Environment Variables

Click **"Environment Variables"** and add:

**Required:**
```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://abfi.io
OAUTH_SERVER_URL=https://abfi.io
```

**Database (Required):**
```
DATABASE_URL=mysql://user:password@host:3306/abfi_platform
```

**Optional (Add later if needed):**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

#### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (5-10 minutes)
3. You'll get a temporary URL like `abfi-platform-1.vercel.app`

#### Step 5: Add Custom Domain (abfi.io)

1. Once deployed, go to your project dashboard
2. Click **"Settings"** → **"Domains"**
3. Click **"Add Domain"**
4. Enter: `abfi.io`
5. Click **"Add"**

#### Step 6: Configure DNS

Vercel will show you DNS configuration instructions. Since you purchased abfi.io from Manus, you need to:

**Option A: Use Vercel Nameservers (Recommended)**
1. Vercel will provide nameservers like:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
2. Go to your Manus domain management
3. Update nameservers to Vercel's nameservers
4. Wait 24-48 hours for DNS propagation

**Option B: Use CNAME Record**
1. Vercel will provide a CNAME target like: `cname.vercel-dns.com`
2. Go to your Manus domain management
3. Add a CNAME record:
   - **Name**: `@` (or leave blank for root domain)
   - **Type**: CNAME
   - **Value**: `cname.vercel-dns.com`
4. Add another CNAME for www:
   - **Name**: `www`
   - **Type**: CNAME
   - **Value**: `cname.vercel-dns.com`
5. Wait 1-2 hours for DNS propagation

#### Step 7: Add www Subdomain (Optional)

1. In Vercel Domains settings
2. Click **"Add Domain"**
3. Enter: `www.abfi.io`
4. Vercel will automatically redirect www to root domain

#### Step 8: Enable SSL

Vercel automatically provisions SSL certificates for your domain. This happens automatically once DNS is configured.

---

### Option 2: Vercel CLI (Alternative)

If you prefer command line:

#### Step 1: Login to Vercel

```bash
vercel login
```

This will open a browser for authentication.

#### Step 2: Deploy to Production

```bash
cd /home/ubuntu/abfi-platform-1
vercel --prod
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No** (first time) or **Yes** (if already exists)
- Project name? **abfi-platform**
- Directory? **./`
- Override settings? **No**

#### Step 3: Add Custom Domain via CLI

```bash
vercel domains add abfi.io
```

Then follow DNS configuration steps from Option 1, Step 6.

---

### Option 3: Automatic GitHub Deployment

If you've already connected the repository to Vercel:

1. Any push to `main` branch will automatically deploy
2. Go to Vercel dashboard to add custom domain
3. Follow Option 1, Steps 5-8

---

## Database Setup

You need a production database before deployment. Choose one:

### Option A: PlanetScale (Recommended)

1. Go to https://planetscale.com
2. Create account
3. Create new database: `abfi-platform`
4. Get connection string
5. Add to Vercel environment variables as `DATABASE_URL`

### Option B: Supabase

1. Go to https://supabase.com
2. Create project
3. Go to Settings → Database
4. Copy connection string (use "Connection pooling" for Vercel)
5. Add to Vercel environment variables as `DATABASE_URL`

### Option C: Railway

1. Go to https://railway.app
2. Create project
3. Add MySQL service
4. Copy connection string
5. Add to Vercel environment variables as `DATABASE_URL`

---

## Run Database Migrations

After database is set up:

### Option 1: Locally (Recommended)

```bash
# Set DATABASE_URL in .env
echo "DATABASE_URL=your-connection-string" >> .env

# Run migrations
pnpm run db:push
```

### Option 2: Via Vercel CLI

```bash
vercel env pull .env.local
pnpm run db:push
```

---

## Post-Deployment Checklist

After deployment completes:

### 1. Verify Deployment
- [ ] Visit https://abfi.io
- [ ] Check homepage loads
- [ ] Verify design assets (icons, illustrations) are visible
- [ ] Test authentication (register/login)
- [ ] Check all 4 dashboards load correctly

### 2. Test Core Features
- [ ] Grower dashboard and property registration
- [ ] Developer dashboard and marketplace
- [ ] Financier dashboard and bankability assessment
- [ ] Admin dashboard and verification workflows

### 3. Configure External Services (Optional)
- [ ] Google Maps API key
- [ ] IPFS integration
- [ ] Blockchain integration
- [ ] Email service for notifications

### 4. Security
- [ ] SSL certificate is active (https://)
- [ ] Environment variables are secure
- [ ] Database credentials are not exposed
- [ ] CORS is properly configured

### 5. Performance
- [ ] Check page load times
- [ ] Verify images are optimized
- [ ] Test on mobile devices
- [ ] Check Lighthouse scores

### 6. Monitoring
- [ ] Enable Vercel Analytics
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure uptime monitoring
- [ ] Set up log aggregation

---

## Troubleshooting

### Issue: Domain not resolving

**Solution**: 
- Wait 24-48 hours for DNS propagation
- Check DNS configuration with: `dig abfi.io`
- Verify nameservers are correct

### Issue: SSL certificate not provisioning

**Solution**:
- Wait 24 hours after DNS is configured
- Ensure DNS is properly configured
- Contact Vercel support if issue persists

### Issue: Build fails on Vercel

**Solution**:
- Check build logs in Vercel dashboard
- Verify all dependencies are in package.json
- Ensure TypeScript compiles locally: `pnpm run check`
- Check environment variables are set

### Issue: Database connection fails

**Solution**:
- Verify DATABASE_URL is correct
- Check database is accessible from Vercel's IP ranges
- Ensure connection pooling is enabled
- Test connection locally first

### Issue: Assets (icons/illustrations) not loading

**Solution**:
- Verify files are in `/client/public/assets/`
- Check files are committed to git
- Ensure output directory is `dist/public`
- Clear Vercel cache and redeploy

---

## Vercel Project Settings

### Recommended Settings

**General:**
- Framework: Other
- Node.js Version: 18.x or higher
- Build Command: `pnpm run build`
- Output Directory: `dist/public`
- Install Command: `pnpm install`

**Functions:**
- Function Region: Auto (or closest to your users)
- Function Memory: 1024 MB
- Function Timeout: 10s

**Environment Variables:**
- Set all required variables for Production
- Optionally set different values for Preview/Development

---

## Custom Domain Configuration Summary

### DNS Records Needed

**If using Vercel Nameservers:**
- Update nameservers at Manus domain management to Vercel's nameservers

**If using CNAME:**
- `@` (root) → `cname.vercel-dns.com`
- `www` → `cname.vercel-dns.com`

### Domain Settings in Vercel

1. **Primary Domain**: `abfi.io`
2. **Redirect www**: `www.abfi.io` → `abfi.io`
3. **SSL**: Automatic (Let's Encrypt)
4. **HTTPS**: Enforce (redirect HTTP to HTTPS)

---

## Accessing Your Deployed Platform

Once deployment is complete and DNS is configured:

**Production URL**: https://abfi.io
**Temporary Vercel URL**: https://abfi-platform-1.vercel.app (also works)

### User Access

**Growers**: https://abfi.io → Register → Select "Grower" role
**Developers**: https://abfi.io → Register → Select "Developer" role
**Financiers**: https://abfi.io → Register → Select "Financier" role
**Admins**: Contact admin to create admin account

---

## Continuous Deployment

The platform is configured for continuous deployment:

1. Make changes to code
2. Commit and push to `main` branch
3. Vercel automatically detects changes
4. Builds and deploys new version
5. Live at https://abfi.io within minutes

### Rollback

If a deployment has issues:
1. Go to Vercel dashboard
2. Navigate to "Deployments"
3. Find previous working deployment
4. Click "Promote to Production"

---

## Support

### Vercel Support
- Documentation: https://vercel.com/docs
- Support: https://vercel.com/support

### Manus Domain Support
- For domain management issues: https://help.manus.im

### ABFI Platform Issues
- Check deployment logs in Vercel dashboard
- Review error messages
- Test locally first: `pnpm run build && pnpm run start`

---

## Quick Deployment Command

For fastest deployment via CLI:

```bash
# Login to Vercel
vercel login

# Deploy to production
cd /home/ubuntu/abfi-platform-1
vercel --prod

# Add custom domain
vercel domains add abfi.io

# Follow DNS configuration instructions
```

---

## Summary

1. ✅ **Import project** to Vercel from GitHub
2. ✅ **Configure build** settings (pnpm, dist/public)
3. ✅ **Add environment** variables (DATABASE_URL, etc.)
4. ✅ **Deploy** to production
5. ✅ **Add domain** abfi.io in Vercel settings
6. ✅ **Configure DNS** at Manus domain management
7. ✅ **Wait for SSL** certificate (automatic)
8. ✅ **Test deployment** at https://abfi.io
9. ✅ **Set up database** and run migrations
10. ✅ **Monitor** and optimize

**Your ABFI platform will be live at https://abfi.io!** 🚀

---

**Last Updated**: December 27, 2025
**Deployment Status**: Ready
**Repository**: https://github.com/steeldragon666/abfi-platform-1
