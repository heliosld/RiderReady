import { db } from './db/connection';
import fs from 'fs';
import path from 'path';

async function setupVendorPortal() {
  console.log('🚀 Setting up vendor portal tables...\n');

  try {
    // Check which tables already exist
    const existingTables = await db.any(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'vendor_claims', 'vendor_inventory', 'user_favorites', 'user_endorsement_votes')
    `);
    
    const existing = existingTables.map((t: any) => t.table_name);
    console.log('Existing tables:', existing.length > 0 ? existing.join(', ') : 'none');
    console.log();

    // Create users table if needed
    if (!existing.includes('users')) {
      console.log('Creating users table...');
      await db.none(`
        CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          session_id VARCHAR(255) UNIQUE,
          is_guest BOOLEAN DEFAULT true,
          username VARCHAR(255),
          email VARCHAR(255),
          email_verified BOOLEAN DEFAULT false,
          full_name VARCHAR(255),
          company VARCHAR(255),
          role VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX idx_users_session ON users(session_id);
        CREATE INDEX idx_users_email ON users(email);
      `);
      console.log('✅ users table created');
    }

    // Create vendor_claims table if needed
    if (!existing.includes('vendor_claims')) {
      console.log('Creating vendor_claims table...');
      await db.none(`
        CREATE TABLE vendor_claims (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          status VARCHAR(20) DEFAULT 'pending',
          verification_method VARCHAR(50),
          verification_notes TEXT,
          contact_email VARCHAR(255),
          contact_phone VARCHAR(50),
          approved_by_user_id UUID REFERENCES users(id),
          approved_at TIMESTAMP,
          rejected_reason TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(vendor_id, user_id)
        );
        CREATE INDEX idx_vendor_claims_vendor ON vendor_claims(vendor_id);
        CREATE INDEX idx_vendor_claims_user ON vendor_claims(user_id);
        CREATE INDEX idx_vendor_claims_status ON vendor_claims(status);
      `);
      console.log('✅ vendor_claims table created');
    }

    // vendor_inventory already exists, skip

    // Create user_favorites table if needed
    if (!existing.includes('user_favorites')) {
      console.log('Creating user_favorites table...');
      await db.none(`
        CREATE TABLE user_favorites (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          fixture_id UUID REFERENCES fixtures(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, fixture_id)
        );
        CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
        CREATE INDEX idx_user_favorites_fixture ON user_favorites(fixture_id);
      `);
      console.log('✅ user_favorites table created');
    }

    // Create user_endorsement_votes table if needed
    if (!existing.includes('user_endorsement_votes')) {
      console.log('Creating user_endorsement_votes table...');
      await db.none(`
        CREATE TABLE user_endorsement_votes (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          fixture_id UUID REFERENCES fixtures(id) ON DELETE CASCADE,
          category_id UUID REFERENCES fixture_endorsement_categories(id) ON DELETE CASCADE,
          vote_type VARCHAR(10) CHECK (vote_type IN ('upvote', 'downvote')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, fixture_id, category_id)
        );
        CREATE INDEX idx_user_votes_user ON user_endorsement_votes(user_id);
        CREATE INDEX idx_user_votes_fixture ON user_endorsement_votes(fixture_id);
        CREATE INDEX idx_user_votes_category ON user_endorsement_votes(category_id);
      `);
      console.log('✅ user_endorsement_votes table created');
    }

    // Create triggers
    console.log('\nCreating/updating triggers...');
    await db.none(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Drop and recreate triggers to avoid "already exists" errors
    await db.none(`DROP TRIGGER IF EXISTS update_users_updated_at ON users`);
    await db.none(`DROP TRIGGER IF EXISTS update_vendor_claims_updated_at ON vendor_claims`);
    await db.none(`DROP TRIGGER IF EXISTS update_vendor_inventory_updated_at ON vendor_inventory`);
    await db.none(`DROP TRIGGER IF EXISTS update_user_votes_updated_at ON user_endorsement_votes`);

    if (!existing.includes('users')) {
      await db.none(`CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`);
    }
    if (!existing.includes('vendor_claims')) {
      await db.none(`CREATE TRIGGER update_vendor_claims_updated_at BEFORE UPDATE ON vendor_claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`);
    }
    if (!existing.includes('vendor_inventory')) {
      await db.none(`CREATE TRIGGER update_vendor_inventory_updated_at BEFORE UPDATE ON vendor_inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`);
    }
    if (!existing.includes('user_endorsement_votes')) {
      await db.none(`CREATE TRIGGER update_user_votes_updated_at BEFORE UPDATE ON user_endorsement_votes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`);
    }

    console.log('\n✅ Vendor portal setup complete!\n');
    
  } catch (error) {
    console.error('❌ Error setting up vendor portal:', error);
    throw error;
  }
}

setupVendorPortal();
