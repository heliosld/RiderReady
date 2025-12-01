# RiderReady - Getting Started Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18+ (Download from nodejs.org)
- **PostgreSQL** 14+ (Download from postgresql.org)
- **npm** or **pnpm** (comes with Node.js)
- **Git** (for version control)

## Initial Setup

### 1. Database Setup

#### Install PostgreSQL
1. Download and install PostgreSQL from https://www.postgresql.org/download/
2. During installation, remember your postgres user password
3. Default port is usually 5432

#### Create Database
Open PowerShell or Command Prompt and run:

```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE riderready_dev;

# Exit psql
\q
```

#### Run Schema
```powershell
cd x:\RiderReady\database
psql -U postgres -d riderready_dev -f schema.sql
```

### 2. Backend Setup

```powershell
cd x:\RiderReady\backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your database credentials
# Update DATABASE_PASSWORD with your postgres password
notepad .env

# Start development server
npm run dev
```

The backend should now be running on http://localhost:3001

### 3. Frontend Setup

Open a new PowerShell window:

```powershell
cd x:\RiderReady\frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

The frontend should now be running on http://localhost:3000

## Testing the Setup

1. Open http://localhost:3000 in your browser
2. You should see the RiderReady homepage
3. Try navigating to "Browse Fixtures" - it should load (empty) but without errors
4. Check the browser console for any errors

## API Testing

You can test the backend API directly:

```powershell
# Health check
curl http://localhost:3001/health

# Get manufacturers (should return sample data)
curl http://localhost:3001/api/v1/manufacturers

# Get fixtures (will be empty initially)
curl http://localhost:3001/api/v1/fixtures
```

## Adding Sample Data

The schema includes some sample manufacturers and categories. To add fixture data, you'll need to either:

1. **Manual Entry**: Create an admin interface (future feature)
2. **SQL Inserts**: Write INSERT statements for fixtures
3. **Seed Script**: Create a seed.ts file with sample data

### Quick Sample Fixture (SQL)

```sql
-- First, get manufacturer and type IDs
SELECT id, name FROM manufacturers;
SELECT id, name FROM fixture_types;

-- Insert a sample fixture (adjust IDs as needed)
INSERT INTO fixtures (
  manufacturer_id,
  fixture_type_id,
  name,
  slug,
  description,
  weight_kg,
  power_consumption_watts,
  light_source_type
) VALUES (
  'manufacturer-id-here',
  'fixture-type-id-here',
  'Sample Moving Head',
  'sample-moving-head',
  'A sample automated lighting fixture',
  25.0,
  500,
  'LED'
);
```

## Common Issues

### Database Connection Error
- Verify PostgreSQL is running: `psql -U postgres -c "SELECT version();"`
- Check .env DATABASE_* variables match your setup
- Ensure DATABASE_PASSWORD is correct

### Port Already in Use
- Backend (3001): Change PORT in backend/.env
- Frontend (3000): Next.js will prompt to use 3001 automatically

### Module Not Found Errors
- Delete node_modules folder and package-lock.json
- Run `npm install` again

## Development Workflow

### Making Changes

1. **Backend Changes**:
   - Edit files in `backend/src/`
   - Server auto-restarts with nodemon
   - Check terminal for errors

2. **Frontend Changes**:
   - Edit files in `frontend/src/`
   - Browser auto-refreshes
   - Check browser console for errors

3. **Database Changes**:
   - Add migration files in `database/`
   - Run migration: `psql -U postgres -d riderready_dev -f migration.sql`

### Git Workflow

```powershell
# Check status
git status

# Add changes
git add .

# Commit with message
git commit -m "Description of changes"

# Push to remote (when you set up GitHub)
git push origin main
```

## Next Steps

1. **Populate Database**: Add real fixture data
2. **Build Features**: Start with fixture detail pages
3. **Add Filtering**: Implement advanced search filters
4. **Deploy**: Set up hosting for production

## Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Express.js Guide**: https://expressjs.com/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs

## Getting Help

- Check the docs/ folder for more documentation
- Review error messages carefully
- Search Stack Overflow for common issues
- The development plan is in `docs/development-plan.md`

---

**Happy Coding! 🚀**
