import { db } from './db/connection';

(async () => {
  try {
    console.log('Adding sample profile data to PRG vendor...\n');
    
    const updated = await db.one(`
      UPDATE vendors
      SET
        about = $1,
        services = $2,
        specialties = $3,
        certifications = $4,
        years_in_business = $5,
        team_size = $6,
        response_time = $7,
        service_area = $8,
        hours_of_operation = $9,
        social_media = $10
      WHERE slug = 'prg'
      RETURNING name, slug
    `, [
      'PRG (Production Resource Group) is the world\'s leading entertainment and event technology solutions company. With over four decades of experience, we provide comprehensive services including equipment rental, sales, installation, and technical support for concerts, corporate events, theater productions, and broadcast applications worldwide.',
      [
        'Equipment Rental',
        'Equipment Sales',
        'Installation',
        'Design & Consultation',
        'Technical Support',
        '24/7 Emergency Service',
        'Tour Support',
        'Event Production'
      ],
      [
        'Concerts & Festivals',
        'Theater & Performing Arts',
        'Corporate Events',
        'Broadcast & Film',
        'Tour Support'
      ],
      JSON.stringify([
        {
          name: 'ETCP Certified',
          issuer: 'ESTA (Entertainment Services and Technology Association)',
          year: 2015,
          description: 'Entertainment Technician Certification Program - multiple certified staff members'
        },
        {
          name: 'ISO 9001:2015',
          issuer: 'International Organization for Standardization',
          year: 2020,
          description: 'Quality Management System certification'
        },
        {
          name: 'OSHA Compliant',
          issuer: 'Occupational Safety and Health Administration',
          description: 'Full safety compliance and training programs'
        }
      ]),
      45, // years in business
      '500+ employees',
      'Within 1 hour',
      'Worldwide',
      JSON.stringify({
        monday: '8:00 AM - 6:00 PM',
        tuesday: '8:00 AM - 6:00 PM',
        wednesday: '8:00 AM - 6:00 PM',
        thursday: '8:00 AM - 6:00 PM',
        friday: '8:00 AM - 6:00 PM',
        saturday: '9:00 AM - 3:00 PM',
        sunday: 'Closed',
        notes: '24/7 emergency technical support available for touring clients'
      }),
      JSON.stringify({
        website: 'https://prg.com',
        facebook: 'https://facebook.com/PRGlive',
        instagram: '@prg_live',
        linkedin: 'https://linkedin.com/company/prg',
        twitter: '@PRG_live'
      })
    ]);
    
    console.log(`✅ Successfully updated profile for: ${updated.name} (${updated.slug})\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
