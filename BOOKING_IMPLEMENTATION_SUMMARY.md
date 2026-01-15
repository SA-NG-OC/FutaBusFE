# 🎫 Booking System Implementation Summary

## ✅ Completed Changes

### 1. **useTrips Hook** (`feature/trip/hooks/useTrips.ts`)

Added `fetchTripsForBooking` method with full filtering and sorting capabilities:

```typescript
const {
  trips,
  loading,
  currentPage,
  totalPages,
  totalElements,
  fetchTripsForBooking, // 🎫 NEW: For client booking with filters
  fetchTrips, // 📋 For admin/employee
} = useTrips();
```

**Parameters for `fetchTripsForBooking`:**

- `page`, `size` - Pagination
- `sortBy`, `sortDir` - Sorting (price, departureTime, rating)
- `originId`, `destId`, `date` - Search criteria
- `minPrice`, `maxPrice` - Price range filter
- `timeRanges` - Time of day filter (Morning, Afternoon, Evening, Night)
- `vehicleTypes` - Vehicle type filter (Seated, Sleeper, VIP Sleeper, Limousine)

---

### 2. **Booking Page** (`app/client/booking/page.tsx`)

Completely refactored to use URL params and `fetchTripsForBooking`:

**Features:**

- ✅ URL-based state management (all filters in URL)
- ✅ Syncs with search params on load
- ✅ Updates URL when filters/sort/pagination change
- ✅ Passes callbacks to child components
- ✅ Shows `totalElements` count
- ✅ Better loading and empty states

**URL Example:**

```
/client/booking?originId=1&destId=2&date=2026-01-20&sortBy=price&sortDir=asc&minPrice=100000&maxPrice=500000&timeRanges=Morning,Afternoon&page=0
```

---

### 3. **TripSearch Component** (`feature/booking/components/TripSearch/TripSearch.tsx`)

Updated to accept `onSearch` callback:

```typescript
<TripSearch onSearch={handleSearch} />
```

**Changes:**

- ✅ Accepts `onSearch` prop
- ✅ Reads initial values from URL params
- ✅ Form submission triggers parent callback
- ✅ Uses city IDs (temporary number inputs - TODO: replace with dropdown)

**TODO:** Replace number inputs with city selection dropdown

---

### 4. **TripSort Component** (`feature/booking/components/TripSort/TripSort.tsx`)

Updated to handle both sortBy and sortDir:

```typescript
<TripSort onSortChange={handleSortChange} />
```

**Changes:**

- ✅ Accepts `onSortChange(sortBy, sortDir)` callback
- ✅ Reads current sort from URL params
- ✅ Options: departureTime (asc/desc), price (asc/desc), rating (desc)

---

### 5. **TripFilter Component** (`feature/booking/components/TripFilter/TripFilter.tsx`)

Complete rewrite with state management:

```typescript
<TripFilter onFilterChange={handleFilterChange} />
```

**Features:**

- ✅ Price range inputs (min/max)
- ✅ Time range checkboxes (Morning, Afternoon, Evening, Night)
- ✅ Vehicle type checkboxes (Seated, Sleeper, VIP Sleeper, Limousine)
- ✅ Apply Filters button
- ✅ Clear All button
- ✅ Reads initial state from URL params

---

### 6. **Home Page** (`app/client/home/page.tsx`)

Added search functionality with navigation:

**Changes:**

- ✅ Uses TripSearch component
- ✅ `handleSearch` navigates to `/client/booking` with params
- ✅ Added hero section with gradient background
- ✅ Added feature cards (Easy Booking, Secure Payment, Mobile Friendly)

---

## 📋 Data Flow

```
1. User enters search on Home Page
   ↓
2. Home calls handleSearch → router.push("/client/booking?originId=1&...")
   ↓
3. Booking Page reads URL params
   ↓
4. Calls fetchTripsForBooking(params)
   ↓
5. API returns filtered/sorted trips
   ↓
6. Displays trips + pagination
   ↓
7. User changes filter/sort → URL updates → Re-fetch
```

---

## 🔧 API Integration

### Backend Endpoint

```
GET /trips
```

### Query Parameters (all optional)

```typescript
{
  page: 0,
  size: 10,
  sortBy: "departureTime",  // "price" | "departureTime" | "rating"
  sortDir: "asc",           // "asc" | "desc"
  originId: 1,
  destId: 2,
  date: "2026-01-20",
  minPrice: 100000,
  maxPrice: 500000,
  timeRanges: ["Morning", "Afternoon"],
  vehicleTypes: ["Limousine", "Seated"]
}
```

---

## 🎯 User Flows

### Flow 1: Search from Home

1. User fills in origin, destination, date on home page
2. Clicks "Tìm kiếm chuyến xe"
3. Navigates to `/client/booking?originId=X&destId=Y&date=Z`
4. Booking page fetches and displays matching trips

### Flow 2: Apply Filters

1. User on booking page checks "Morning" time range
2. Clicks "Apply Filters"
3. URL updates with `?timeRanges=Morning`
4. Page re-fetches trips with filter
5. Displays filtered results

### Flow 3: Sort Results

1. User selects "Price: Low to High" from dropdown
2. URL updates with `?sortBy=price&sortDir=asc`
3. Page re-fetches with sorting
4. Displays sorted trips

### Flow 4: Pagination

1. User clicks page 2
2. URL updates with `?page=1` (0-indexed)
3. Page fetches next page of results
4. Displays new trips

---

## 🚀 Next Steps (TODO)

### High Priority

1. **City Selection Dropdown**

   - Replace number inputs in TripSearch with proper city dropdown
   - Fetch city list from backend API
   - Show city names instead of IDs

2. **Route API Integration**

   - Create `/routes` API endpoint to get available routes
   - Populate origin/destination dropdowns

3. **Mobile Responsiveness**
   - Test on mobile devices
   - Adjust filter sidebar for mobile (drawer/modal)

### Medium Priority

4. **Filter Persistence**

   - Save user preferences in localStorage
   - Remember last search on return visit

5. **Advanced Features**

   - Date range search (return trips)
   - Multi-city search
   - Passenger type (adult, child, senior)

6. **Performance**
   - Add debouncing for price range inputs
   - Implement infinite scroll option
   - Cache API responses

### Low Priority

7. **UI Enhancements**
   - Add loading skeletons
   - Trip card animations
   - Filter tags showing active filters

---

## 📝 Component API Reference

### TripSearch

```typescript
interface TripSearchProps {
  onSearch: (params: {
    originId?: number;
    destId?: number;
    date?: string;
  }) => void;
}
```

### TripSort

```typescript
interface TripSortProps {
  onSortChange: (sortBy: string, sortDir: string) => void;
}
```

### TripFilter

```typescript
interface TripFilterProps {
  onFilterChange: (filters: {
    minPrice?: number;
    maxPrice?: number;
    timeRanges?: string[];
    vehicleTypes?: string[];
  }) => void;
}
```

### TripCard

```typescript
interface TripCardProps {
  tripDetail: TripData;
  handleSelectSeat: (tripId: number) => void;
}
```

---

## ⚠️ Known Issues

1. **TripSearch City Input**

   - Currently uses number inputs for city IDs (temporary)
   - Should be replaced with dropdown/autocomplete

2. **Filter Clear on Home Navigation**

   - Clicking "Clear all filters" navigates to `/client/booking` without params
   - This works but could be improved with a dedicated "reset" state

3. **Pagination Index**
   - Backend uses 0-indexed pages
   - URL uses 0-indexed for consistency
   - Pagination component should handle display (1, 2, 3) but send 0, 1, 2

---

## 🎉 Summary

All components are now properly integrated with:

- ✅ URL-based state management
- ✅ Full filtering and sorting via `fetchTripsForBooking`
- ✅ Proper callback props
- ✅ Search functionality from home page
- ✅ Responsive design (basic)

The booking system is ready for testing and further refinement!
