# Website styling

The React website uses Tailwind CSS 4 through `@tailwindcss/vite`.

`src/tailwind.css` imports the Tailwind theme and utilities and defines shared
tokens: `font-display` (Cormorant Garamond), `font-body` (Montserrat), `text-brand`, `text-accent`, `text-muted`,
and `bg-cream`. It also holds the shared readability and card layout rules.

Page and component stylesheets use `@reference` to access that theme and
`@apply` to compose Tailwind utilities under the existing component selectors.
This preserves responsive breakpoints, state selectors, and the current layout.
New components can also use Tailwind utilities directly in `className`.

Native CSS remains for complex backgrounds, decorative shapes, borders,
transitions, and properties where the original expression is clearer.
Preflight is omitted because the website already defines its global reset.

Run `npm run build` and `npm run lint` after styling changes.

Reusable UI components live in `src/components/ui`, the source-root equivalent
of the shadcn `components/ui` convention. Keep reusable presentation and interaction
here; page-specific catalogue data belongs in wrappers such as
`src/components/FeaturedCarousel.tsx`. The coverflow carousel uses the existing
React, TypeScript, Tailwind, React Router, and React Icons dependencies and does
not need additional providers or a shadcn CLI installation.

The final brand palette is applied in `src/jewellery-theme.css`: ivory
#FFFAF0, cream #FFF5DC, teal #174C43, body #514B44, headings #26231F,
and prices #765A3D.
