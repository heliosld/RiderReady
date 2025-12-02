# Interactive Features & Data Collection System

**Status**: ✅ Implemented (December 2024)

## Overview

The Interactive Features system transforms RiderReady from a static database into an intelligent platform that learns from user behavior. It collects valuable engagement data while providing immediate value to users through personalized recommendations and insights.

## Key Features

### For Manufacturers
- **Competitive Intelligence**: See which fixtures users compare yours against
- **Market Research**: Understand which use cases drive interest in your products
- **Feature Prioritization**: Data on which specifications matter most to buyers
- **Lead Generation**: Direct connection to interested lighting designers

### For Users (Lighting Designers)
- **Personalized Recommendations**: Context-specific advice based on your application
- **Discovery**: Find fixtures you didn't know existed via similarity engine
- **Quick Comparisons**: Easy side-by-side evaluation of options
- **Direct Communication**: Request demos from manufacturers or local vendors
- **Community Insights**: See how other LDs rate and use fixtures

## System Architecture

### Database Schema

#### Core Tracking Tables (9 tables)
1. **fixture_use_case_selections** - Application context tracking
2. **fixture_comparisons** - Competitive analysis data
3. **feature_importance_votes** - Specification priority scoring
4. **demo_requests** - Lead generation and interest tracking
5. **fixture_page_views** - Engagement metrics
6. **fixture_user_ratings** - User satisfaction scores
7. **fixture_wishlist** - Purchase intent signals
8. **spec_tooltip_interactions** - User education needs
9. **vendor_contact_clicks** - Sales attribution

#### Analytics Views (3 views)
1. **manufacturer_fixture_insights** - Aggregated fixture performance
2. **feature_importance_trends** - Time-series priority data
3. **competitive_comparisons** - Head-to-head comparison frequency

### Backend API Routes

**Base Path**: `/api/v1/tracking`

#### Engagement Tracking Endpoints
```
POST /fixtures/:id/use-case
POST /fixtures/:id/page-view
POST /fixtures/:id/rating
POST /fixtures/:id/wishlist
POST /fixtures/:id/feature-importance
POST /vendor-contact
```

#### Data Retrieval Endpoints
```
GET /fixtures/:id/use-cases
GET /fixtures/:id/compared-with
```

#### Demo Request System
```
POST /fixtures/:id/demo-request
```
Supports three recipient types:
- **Manufacturer**: Direct to brand (Martin, Robe, Chauvet, etc.)
- **Vendor**: Local rental houses with equipment in stock
- **Distributor**: Regional distribution partners

#### Similar Fixtures Engine
```
GET /similar/fixtures/:id/similar?limit=6
```

## Features Implementation

### 1. Use Case Selector

**Purpose**: Understand user's application context to provide relevant recommendations

**8 Use Case Options**:
- 🎵 Concert Touring - High-impact, road-worthy gear
- 🎭 Theater - Quiet operation, color accuracy, smooth dimming
- 💼 Corporate Events - Reliable, easy setup, professional look
- 📺 Broadcast/Film - Flicker-free, high CRI, precise control
- 🏛️ Architectural - Long life, silent operation, consistent color
- 🙏 Worship - Budget-conscious, easy operation, versatile
- 🎧 Club/DJ - Bold effects, fast movement, music reactivity
- 🌳 Outdoor Events - Weather resistance, high brightness, rugged

**User Roles**:
- Lighting Designer
- Production Manager
- Rental Company
- Venue Manager
- Technical Director
- Owner/Operator

**Data Collected**:
- Use case selection frequency per fixture
- Role distribution per use case
- Timestamp and session tracking

### 2. Context-Specific Insights

**Purpose**: Provide immediate value after use case selection

**Content Structure**:
- **4 Key Priorities**: What matters most for this application
- **3-4 Pro Tips**: Practical advice from experienced LDs
- **Specifications Highlight**: Which specs to focus on

**Example - Theater Use Case**:
```
Key Priorities:
1. Noise Level: <40dB for audience areas
2. Color Quality: CRI 90+ for accurate skin tones
3. Dimming Curve: Smooth fade to zero without stepping
4. Fan Noise: Silent or quiet modes for dramatic scenes

Pro Tips:
- Test dimming curves in person before committing
- Consider fanless fixtures for quiet scenes
- RGB color mixing often insufficient for theater
- Check if fixture supports 16-bit dimming
```

### 3. Similar Fixtures Engine

**Purpose**: Help users discover alternatives and provide competitive intelligence

**Algorithm**: 100-point weighted scoring system

**Scoring Breakdown**:
- **Fixture Type Match** (35 points)
  - Exact match: 35 pts
  - Has any type: 5 pts
  - No type data: 3 pts
  
- **Light Source Type** (25 points)
  - Exact match (LED/Discharge/Hybrid): 25 pts
  - Both have data but different: 12 pts
  - Has data: 5 pts
  
- **Brightness Similarity** (12 points)
  - Calculated by lumens difference percentage
  - Closer output = higher score
  - Has lumen data: 3 pts minimum
  
- **Power Consumption** (8 points)
  - Similar wattage important for power planning
  - Percentage-based scoring
  
- **Weight & Movement** (6 points)
  - Pan/tilt range similarity (3 pts each)
  - Important for rigging and programming
  
- **Beam Angle** (5 points)
  - Critical for beam coverage planning
  
- **Color Mixing Type** (10 points)
  - RGBW, CMY, RGB, etc.
  - Exact match or compatible types
  
- **DMX Channels** (2 points)
  - Similar channel counts suggest similar capability
  
- **Gobo Capability** (2 points)
  - Both have or both don't have

**Output**:
- Up to 6 similar fixtures (configurable)
- Similarity score (0-100)
- Match reason tags (e.g., "Same type", "Similar brightness")
- Key spec comparison (lumens, watts, weight)
- Links to fixture pages

**Technical Implementation**:
```sql
-- Similarity calculated in PostgreSQL
-- Uses CASE statements for weighted scoring
-- No minimum threshold - always shows best matches
-- Excludes the fixture itself
-- Orders by similarity DESC, then name ASC
```

### 4. Comparison Quick-Add

**Purpose**: Enable rapid fixture evaluation workflow

**Features**:
- One-click add to comparison list
- Count badge showing items in comparison
- LocalStorage persistence (survives page refresh)
- Remove capability
- Link to comparison page (when implemented)

**Backend Tracking**:
When user adds 2+ fixtures, logs to `fixture_comparisons` table:
```json
{
  "comparison_set": ["fixture-id-1", "fixture-id-2", "fixture-id-3"],
  "session_id": "uuid",
  "timestamp": "2024-12-02T10:30:00Z"
}
```

### 5. Demo Request System

**Purpose**: Connect interested users with equipment providers

**Three Request Paths**:

1. **Manufacturer Direct**
   - Request demo from brand (Martin, Robe, Chauvet, etc.)
   - Manufacturer receives lead with user contact info
   - Can route to regional sales rep

2. **Vendor/Rental House**
   - Request from local rental company with equipment in stock
   - User selects specific location
   - Vendor receives lead for potential rental
   - Tracks attribution for sales teams

3. **Distributor**
   - Request from regional distribution partner
   - For purchase inquiries vs. rental
   - Distributor can connect user with local dealers

**Form Data Collected**:
```typescript
{
  fixtureId: string;
  recipientType: 'manufacturer' | 'vendor' | 'distributor';
  recipientId?: string;  // vendor or distributor ID
  recipientName: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  company?: string;
  message: string;
  locationPreference?: string;  // For vendor requests
  timestamp: Date;
}
```

### 6. Engagement Banner

**Purpose**: Encourage user participation in ratings

**Behavior**:
- Appears bottom-right after 10 seconds on fixture page
- Dismissible with localStorage memory
- Scrolls to ratings section on click
- Z-index 9998 (below modals, above content)

### 7. Page View Analytics

**Purpose**: Comprehensive engagement tracking

**Metrics Collected**:
- Time on page (seconds)
- Scroll depth (percentage)
- Referrer source
- Session ID
- Timestamp
- User agent (for device/browser insights)

**Usage**:
- Identify popular fixtures
- Understand user engagement patterns
- A/B testing for UX improvements
- Content effectiveness measurement

### 8. Ratings & Reviews

**Purpose**: User-generated quality signals

**Data Points**:
- 5-star rating
- Would recommend? (boolean)
- Review text (optional)
- Use case context (from selector)
- User identification (optional email)

**Display**:
- Average rating per fixture
- Recommendation percentage
- Review count
- Individual review cards

### 9. Wishlist

**Purpose**: Track long-term purchase intent

**Features**:
- Add/remove fixtures from personal wishlist
- Private to user (requires account in future)
- Signals interest for manufacturers
- Can trigger email campaigns (future)

## Privacy & Data Governance

### Current Implementation
- **No user accounts required**: Most features work anonymously
- **Session-based tracking**: Uses session IDs, not personal identification
- **Optional identification**: Email only required for demo requests and ratings
- **LocalStorage**: Client-side preference storage (comparison list, banner dismissal)

### Future Considerations
- GDPR compliance for European users
- Clear privacy policy and data usage disclosure
- Opt-out mechanisms
- Data retention policies
- User data export/deletion tools

## Technical Stack

### Frontend
- **React Components**: 6 new interactive components
- **State Management**: React hooks + LocalStorage
- **API Integration**: React Query for server state
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React

### Backend
- **Framework**: Express.js + TypeScript
- **Database**: PostgreSQL with optimized indexes
- **Query Engine**: pg-promise for complex queries
- **Validation**: Request validation middleware

### Performance
- **Caching**: Consider Redis for analytics queries (future)
- **Indexes**: Composite indexes on tracking tables
- **Batch Writes**: Consider batching analytics events
- **Database Views**: Pre-computed aggregations for dashboards

## Roadmap

### Phase 1: Foundation ✅ (Complete)
- [x] Database schema and API endpoints
- [x] Use case selector with insights
- [x] Similar fixtures engine
- [x] Demo request system
- [x] Comparison tracking
- [x] Engagement analytics
- [x] Ratings and wishlist

### Phase 2: Analytics Dashboard 🔄 (Q1 2025)
- [ ] Manufacturer login and authentication
- [ ] Fixture performance dashboard
- [ ] Use case distribution charts
- [ ] Comparison frequency reports
- [ ] Demo request lead management
- [ ] Export capabilities (CSV, PDF)

### Phase 3: Advanced Features (Q2 2025)
- [ ] User accounts for LDs
- [ ] Comparison page UI (side-by-side)
- [ ] Email notifications for demo requests
- [ ] Review moderation tools
- [ ] A/B testing framework
- [ ] Mobile app (React Native)

### Phase 4: Intelligence Layer (Q3 2025)
- [ ] Machine learning recommendations
- [ ] Predictive analytics (trending fixtures)
- [ ] Market segmentation insights
- [ ] Competitive positioning reports
- [ ] Price optimization suggestions
- [ ] Equipment substitution AI

### Phase 5: Platform Expansion (Q4 2025)
- [ ] Multi-brand analytics (enterprise)
- [ ] API marketplace
- [ ] Integration with CAD software
- [ ] Integration with rental software
- [ ] White-label solutions
- [ ] International expansion

## Success Metrics

### User Engagement
- Use case selections tracking
- Demo request volume
- User ratings and reviews
- Comparison set creation

### Data Quality
- Fixture coverage completeness
- Use case distribution balance
- Review authenticity and moderation
- Analytics data accuracy

## Known Issues & Technical Debt

### Current Issues
- ~~Similar fixtures not displaying due to column name mismatch~~ ✅ FIXED
- No backend server heartbeat check before frontend queries
- LocalStorage comparison list not synced across devices
- No rate limiting on tracking endpoints (potential spam)

### Technical Debt
- [ ] Add request validation schemas (Zod or Joi)
- [ ] Implement rate limiting per IP/session
- [ ] Add comprehensive error logging (Sentry)
- [ ] Create database migration system
- [ ] Add automated testing (Jest, React Testing Library)
- [ ] Optimize N+1 queries in similar fixtures
- [ ] Add database connection pooling
- [ ] Create admin dashboard for data management
- [ ] Add email service integration (SendGrid, Postmark)
- [ ] Implement proper authentication (JWT, OAuth)

## File Structure

```
backend/src/
├── routes/
│   ├── interactive-tracking.ts    # 13 tracking/analytics endpoints
│   └── similar-fixtures.ts        # Similarity algorithm implementation
├── db/
│   └── connection.ts              # PostgreSQL connection pool
└── update-demo-requests-table.ts  # Migration for vendor/distributor support

frontend/src/
├── components/
│   ├── UseCaseSelector.tsx        # 8 use case selection interface
│   ├── UseCaseInsights.tsx        # Context-specific recommendations
│   ├── SimilarFixtures.tsx        # Fixture recommendations grid
│   ├── ComparisonQuickAdd.tsx     # One-click comparison tracking
│   ├── DemoRequestModal.tsx       # Multi-recipient demo requests
│   └── EngagementBanner.tsx       # Floating ratings encouragement
└── app/fixtures/[slug]/page.tsx   # Main fixture page integration

database/
└── interactive_features.sql       # Schema for all tracking tables
```

## API Documentation

### POST /api/v1/tracking/fixtures/:id/use-case

Track user's application context selection.

**Request Body**:
```json
{
  "useCase": "concert_touring",
  "userRole": "lighting_designer",
  "sessionId": "uuid-string"
}
```

**Response**: `201 Created`

---

### GET /api/v1/similar/fixtures/:id/similar

Get fixtures similar to the specified fixture.

**Query Parameters**:
- `limit` (optional): Number of results (default: 6)

**Response**:
```json
{
  "reference": {
    "id": "uuid",
    "name": "MAC Aura XB",
    "manufacturer": "Martin Professional"
  },
  "similar": [
    {
      "id": "uuid",
      "name": "R2 Wash",
      "slug": "chauvet-r2-wash",
      "manufacturer": "Chauvet Professional",
      "similarity_score": 87,
      "match_reasons": ["Same type", "Similar brightness", "Same light source"],
      "lumens": 10000,
      "power": 350,
      "weight": 9.5
    }
  ]
}
```

---

### POST /api/v1/tracking/fixtures/:id/demo-request

Submit a demo request to manufacturer, vendor, or distributor.

**Request Body**:
```json
{
  "recipientType": "vendor",
  "recipientId": "vendor-uuid",
  "recipientName": "LightWorks - Los Angeles",
  "userName": "John Smith",
  "userEmail": "john@example.com",
  "userPhone": "555-0123",
  "company": "JMS Productions",
  "message": "Would like to demo for upcoming tour",
  "locationPreference": "Los Angeles, CA"
}
```

**Response**: `201 Created`

---

## Conclusion

The Interactive Features system positions RiderReady as more than a database—it's an intelligent platform that benefits both users and manufacturers. By collecting valuable behavioral data while providing immediate user value, we create a complete ecosystem for lighting equipment discovery and evaluation.

The similar fixtures engine provides competitive intelligence while helping LDs discover equipment options they might have missed. Combined with use case insights and direct demo request capabilities, this system serves the entire lighting industry.

**Next Steps**: Build manufacturer analytics dashboard and continue expanding the fixture database.
