# Screenshot Checklist

Take screenshots after deploying the app to production. Save all images to `public/screenshots/`.

## Browser Settings
- Use Chrome or Firefox in incognito/private mode
- Disable browser extensions (they add extra HTML attributes)
- Clear any cached data before capturing

## Recommended Sizes

| Device | Resolution |
|--------|------------|
| Desktop | 1440 × 900 |
| Mobile | 390 × 844 (iPhone 14) |

## Screenshots to Capture

### 1. Landing Page — Hero Section (`landing.png`)
- Full hero area showing tagline, CTA buttons, and mockup
- See the gradient background and product preview
- Desktop 1440×900

### 2. Dashboard with Demo Data (`dashboard.png`)
- Logged in as demo@clariodocs.com
- Show stats cards, usage progress bar, charts, recent documents
- Full page scroll capture

### 3. Upload Page (`upload.png`)
- Show drag & drop area with the info card below
- Also capture the file selected state with "Upload & Analyze" button visible

### 4. Document Analysis Page (`document-analysis.png`)
- Open one of the seed documents (e.g., "Software Development Contract.pdf")
- Show the full analysis: summary, key points, risks, actions, keywords
- Make sure suggested questions are visible
- Capture the full page

### 5. Document Chat (`document-chat.png`)
- Scroll to the chat section of a document
- Ask a question like "What are the main risks?" 
- Wait for AI response
- Capture the chat with both user message and AI response visible
- Show suggested question buttons above the chat

### 6. Pricing Page (`pricing.png`)
- Logged in (so current plan is visible)
- Show all 3 plan cards with Pro highlighted
- Full section visible

### 7. Admin Dashboard (`admin.png`)
- Logged in as admin@clariodocs.com
- Show stat cards, pie chart, bar chart, recent users, recent documents
- Full page scroll

### 8. Mobile Landing Page (optional — `mobile-landing.png`)
- iPhone 14 size (390×844)
- Show the hero section and navigation

### 9. Mobile Dashboard (optional — `mobile-dashboard.png`)
- iPhone 14 size
- Show dashboard on mobile with sidebar closed

## After Capturing

1. Save as PNG files in `public/screenshots/`
2. Verify the filenames match the README paths:
   - `landing.png`
   - `dashboard.png`
   - `document-analysis.png`
   - `document-chat.png`
   - `pricing.png`
   - `admin.png`
3. Rebuild the app to confirm images load correctly:
   ```bash
   npm run build
   ```
4. The README will automatically show them in the Screenshots section
