# Vendor Endorsements System

## Overview
The vendor endorsements system allows the production community to provide feedback on vendor strengths and weaknesses through a thumbs up/down voting mechanism.

## Database Schema

### Tables Created
- **endorsement_categories** - Predefined categories for strengths and weaknesses
- **vendor_endorsements** - Tracks vote counts per vendor per category
- **endorsement_votes** - Individual votes to prevent duplicate voting

### Endorsement Categories

#### Strengths (Positive)
- Inventory Depth - Large selection and availability
- Customer Service - Responsive and helpful support
- Equipment Condition - Well-maintained, clean gear
- Fast Turnaround - Quick quotes and efficient logistics
- Competitive Pricing - Fair and transparent pricing
- Technical Expertise - Knowledgeable staff and tech support
- Reliable Delivery - On-time delivery and pickup
- Flexibility - Accommodating to last-minute changes
- Documentation - Clear paperwork and equipment specs
- Multi-City Coverage - Strong presence across multiple markets

#### Weaknesses (Negative)
- Limited Inventory - Frequently out of stock
- Poor Communication - Slow to respond or unclear
- Equipment Issues - Gear often needs service
- Slow Response - Delayed quotes or logistics
- High Prices - Above-market pricing
- Inexperienced Staff - Lacks technical knowledge
- Delivery Problems - Late or missed deliveries
- Rigid Policies - Inflexible terms and policies
- Poor Documentation - Missing or incomplete paperwork
- Limited Coverage - Only serves specific markets

## API Endpoints

### GET /api/v1/vendors/:slug
Returns vendor data including endorsements array with vote counts.

### POST /api/v1/vendors/:slug/endorsements/:categorySlug/vote
Vote on a specific endorsement category for a vendor.

**Body:**
```json
{
  "voteType": "up" | "down",
  "sessionId": "unique-browser-session-id"
}
```

### GET /api/v1/vendors/:slug/endorsement-categories
Get all available endorsement categories.

## Frontend Display

Endorsements are displayed on vendor detail pages showing:
- Category name and description
- Net score (upvotes - downvotes)
- Individual upvote and downvote counts
- Visual distinction between strengths (green) and weaknesses (red)
- Only shows categories with positive net scores

## Voting System

- Session-based voting prevents duplicate votes from the same browser
- Users can change their vote (up to down or vice versa)
- Vote counts update in real-time via triggers
- Net score is calculated automatically: `upvotes - downvotes`

## Setup

Run the setup script to create all necessary tables:
```powershell
.\setup-endorsements.ps1
```

Or use the batch file:
```
"Setup Endorsements.bat"
```

## Future Enhancements

- User authentication for verified votes
- Comments/reviews alongside votes
- Vendor response to feedback
- Historical vote tracking and trends
- Email notifications to vendors
- Endorsement analytics dashboard
