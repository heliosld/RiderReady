# RiderReady Setup Instructions

## ✅ What's Already Done
- Backend dependencies installed
- Frontend dependencies installed
- Environment files created (.env and .env.local)
- PostgreSQL found at: C:\Program Files\PostgreSQL\17\bin

## 📋 Next Steps

### 1. Add PostgreSQL to Your PATH (Current Session)

In your PowerShell terminal, run:
```powershell
$env:Path += ";C:\Program Files\PostgreSQL\17\bin"
```

### 2. Set Up the Database

**Option A: Using psql directly (Recommended)**

Run these commands one at a time. You'll be prompted for your PostgreSQL password each time:

```powershell
# Create the database
psql -U postgres -c "CREATE DATABASE riderready_dev;"

# Run the schema
psql -U postgres -d riderready_dev -f database\schema.sql

# Verify it worked
psql -U postgres -d riderready_dev -c "\dt"
```

**Option B: Using pgAdmin (GUI)**
1. Open pgAdmin
2. Connect to PostgreSQL
3. Right-click Databases → Create → Database
4. Name it: `riderready_dev`
5. Right-click `riderready_dev` → Query Tool
6. Open file: `X:\RiderReady\database\schema.sql`
7. Click Execute (F5)

### 3. Configure Database Password

Edit `backend\.env` and update this line with your PostgreSQL password:
```
DATABASE_PASSWORD=your_password_here
```

You can edit it with:
```powershell
notepad backend\.env
```

### 4. Start the Development Servers

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend (new PowerShell window):**
```powershell
cd frontend
npm run dev
```

### 5. Open Your Browser

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Health Check: http://localhost:3001/health

## 🔧 Troubleshooting

### "psql: error: password authentication failed"
- Make sure you're using the correct password you set during PostgreSQL installation
- Try connecting with pgAdmin first to verify credentials

### "database already exists"
- That's fine! Just continue to the next step (run schema)

### Port already in use
- Check if another app is using port 3000 or 3001
- You can change ports in the .env files

### Can't connect to database from backend
- Verify PostgreSQL is running (check Services in Windows)
- Make sure DATABASE_PASSWORD in backend\.env matches your PostgreSQL password
- Check that database name is `riderready_dev`

## 📚 What's Been Set Up

### Backend (`X:\RiderReady\backend`)
- Express.js API with TypeScript
- Database connection configured
- Routes for fixtures, vendors, manufacturers, search
- Environment: `.env` (edit DATABASE_PASSWORD)

### Frontend (`X:\RiderReady\frontend`)
- Next.js 14 with React
- Tailwind CSS
- React Query for data fetching
- Environment: `.env.local` (already configured)

### Database (`X:\RiderReady\database`)
- Complete schema with sample data
- Tables: fixtures, manufacturers, vendors, features, etc.
- Relationships and indexes set up

## 🎯 After Setup

Once everything is running:
1. Visit http://localhost:3000
2. Click "Browse Fixtures" or "Find Vendors"
3. The lists will be empty initially - that's expected!
4. You can add sample fixtures through SQL or build an admin interface

## 💾 Permanently Add PostgreSQL to PATH

To avoid having to run the PATH command each time:

1. Press Win + X, select "System"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System variables", find "Path"
5. Click "Edit"
6. Click "New"
7. Add: `C:\Program Files\PostgreSQL\17\bin`
8. Click OK on all dialogs
9. Restart PowerShell

---

**Need help?** Check the detailed documentation in `docs\getting-started.md`
