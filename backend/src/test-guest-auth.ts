// Test script for guest authentication and inventory management

const API_BASE = 'http://localhost:3001/api/v1';

async function testGuestAuth() {
  console.log('\n🧪 Testing Guest Authentication...\n');
  
  try {
    // 1. Create guest session
    console.log('1️⃣ Creating guest session...');
    const guestResponse = await fetch(`${API_BASE}/auth/guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!guestResponse.ok) {
      throw new Error(`Guest creation failed: ${guestResponse.status}`);
    }
    
    const guestData = await guestResponse.json();
    console.log('✅ Guest user created:');
    console.log(`   User ID: ${guestData.user.id}`);
    console.log(`   Session Token: ${guestData.sessionToken}`);
    console.log(`   Is Guest: ${guestData.user.is_guest}`);
    
    const sessionToken = guestData.sessionToken;
    
    // 2. Verify session by fetching user
    console.log('\n2️⃣ Verifying session...');
    const meResponse = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${sessionToken}` }
    });
    
    if (!meResponse.ok) {
      throw new Error(`Session verification failed: ${meResponse.status}`);
    }
    
    const meData = await meResponse.json();
    console.log('✅ Session verified:');
    console.log(`   User ID: ${meData.user.id}`);
    console.log(`   Session ID: ${meData.user.session_id}`);
    
    // 3. Add inventory items
    console.log('\n3️⃣ Adding fixtures to inventory...');
    const inventoryPayload = {
      fixtures: [
        {
          fixtureId: 'MAC-VIPER-PERF',
          quantityRange: '10-50',
          forRental: true,
          forPurchase: false
        },
        {
          fixtureId: 'R2-WASH',
          quantityRange: '1-10',
          forRental: true,
          forPurchase: true
        }
      ]
    };
    
    const addInventoryResponse = await fetch(`${API_BASE}/vendor-inventory/lightworks-productions/inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
      },
      body: JSON.stringify(inventoryPayload)
    });
    
    if (!addInventoryResponse.ok) {
      throw new Error(`Add inventory failed: ${addInventoryResponse.status}`);
    }
    
    const inventoryResult = await addInventoryResponse.json();
    console.log('✅ Inventory added:');
    console.log(`   Added: ${inventoryResult.added} fixtures`);
    console.log(`   Fixtures: ${inventoryResult.inventory.map((i: any) => i.fixture_id).join(', ')}`);
    
    // 4. Fetch vendor inventory
    console.log('\n4️⃣ Fetching vendor inventory...');
    const getInventoryResponse = await fetch(`${API_BASE}/vendor-inventory/lightworks-productions/inventory`);
    
    if (!getInventoryResponse.ok) {
      throw new Error(`Get inventory failed: ${getInventoryResponse.status}`);
    }
    
    const inventory = await getInventoryResponse.json();
    console.log('✅ Retrieved inventory:');
    console.log(`   Total fixtures: ${inventory.count}`);
    inventory.inventory.forEach((item: any, idx: number) => {
      console.log(`   ${idx + 1}. ${item.fixture_name}`);
      console.log(`      Quantity: ${item.quantity_range}`);
      console.log(`      Rental: ${item.available_for_rental}, Purchase: ${item.available_for_purchase}`);
    });
    
    console.log('\n🎉 All tests passed!\n');
    
  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testGuestAuth();
