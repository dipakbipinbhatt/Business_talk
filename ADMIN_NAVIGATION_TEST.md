# Admin Navigation Testing Guide

## All Admin Buttons & Links - Complete Test Checklist

### ✅ Dashboard Navigation (Main Tabs)
1. **Podcasts Tab** - Click to view podcasts list
2. **Blogs Tab** - Click to view blogs list  
3. **Calendar Link** - Click to open calendar view
4. **Import Tab** - Click to import podcasts
5. **About Tab** - Click to edit About Us content
6. **Settings Tab** - Click to configure settings
7. **Inbox Tab** - Click to view contact messages

### ✅ Create New Buttons
1. **Add Podcast Button** (Podcasts Tab)
   - Location: Top right of podcasts list
   - Route: `/admin/podcast/new`
   - Should open: Podcast creation form

2. **Add Blog Button** (Blogs Tab)
   - Location: Top right of blogs list
   - Route: `/admin/blog/new`
   - Should open: Blog creation form

3. **Create First Podcast Link** (Empty State)
   - Shows when no podcasts exist
   - Route: `/admin/podcast/new`

4. **Create First Blog Link** (Empty State)
   - Shows when no blogs exist
   - Route: `/admin/blog/new`

### ✅ Edit Buttons
1. **Edit Podcast** (Each podcast row)
   - Icon: Pencil/Edit icon
   - Route: `/admin/podcast/edit/{id}`
   - Should open: Podcast edit form with pre-filled data

2. **Edit Blog** (Each blog row)
   - Icon: Pencil/Edit icon
   - Route: `/admin/blog/edit/{id}`
   - Should open: Blog edit form with pre-filled data

### ✅ Delete Buttons
1. **Delete Podcast** - Trash icon, shows confirmation dialog
2. **Delete Blog** - Trash icon, shows confirmation dialog
3. **Delete Message** - Trash icon in inbox

### ✅ Reports & Analytics
1. **Google Analytics Dashboard** (Settings Tab)
   - Shows when GA ID is configured
   - Links to external Google Analytics
   - Quick links: Real-time, Acquisition, Engagement, Demographics

2. **Stats Cards** (Each Tab)
   - Podcasts: Total, Upcoming, Past counts
   - Blogs: Total, Published, Drafts counts
   - Inbox: Total, Unread, Read, Archived counts

### ✅ Other Navigation
1. **View Site** - Header link to public site
2. **Logout** - Header button
3. **Back to Dashboard** - In all forms

## How to Test

### Test 1: Create New Podcast
1. Go to Admin Dashboard
2. Click "Podcasts" tab
3. Click "Add Podcast" button (top right)
4. Should navigate to `/admin/podcast/new`
5. Form should be empty and ready for input

### Test 2: Edit Existing Podcast
1. Go to Admin Dashboard → Podcasts tab
2. Find any podcast in the list
3. Click the Edit icon (pencil)
4. Should navigate to `/admin/podcast/edit/{id}`
5. Form should be pre-filled with podcast data

### Test 3: Create New Blog
1. Go to Admin Dashboard
2. Click "Blogs" tab
3. Click "Add Blog" button (top right)
4. Should navigate to `/admin/blog/new`
5. Form should be empty with rich text editor

### Test 4: Calendar Navigation
1. Go to Admin Dashboard
2. Click "Calendar" button in tab navigation
3. Should navigate to `/admin/calendar`
4. Should show calendar view

### Test 5: Reports/Analytics
1. Go to Admin Dashboard
2. Click "Settings" tab
3. Scroll to "Analytics Dashboard" section
4. If GA ID configured: Should show analytics widget
5. Click "Open Full Dashboard" - Opens Google Analytics in new tab

## Common Issues & Solutions

### Issue: Buttons Don't Navigate
**Solution**: Check browser console for errors. Ensure:
- React Router is properly initialized
- HashRouter is wrapping the app
- No JavaScript errors blocking navigation

### Issue: 404 Not Found
**Solution**: 
- Using HashRouter, so URLs should be `/#/admin/podcast/new`
- Check that all routes are defined in App.tsx
- Clear browser cache and reload

### Issue: Form Not Loading Data (Edit Mode)
**Solution**:
- Check network tab for API call
- Verify podcast/blog ID exists in database
- Check authentication token is valid

### Issue: Reports Not Showing
**Solution**:
- Verify Google Analytics ID is configured in Settings
- ID should start with "G-" (GA4 format)
- Check that ID is saved in database

## Expected Behavior

✅ **All buttons should work without page refresh** (SPA behavior)
✅ **Navigation should be instant** (client-side routing)
✅ **Forms should load quickly** (< 1 second)
✅ **Edit forms should pre-fill data** (from API)
✅ **Create forms should be empty** (new entry)
✅ **Back buttons should return to dashboard** (with data intact)

## Browser Compatibility
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ IE11 (Not supported - use modern browser)
