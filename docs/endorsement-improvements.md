# Endorsement System Improvements - Implementation Summary

## Changes Implemented

### 1. Database Schema Updates

Created three new tables:

**`endorsement_issue_tags`** - Categorizes specific failure types
- 20 predefined tags covering:
  - Mechanical (Pan/Tilt Belt, Iris, Shutter, Gobo, Focus/Zoom)
  - Electrical (Power Supply, Lamp Strike, Electronics, DMX)
  - Software (Bugs, Calibration Drift, Menu Issues)
  - Thermal (Overheating, Fan Failure)
  - Optical (Lens Damage, Color Mixing, Prism)
  - Other (Build Quality, Noise, General)

**`fixture_endorsement_issues`** - Tracks which issues are reported for each downvote
- Links endorsements to specific issue tags
- Maintains count of each issue type
- Enables statistics like "75% of complaints: Pan/Tilt Belts"

**`certified_fixtures`** - Tracks fixtures that meet certification standards
- Stores fixture_id, certification date, and threshold score
- Automatically certifies fixtures with 90%+ approval across all categories
- Requires minimum 5 votes per category

### 2. Backend API Routes

Created `/api/v1/endorsement-issues/` endpoints:

- `GET /tags` - Returns all issue tag options for the modal
- `GET /fixture/:fixtureId` - Returns issue statistics for a fixture
- `POST /report` - Records a specific issue when user downvotes
- `GET /certified` - Lists all certified fixtures
- `POST /certify/:fixtureId` - Checks and certifies eligible fixtures

### 3. Frontend Components

**IssueReportModal.tsx**
- Modal that appears when user downvotes a category
- Groups issues by category (Mechanical, Electrical, etc.)
- Radio button selection for specific issue
- Prevents duplicate issue reports per session
- Shows issue descriptions for clarity

**CertifiedBadge.tsx**
- Green shield icon with "Rider Ready Certified" label
- Available in sm/md/lg sizes
- Tooltip explains 90%+ approval requirement
- Can be shown icon-only or with label

### 4. Planned UI Improvements (Not Yet Implemented)

The following need to be added to fixture/vendor detail pages:

**Issue Statistics Display**
```tsx
// Show top issues when downvotes exist
{topIssue && (
  <div className="text-xs text-red-400 mt-1">
    Top Issue: {topIssue.name} ({topIssue.percentage}% of reports)
  </div>
)}
```

**Certified Badge in Header**
```tsx
{isCertified && (
  <CertifiedBadge size="lg" className="mb-4" />
)}
```

**Condensed Layout** (Side-by-side categories)
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
  {/* Groups: Bright Output + Optics Quality */}
  {/* Reliable + Build Quality */}
  {/* Color Mixing + Quietness */}
</div>
```

**De-emphasize Zero Votes**
```tsx
const opacity = hasVotes ? 'opacity-100' : 'opacity-40';
const borderStyle = hasVotes ? 'border-solid' : 'border-dashed';
```

**Required Issue Selection on Downvote**
```tsx
const handleVote = (categorySlug: string, voteType: 'up' | 'down') => {
  if (voteType === 'down') {
    setSelectedEndorsement(categorySlug);
    setShowIssueModal(true);
    return; // Don't vote yet, wait for issue selection
  }
  voteMutation.mutate({ categorySlug, voteType });
};
```

## Next Steps

1. **Update Fixture Detail Page**
   - Import IssueReportModal and CertifiedBadge
   - Add state for modal visibility
   - Intercept downvotes to show modal first
   - Display certified badge if applicable
   - Show issue statistics under categories with downvotes

2. **Update Fixtures List Page**
   - Show certified badge on fixture cards
   - Add "Certified" filter option

3. **Create Certification Cron Job**
   - Automatically review and certify fixtures that meet criteria
   - Re-check certified fixtures if new negative feedback comes in
   - Email notifications when fixtures lose certification

4. **Admin Dashboard**
   - View all certified fixtures
   - Manually override certification
   - View issue statistics across all fixtures
   - Identify most common failure modes industry-wide

## Benefits

**For Users:**
- ✅ Instant trust signal (Certified badge)
- ✅ Actionable feedback (specific failure modes)
- ✅ Better decision-making (know what to avoid)
- ✅ More efficient layout (side-by-side categories)

**For the Platform:**
- ✅ More valuable data (specific issues vs generic downvotes)
- ✅ Industry insights (trend analysis of common failures)
- ✅ Quality control (certification drives improvement)
- ✅ Professional credibility (diagnostic tool vs popularity contest)

## Database Queries for Testing

```sql
-- Check issue tags
SELECT * FROM endorsement_issue_tags ORDER BY display_order;

-- Get fixtures eligible for certification (90%+ approval, 5+ votes per category)
SELECT 
  f.name,
  fe.category_id,
  fe.upvotes,
  fe.downvotes,
  (fe.upvotes::float / (fe.upvotes + fe.downvotes)) * 100 as approval_rate
FROM fixture_endorsements fe
JOIN fixtures f ON fe.fixture_id = f.id
WHERE (fe.upvotes + fe.downvotes) >= 5
ORDER BY f.name, approval_rate DESC;

-- Get top issues for a fixture
SELECT 
  fec.name as category,
  eit.name as issue,
  fei.count,
  fe.downvotes,
  ROUND((fei.count::float / fe.downvotes) * 100) as percentage
FROM fixture_endorsement_issues fei
JOIN fixture_endorsements fe ON fei.endorsement_id = fe.id
JOIN fixture_endorsement_categories fec ON fe.category_id = fec.id
JOIN endorsement_issue_tags eit ON fei.issue_tag_id = eit.id
WHERE fe.fixture_id = 'FIXTURE_ID_HERE'
ORDER BY fei.count DESC;
```

## Files Modified/Created

**Backend:**
- ✅ `backend/src/routes/endorsement-issues.ts` (NEW)
- ✅ `backend/src/server.ts` (updated - added route)
- ✅ Database schema (3 new tables)

**Frontend:**
- ✅ `frontend/src/components/IssueReportModal.tsx` (NEW)
- ✅ `frontend/src/components/CertifiedBadge.tsx` (NEW)
- ⏳ `frontend/src/app/fixtures/[slug]/page.tsx` (needs updates)
- ⏳ `frontend/src/app/fixtures/page.tsx` (needs certified filter)
- ⏳ `frontend/src/app/vendors/[id]/page.tsx` (needs same updates)

**Status:** Backend complete, Frontend components created, Integration pending.
