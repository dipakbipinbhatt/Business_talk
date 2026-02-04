# Duplicate Podcasts Fix

## Issue
Podcasts were appearing twice on both the Home page and Podcasts page. The same podcast episodes were being displayed multiple times in the list.

## Root Cause
The backend API was returning duplicate podcast entries, likely due to:
1. Database containing duplicate records with the same content but different `_id` values
2. Or pagination logic returning the same podcasts across different pages

## Solution Implemented
Added client-side duplicate filtering based on unique `_id` to prevent the same podcast from appearing multiple times.

### Changes Made

#### 1. Podcasts Page (`frontend/src/pages/Podcasts.tsx`)
- **Initial Fetch**: Added duplicate filtering when loading initial podcasts
- **Load More**: Added duplicate filtering when loading more podcasts via pagination

```typescript
// Remove duplicates based on _id
const uniquePodcasts = newPodcasts.filter((podcast: Podcast, index: number, self: Podcast[]) =>
    index === self.findIndex((p: Podcast) => p._id === podcast._id)
);
```

#### 2. Home Page (`frontend/src/pages/Home.tsx`)
- **Upcoming Podcasts Initial**: Added duplicate filtering
- **Upcoming Podcasts Load More**: Added duplicate filtering
- **Past Podcasts Initial**: Added duplicate filtering
- **Past Podcasts Load More**: Added duplicate filtering

### How It Works
The duplicate filtering uses the JavaScript `filter()` method combined with `findIndex()` to:
1. Iterate through all podcasts in the array
2. For each podcast, find the first occurrence with the same `_id`
3. Only keep the podcast if its index matches the first occurrence
4. This ensures only unique podcasts (by `_id`) are kept

### Logging
Added console logging to track how many duplicates are being removed:
```
[Podcasts] Got X/Y past podcasts (removed Z duplicates)
```

## Testing
After this fix:
- ✅ No duplicate podcasts should appear on the Home page
- ✅ No duplicate podcasts should appear on the Podcasts page
- ✅ Pagination should work correctly without duplicates
- ✅ Search results should not contain duplicates

## Future Recommendations
While this client-side fix prevents duplicates from being displayed, it's recommended to:
1. **Investigate the database** for duplicate podcast entries
2. **Fix the backend API** to ensure it doesn't return duplicates
3. **Add unique constraints** in the database schema if needed
4. **Review pagination logic** in the backend controller

## Files Modified
- `frontend/src/pages/Podcasts.tsx`
- `frontend/src/pages/Home.tsx`
