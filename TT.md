# **FULL TECHNICAL TASK: Real Estate Admin Dashboard**

## **Project Overview**
Build a complete admin dashboard for real estate management platform that provides full control over API-managed data and comprehensive reporting capabilities.

## **Tech Stack**
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: TailwindCSS 4
- **UI Components**: Radix UI primitives + custom components
- **State Management**: React hooks + Zustand (if needed)
- **Charts**: Chart.js + react-chartjs-2
- **Internationalization**: i18next (Uzbek, Russian, English)
- **Authentication**: Cookie-based JWT

## **Project Structure**
```
src/
├── app/                    # Next.js App Router
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── admin/            # Admin-specific components
│   └── charts/           # Chart components
├── lib/                  # Utilities and services
│   ├── api/              # API service modules
│   ├── hooks/            # Custom hooks
│   ├── stores/           # State management
│   └── utils/            # Helper functions
├── types/                # TypeScript definitions
└── locales/              # Translation files
```

## **Core Features & Pages**

### **1. Authentication System**
- **Login page** (`/login`)
  - Phone number + password authentication
  - JWT token management
  - Redirect to admin dashboard on success
- **Protected routes** - all admin pages require authentication
- **Logout functionality** - clear tokens and redirect to login

### **2. Dashboard Overview** (`/admin`)
- **Key Metrics Cards**:
  - Total users count
  - Total properties count
  - Active properties count
  - Total views count
  - Total favorites count
  - Active chats count
  - Average listing price
  - Total revenue
- **Performance Charts**:
  - Monthly revenue trend (30 days)
  - New users registration trend (30 days)
  - New subscriptions trend (30 days)
- **Quick Actions**:
  - Add new property
  - View recent activity
  - Access quick reports
- **System Status**:
  - Most popular category
  - Most active user
  - Top viewed listing
  - Expiring subscriptions (3 days)

### **3. Properties Management** (`/admin/properties`)
- **Properties List**:
  - Grid/List view toggle
  - Search by title, description
  - Filter by: category, city, transaction type, price range, rooms
  - Sort by: date, price, views, likes
  - Pagination (20 items per page)
- **Property Actions**:
  - View property details
  - Edit property
  - Delete property
  - Toggle active/inactive status
- **Property Details** (`/admin/properties/[id]`):
  - Full property information display
  - Photo gallery management
  - Video management
  - Performance metrics (views, likes, favorites, shares)
  - Edit form with all fields
- **Add/Edit Property Form**:
  - Basic info: title, description, transaction type
  - Category and type selection
  - Price and currency
  - Location: city, district, coordinates
  - Specifications: area, rooms, bathrooms, age, etc.
  - Features selection
  - Nearby amenities
  - Photo/video upload
  - Mortgage availability

### **4. Users Management** (`/admin/users`)
- **Users List**:
  - Search by name, phone, bio
  - Filter by: role, status, language
  - Sort by: registration date, activity
  - Pagination
- **User Actions**:
  - View user profile
  - Edit user details
  - Change user status (active/banned)
  - View user's properties
  - View user's favorites
- **User Profile** (`/admin/users/[id]`):
  - Personal information
  - Contact details
  - Account status
  - Properties count
  - Registration date
  - Last activity

### **5. Categories & Features** (`/admin/categories`)
- **Categories Management**:
  - List all property categories
  - Add new category
  - Edit category details
  - Set paid/free status
  - Set advertisement price
- **Features Management**:
  - List all property features
  - Add new feature
  - Edit feature name
  - Delete feature
- **Property Types**:
  - List all property types
  - Add new type
  - Edit type name
  - Delete type

### **6. Locations Management** (`/admin/locations`)
- **Cities Management**:
  - List all cities
  - Add new city
  - Edit city name
  - Delete city
  - View properties count per city
- **Districts Management**:
  - List districts by city
  - Add new district
  - Edit district name
  - Delete district
  - View properties count per district
- **Nearby Amenities**:
  - List all nearby amenities
  - Add new amenity
  - Edit amenity name
  - Delete amenity

### **7. Analytics & Reports** (`/admin/analytics`)
- **Engagement Analytics**:
  - Total views, likes, favorites, shares
  - Views per property
  - User engagement patterns
  - Geographic engagement data
- **Performance Reports**:
  - Property performance ranking
  - Category popularity
  - User activity metrics
  - Revenue trends
- **Export Functionality**:
  - Export data to CSV
  - Generate PDF reports
  - Data download options

### **8. Communication** (`/admin/communication`)
- **Chat Management**:
  - List all active chats
  - View chat messages
  - Chat statistics
  - User communication history
- **Message Analytics**:
  - Message volume trends
  - Response time metrics
  - Chat performance data

### **9. Payments & Subscriptions** (`/admin/payments`)
- **Payment Overview**:
  - Total revenue
  - Payment methods distribution
  - Failed payments count
  - Payment success rates
- **Subscription Management**:
  - Active subscriptions count
  - Subscription types distribution
  - Expiring subscriptions
  - Revenue per subscription type
- **Wallet Management**:
  - User wallet balances
  - Transaction history
  - Top-up statistics

## **API Integration Requirements**

### **API Endpoints to Implement:**
- **Authentication**: `/api/website/v1/auth/login/`, `/api/website/v1/auth/logout/`
- **Dashboard**: `/api/website/v1/dashboard/`
- **Properties**: `/api/website/v1/listing/`
- **Users**: `/api/website/v1/users/`
- **Categories**: `/api/website/v1/category/`
- **Features**: `/api/website/v1/features/`
- **Cities**: `/api/website/v1/city/`
- **Districts**: `/api/website/v1/district/`
- **Payments**: `/api/website/v1/payments/`
- **Chats**: `/api/website/v1/chats/`
- **Engagement**: `/api/website/v1/views/`, `/api/website/v1/likes/`, `/api/website/v1/favorites/`

### **Data Models to Support:**
- **Property**: All fields from API schema
- **User**: Complete user profile with contacts
- **Category**: Name, paid status, price
- **Location**: Cities, districts, coordinates
- **Payment**: Amount, method, type, status
- **Engagement**: Views, likes, favorites, shares

## **UI/UX Requirements**

### **Design System:**
- **Color Scheme**: Professional, accessible colors
- **Typography**: Clear, readable fonts
- **Spacing**: Consistent spacing system
- **Components**: Reusable, consistent component library

### **Responsive Design:**
- **Desktop**: Full-featured interface
- **Tablet**: Optimized for touch
- **Mobile**: Essential functions only

### **Accessibility:**
- **Keyboard navigation**
- **Screen reader support**
- **High contrast mode**
- **Focus management**

## **Performance Requirements**

### **Loading States:**
- **Skeleton loaders** for all data
- **Progressive loading** for large datasets
- **Optimistic updates** for better UX

### **Caching Strategy:**
- **API response caching**
- **Local storage** for user preferences
- **Optimistic updates** for forms

### **Error Handling:**
- **User-friendly error messages**
- **Retry mechanisms**
- **Fallback UI states**
- **Error boundaries**

## **Internationalization**

### **Supported Languages:**
- **Uzbek** (primary)
- **Russian** (secondary)
- **English** (tertiary)

### **Translation Coverage:**
- **All UI text**
- **Error messages**
- **Form labels**
- **Navigation items**
- **Report headers**

## **Security Requirements**

### **Authentication:**
- **JWT token validation**
- **Route protection**
- **Session management**
- **Secure logout**

### **Data Protection:**
- **Input validation**
- **XSS prevention**
- **CSRF protection**
- **Secure API calls**

## **Development Phases**

### **Phase 1: Foundation (Day 1)**
- Project setup and structure
- Authentication system
- Basic layout and navigation
- Dashboard skeleton

### **Phase 2: Core Management (Day 2-3)**
- Properties management
- Users management
- Categories and features
- Basic CRUD operations

### **Phase 3: Advanced Features (Day 4)**
- Analytics and charts
- Reports generation
- Advanced filtering
- Export functionality

### **Phase 4: Polish & Testing (Day 5)**
- Error handling
- Responsive design
- Performance optimization
- Testing and bug fixes

## **Success Criteria**

### **Functional Requirements:**
- ✅ All CRUD operations working
- ✅ Dashboard displaying real data
- ✅ Search and filtering functional
- ✅ Forms saving data correctly
- ✅ Charts showing accurate data

### **Quality Requirements:**
- ✅ Responsive design working
- ✅ Error handling implemented
- ✅ Loading states smooth
- ✅ Performance acceptable
- ✅ Code maintainable

### **User Experience:**
- ✅ Intuitive navigation
- ✅ Clear data presentation
- ✅ Fast response times
- ✅ Professional appearance
- ✅ Easy to use for admins

## **Deliverables**

1. **Working admin dashboard** with all core features
2. **Responsive design** for all screen sizes
3. **Complete CRUD operations** for all entities
4. **Analytics and reporting** functionality
5. **Multi-language support**
6. **Clean, maintainable codebase**
7. **Documentation** for future development

