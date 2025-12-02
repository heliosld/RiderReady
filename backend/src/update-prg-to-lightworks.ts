import { db } from './db/connection';

(async () => {
  try {
    console.log('Updating PRG to mock company "LightWorks Productions"...\n');
    
    const updated = await db.one(`
      UPDATE vendors
      SET
        name = $1,
        slug = $2,
        description = $3,
        about = $4,
        services = $5,
        specialties = $6,
        certifications = $7,
        years_in_business = $8,
        team_size = $9,
        response_time = $10,
        service_area = $11,
        established_year = $12,
        website = $13,
        email = $14,
        phone = $15,
        hours_of_operation = $16,
        social_media = $17,
        updated_at = CURRENT_TIMESTAMP
      WHERE slug = 'prg'
      RETURNING name, slug
    `, [
      'LightWorks Productions',
      'lightworks-productions',
      'Premier lighting and production equipment provider specializing in concerts, festivals, and live events across North America.',
      'LightWorks Productions has been a trusted name in entertainment technology for over 15 years. Founded by lighting professionals with a passion for innovation, we\'ve grown from a small regional rental house to a comprehensive production services company. Our team combines technical expertise with creative vision to help bring your events to life.\n\nWe pride ourselves on maintaining the latest equipment, providing exceptional customer service, and building long-term relationships with our clients. Whether you\'re planning an intimate theater production or a multi-city concert tour, we have the gear and expertise to make it happen.',
      [
        'Equipment Rental',
        'Equipment Sales',
        'Technical Support',
        'Design & Consultation',
        'Tour Support',
        'Training'
      ],
      [
        'Concerts & Festivals',
        'Theater & Performing Arts',
        'Corporate Events',
        'Houses of Worship',
        'Nightclubs & Venues'
      ],
      JSON.stringify([
        {
          name: 'ETCP Certified Technicians',
          issuer: 'ESTA (Entertainment Services and Technology Association)',
          year: 2018,
          description: 'Multiple staff members hold ETCP Entertainment Electrician certifications'
        },
        {
          name: 'Insured & Bonded',
          issuer: 'Professional Liability Insurance',
          year: 2024,
          description: '$5M general liability coverage for all equipment and services'
        }
      ]),
      15, // years in business
      '11-50 employees',
      'Within 2-4 hours',
      'North America (US & Canada)',
      2009, // established year
      'https://lightworksproductions.example.com',
      'info@lightworksproductions.example.com',
      '+1 (555) 123-4567',
      JSON.stringify({
        monday: '9:00 AM - 6:00 PM',
        tuesday: '9:00 AM - 6:00 PM',
        wednesday: '9:00 AM - 6:00 PM',
        thursday: '9:00 AM - 6:00 PM',
        friday: '9:00 AM - 6:00 PM',
        saturday: '10:00 AM - 4:00 PM',
        sunday: 'Closed',
        notes: 'Emergency support available 24/7 for active rentals'
      }),
      JSON.stringify({
        website: 'https://lightworksproductions.example.com',
        facebook: 'https://facebook.com/lightworksproductions',
        instagram: '@lightworks_productions',
        linkedin: 'https://linkedin.com/company/lightworks-productions'
      })
    ]);
    
    console.log(`✅ Successfully updated vendor: ${updated.name} (${updated.slug})`);
    console.log('\n📝 Also updating vendor locations...\n');
    
    // Update vendor_id in vendor_locations table
    await db.none(`
      UPDATE vendor_locations
      SET location_name = CASE location_name
        WHEN 'PRG New York' THEN 'LightWorks - New York'
        WHEN 'PRG Los Angeles' THEN 'LightWorks - Los Angeles'
        WHEN 'PRG Nashville' THEN 'LightWorks - Nashville'
        WHEN 'PRG Las Vegas' THEN 'LightWorks - Las Vegas'
        WHEN 'PRG Orlando' THEN 'LightWorks - Orlando'
        WHEN 'PRG Dallas' THEN 'LightWorks - Dallas'
        WHEN 'PRG Chicago' THEN 'LightWorks - Chicago'
        ELSE location_name
      END
      WHERE vendor_id = (SELECT id FROM vendors WHERE slug = 'lightworks-productions')
    `);
    
    console.log('✅ Updated vendor locations');
    
    // Update vendor_inventory if exists
    const inventoryCount = await db.oneOrNone(`
      SELECT COUNT(*) as count
      FROM vendor_inventory
      WHERE vendor_id = (SELECT id FROM vendors WHERE slug = 'lightworks-productions')
    `);
    
    if (inventoryCount && parseInt(inventoryCount.count) > 0) {
      console.log(`✅ Found ${inventoryCount.count} inventory items (no changes needed)`);
    }
    
    console.log('\n🎉 All updates complete!\n');
    console.log('New vendor details:');
    console.log('  Name: LightWorks Productions');
    console.log('  Slug: lightworks-productions');
    console.log('  URL: http://localhost:3002/vendors/lightworks-productions');
    console.log('  Dashboard: http://localhost:3002/dashboard/vendor');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
