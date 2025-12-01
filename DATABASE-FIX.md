# Database Setup Fix

## Problem
The backend is showing errors like:
- `error: password authentication failed for user "postgres"`
- `error: relation "vendor_locations" does not exist`

## Solution

### Step 1: Update PostgreSQL Password

Your PostgreSQL password needs to match what's in the `.env` file.

**Option A: Change the .env file to match your password**
1. Open `backend\.env`
2. Find the line: `DATABASE_PASSWORD=mypassword123`
3. Change `mypassword123` to your actual PostgreSQL postgres user password
4. Save the file

**Option B: Change your PostgreSQL password to match the .env**
1. Open PowerShell
2. Run: `psql -U postgres`
3. Enter your current password
4. Run: `ALTER USER postgres PASSWORD 'mypassword123';`
5. Type `\q` to quit

### Step 2: Reset the Database

Run the reset script to recreate everything from scratch:

```powershell
.\reset-database.ps1
```

This will:
- Drop the existing database
- Create a fresh database
- Create all tables (including vendor_locations)
- Insert 20+ vendor locations with GPS coordinates

### Step 3: Restart Backend

```powershell
cd backend
npm run dev
```

### Step 4: Test

Navigate to http://localhost:3002/vendors and click the "Map" button. You should see 20+ vendor locations on an interactive map.

## Verification

You can verify the database is set up correctly:

```powershell
psql -U postgres -d riderready_dev -c "SELECT COUNT(*) FROM vendor_locations;"
```

You should see around 20 locations.

## Still Having Issues?

If you're still seeing errors:
1. Check that PostgreSQL is running: `Get-Service postgresql*`
2. Check the backend .env file password matches your PostgreSQL password
3. Look at the terminal output for specific error messages
