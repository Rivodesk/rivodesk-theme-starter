# Theme Zone

Files in `src/theme/` are the **editable frontend zone**.
The AI theme editor may only modify files within this directory.

## Structure
- `src/theme/components/` — Reusable UI components
- `src/theme/templates/` — Full page templates
- `src/theme/styles/theme.css` — CSS variables & global styles

## Off-limits (backend)
- `src/app/api/` — API routes, do not modify
- `src/lib/` — Supabase client & types, do not modify
- `src/app/layout.tsx` — Root layout, do not modify
- `src/app/**/page.tsx` — Page wrappers, do not modify
