import { db } from './db/connection';

(async () => {
  try {
    // First, standardize location names with hyphens
    const locationUpdates = [
      { old: 'LightWorks Hamburg', new: 'LightWorks - Hamburg' },
      { old: 'LightWorks London', new: 'LightWorks - London' },
      { old: 'LightWorks Singapore', new: 'LightWorks - Singapore' }
    ];

    console.log('Standardizing location names with hyphens...\n');
    
    for (const update of locationUpdates) {
      await db.none(`
        UPDATE vendor_locations
        SET location_name = $1
        WHERE vendor_id = (SELECT id FROM vendors WHERE slug = 'lightworks-productions')
          AND location_name = $2
      `, [update.new, update.old]);
      console.log(`✅ Updated: ${update.old} → ${update.new}`);
    }

    // Now add mock data for each location
    console.log('\n\nAdding mock data to locations...\n');

    const locationMockData = [
      {
        name: 'LightWorks - Las Vegas',
        phone: '+1 (702) 555-0100',
        email: 'vegas@lightworksproductions.com',
        address: '3900 Paradise Rd',
        city: 'Las Vegas',
        state: 'NV',
        postal: '89169',
        country: 'United States',
        contact_person: 'Marcus Chen',
        contact_title: 'Regional Manager'
      },
      {
        name: 'LightWorks - Los Angeles',
        phone: '+1 (310) 555-0200',
        email: 'la@lightworksproductions.com',
        address: '9336 Washington Blvd',
        city: 'Culver City',
        state: 'CA',
        postal: '90232',
        country: 'United States',
        contact_person: 'Sarah Martinez',
        contact_title: 'West Coast Director'
      },
      {
        name: 'LightWorks - Nashville',
        phone: '+1 (615) 555-0300',
        email: 'nashville@lightworksproductions.com',
        address: '1201 Demonbreun St',
        city: 'Nashville',
        state: 'TN',
        postal: '37203',
        country: 'United States',
        contact_person: 'Jake Morrison',
        contact_title: 'Regional Manager'
      },
      {
        name: 'LightWorks - New York',
        phone: '+1 (212) 555-0400',
        email: 'nyc@lightworksproductions.com',
        address: '450 W 31st St',
        city: 'New York',
        state: 'NY',
        postal: '10001',
        country: 'United States',
        contact_person: 'Diana Foster',
        contact_title: 'East Coast Director'
      },
      {
        name: 'LightWorks - Hamburg',
        phone: '+49 40 555-0500',
        email: 'hamburg@lightworksproductions.com',
        address: 'Große Elbstraße 277',
        city: 'Hamburg',
        state: 'Hamburg',
        postal: '22767',
        country: 'Germany',
        contact_person: 'Klaus Schneider',
        contact_title: 'European Operations Manager'
      },
      {
        name: 'LightWorks - London',
        phone: '+44 20 555-0600',
        email: 'london@lightworksproductions.com',
        address: '25 Dock St',
        city: 'London',
        state: 'England',
        postal: 'E1 8JP',
        country: 'United Kingdom',
        contact_person: 'Emma Thompson',
        contact_title: 'UK Director'
      },
      {
        name: 'LightWorks - Singapore',
        phone: '+65 6555-0700',
        email: 'singapore@lightworksproductions.com',
        address: '1 HarbourFront Walk',
        city: 'Singapore',
        state: 'Singapore',
        postal: '098585',
        country: 'Singapore',
        contact_person: 'Wei Lin Tan',
        contact_title: 'Asia Pacific Director'
      }
    ];

    for (const data of locationMockData) {
      await db.none(`
        UPDATE vendor_locations
        SET 
          phone = $1,
          email = $2,
          address_line1 = $3,
          city = $4,
          state_province = $5,
          postal_code = $6,
          country = $7,
          services = $8
        WHERE vendor_id = (SELECT id FROM vendors WHERE slug = 'lightworks-productions')
          AND location_name = $9
      `, [
        data.phone,
        data.email,
        data.address,
        data.city,
        data.state,
        data.postal,
        data.country,
        `${data.contact_person}, ${data.contact_title}`,
        data.name
      ]);
      console.log(`✅ Added mock data for: ${data.name}`);
      console.log(`   Contact: ${data.contact_person} (${data.contact_title})`);
      console.log(`   Phone: ${data.phone} | Email: ${data.email}\n`);
    }

    // Display final results
    console.log('\n' + '='.repeat(80));
    console.log('FINAL LOCATION DATA');
    console.log('='.repeat(80) + '\n');

    const finalLocations = await db.any(`
      SELECT location_name, city, state_province, country, phone, email, 
             services, address_line1, postal_code
      FROM vendor_locations 
      WHERE vendor_id = (SELECT id FROM vendors WHERE slug = 'lightworks-productions')
      ORDER BY location_name
    `);

    finalLocations.forEach((loc, idx) => {
      console.log(`${idx + 1}. ${loc.location_name}`);
      console.log(`   📍 ${loc.address_line1}, ${loc.city}, ${loc.state_province} ${loc.postal_code}, ${loc.country}`);
      console.log(`   👤 ${loc.services || 'No contact info'}`);
      console.log(`   📞 ${loc.phone}`);
      console.log(`   📧 ${loc.email}\n`);
    });

    console.log('✅ All locations updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
