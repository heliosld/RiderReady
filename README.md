# RiderReady

**The comprehensive lighting and production equipment database for lighting designers and production professionals.**

## Vision

RiderReady aims to be the go-to platform for LDs (Lighting Designers) to find and compare lighting fixtures, discover vendors, and build technical riders. Starting with automated lighting fixtures, RiderReady will expand to become the industry's most comprehensive database of production equipment.

## Project Roadmap

### Phase 1: Foundation (Current)
- ✅ Project structure setup
- 🔄 Database schema design
- 🔄 Core API development
- 🔄 Basic frontend interface

### Phase 2: Automated Lights MVP
- Automated lighting fixtures database
- Advanced filtering system (by features, specifications, weight, power, etc.)
- Vendor/dealer database with location mapping
- Fixture-to-vendor relationships
- Search and comparison tools

### Phase 3: Expansion
- Conventional lighting fixtures
- Lighting consoles
- Dimming and power distribution
- Cable and rigging equipment

### Phase 4: Multi-Department
- Audio equipment database
- Video/LED equipment database
- Backline equipment database
- Cross-department search and filtering

### Phase 5: Advanced Features
- User accounts and saved configurations
- Rider builder tool
- Vendor availability checking
- Pricing information (where available)
- Equipment substitution suggestions
- PDF export for technical riders

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (React with App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context / Zustand
- **UI Components**: shadcn/ui or similar

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js or Fastify
- **Language**: TypeScript
- **API**: RESTful with potential GraphQL layer

### Database
- **Primary DB**: PostgreSQL (relational data, complex queries)
- **Search**: Elasticsearch or MeiliSearch (full-text search, filtering)
- **Cache**: Redis (performance optimization)

### Infrastructure
- **Hosting**: Vercel (frontend) + Railway/Render (backend)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry for error tracking

## Project Structure

```
RiderReady/
├── frontend/          # Next.js application
├── backend/           # Express.js API server
├── database/          # Database schemas, migrations, seeds
├── docs/              # Documentation and planning
└── shared/            # Shared TypeScript types and utilities
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or pnpm

### Installation

1. **Clone and setup:**
```bash
cd x:\RiderReady
```

2. **Backend setup:**
```bash
cd backend
npm install
cp .env.example .env
# Configure your database connection in .env
npm run dev
```

3. **Frontend setup:**
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## Key Features

### Currently Implemented ✅
- Automated lighting fixtures database with 17+ fixtures
- Manufacturer profiles with logos
- Vendor database with 30+ rental houses mapped across North America
- Advanced filtering by fixture type, manufacturer, features, weight, and power
- Interactive maps showing vendor locations
- Live search across fixtures, manufacturers, and vendors
- Detailed fixture specifications and comparison data
- Dark theme optimized for production environments

### In Development 🔄
- Side-by-side fixture comparison tool
- User accounts and authentication
- Saved fixture lists and favorites
- Enhanced filtering with multi-select capabilities
- Vendor inventory tracking
- DMX personality/mode database

### Planned Features 🎯

#### Phase 3: Lighting Expansion
- **Conventional Fixtures**: PAR cans, fresnels, ellipsoidals, followspots
- **Lighting Consoles**: Grand MA, Eos, Hog, Chamsys, etc.
- **Dimming/Power**: Dimmer racks, power distribution, generators
- **Rigging Equipment**: Truss, motors, chain hoists, rigging hardware
- **Cable/Connectivity**: DMX, power, data, ethernet, signal
- **Effects/Specialty**: Fog machines, hazers, lasers, pyro

#### Phase 4: Multi-Department Equipment
- **Audio Equipment**: Consoles, speakers, microphones, processors
- **Video/LED**: LED walls, projectors, cameras, processors, switchers
- **Backline**: Amplifiers, guitars, drums, keyboards, DJ equipment
- **Staging**: Decks, risers, barricades, scenic elements
- **Power/Distro**: Generators, transformers, cam-lock, powerCON

#### Phase 5: Advanced Platform Features
- **Rider Builder**: Drag-and-drop technical rider creation with PDF export
- **Project Management**: Tour/show planning with multi-venue support
- **Equipment Substitution Engine**: Suggest alternatives based on specs
- **Availability Calendar**: Real-time vendor equipment availability
- **Quote Management**: Request and track quotes from multiple vendors
- **User Reviews**: Equipment ratings and field reports from LDs
- **Pricing Database**: Market pricing data (where available)
- **Power Calculator**: Auto-calculate power requirements
- **Weight Calculator**: Track truck pack and venue load limits
- **DMX Address Calculator**: Channel planning and patching tools
- **Template Library**: Save and share equipment templates
- **Mobile App**: Native iOS/Android for on-site use
- **API Access**: Integration with CAD software (Vectorworks, WYSIWYG)
- **Collaboration Tools**: Team sharing and commenting
- **Show Archive**: Document past shows and equipment lists

### Community Features 🌟
- **Equipment Database Contributions**: User-submitted fixtures and specs
- **Vendor Ratings**: Community reviews and reliability scores
- **Best Practices**: Knowledge base and tutorials
- **Marketplace**: Used equipment listings
- **Job Board**: Connect LDs with opportunities

## Contributing

This project is in active development. Contribution guidelines will be added as the project matures.

## License

TBD

## Contact

For questions or suggestions, please open an issue.

---

**Note**: This project is in early development. Star and watch this repo for updates!
