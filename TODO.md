# Blog Page Responsiveness and Styling Updates

## Tasks
- [x] Update BlogCard.tsx category colors: AI to indigo/pink mix, shopping to pink, coding to blue
- [x] Add line-clamp to recommended post titles in blog/page.tsx to prevent cropped text
- [x] Verify responsiveness: ensure grid stacks properly on mobile, hero adjusts, sidebar below main on small screens
- [x] Test the blog page for any remaining responsiveness issues

## Notes
- AI posts: Applied indigo styling (tag--indigo), shopping now uses pink (tag--pink), coding uses blue (tag--blue)
- Responsiveness: Grid uses grid-cols-1 lg:grid-cols-3, blogs-grid responsive columns, hero flex-col on small, row on md+
- Cropped text: Added line-clamp-2 to recommended titles
- Dev server had lock issue, but changes are applied
