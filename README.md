# SonaSathi frontend

React, TypeScript, Vite, React Router, Context API, and React Icons.

## Run

Run `npm install` and `npm run dev`. Use `npm run build` and `npm run lint` for validation.

## Website translation

The announcement bar's English, Bengali, and Hindi selector uses Google Cloud
Translation through `POST /api/translate`. Enable Cloud Translation API in your
Google Cloud project and configure billing. Copy `.env.translation.example` to
`.env.translation` and set `GOOGLE_TRANSLATE_API_KEY`, then run
`npm run translate:server` in a separate terminal. Requires Node.js 22+.
Keep this key on the server; never add
it to a `VITE_` variable. Restrict it to the Cloud Translation API and configure
usage quotas in Google Cloud.

The translation service runs on port 4000 during development; Vite proxies the
endpoint there. In production, route `/api/translate` to this service on the same
origin as the frontend. The selector remembers the chosen language and translates
new page content after navigation. English restores the original text. User-entered
input values are not translated. If Google or the backend is unavailable, a retry
message appears. The old Google Website Translator widget is not used. Run
`npm run test:translation` to verify the service with mocked Google responses.

## Pages

- `/` - homepage and design catalogue.
- `/explore-shops` - five Kolkata dummy stores; search, neighbourhood, collection, and radius filters; nearest/name sorting.
- `/shop/bowbazar-gold-house`
- `/shop/bhowanipore-jewel-studio`
- `/shop/salt-lake-gold-gallery`
- `/shop/diamond-plaza-jewels`
- `/shop/baguiati-heritage-jewellers`

Store pages support native sharing, copy link, and a selectable URL fallback. Public sharing requires deployment to a public domain; localhost links only work on the local computer.

## Product collections

`/jewellery` lists all 52 sample designs. Every screenshot category has its own route at `/jewellery/:category`: `earrings`, `bangles`, `rings`, `bracelets`, `pendants`, `necklaces`, `chains`, `necklace-set`, `pendant-set`, `mangalsutra`, `tika`, `nath`, and `coins`.

The category bar uses React Icons. Nath and Coins appear in the More dropdown. Each category has four sample designs, filters for metal/purity/price/jeweller, price sorting, and wishlist filtering. Filter and sort settings are kept in URL query parameters so they survive refresh. Search uses shared Context state; saved product IDs use local storage. Seven categories use local SVG illustrations rather than photos; all products and prices remain illustrative.

## Jewellery details

Every one of the 52 designs has a stable, shareable URL at `/product/:productId` (for example, `/product/1`). Product images, names, and arrows open the detail page from the homepage, category listings, related designs, and store collections. Each detail page includes an expandable image, indicative price, metal/purity/weight specifications, wishlist controls, native sharing or copy-link fallback, the correct store address and directions, related designs, care information, and the existing demo visit form. Unknown product IDs show a recovery page. Public sharing requires a deployed domain and the same SPA fallback as the other routes.

## Location behaviour

Click Use my current location and allow browser location access. HTTPS or localhost is required. Location stays in Context for this browser session; it is not saved or sent to a backend. Permission denial, unavailable location, and timeouts leave browsing available. Refresh location requests a fresh fix; Clear location removes it. Without location, stores sort by name and distances stay hidden.

Distances use Haversine calculations and approximate neighbourhood pins, so they are straight-line estimates, not driving distances. Google Maps directions use the exact supplied addresses. Replace pins with validated storefront coordinates before using real listings.

All five names are fictional. Addresses were supplied by the user. Photos, designs, prices, and hours are illustrative. Booking is a frontend demo and does not contact stores. Wishlist is saved locally.

## Deployment

Deploy `dist` over HTTPS. Configure the host to serve `index.html` for frontend routes (including `/explore-shops` and `/shop/*`) and serve actual asset files normally. `public/_redirects` supplies this fallback for Netlify-compatible hosts; other hosts need the equivalent history fallback. This allows shared store links and refreshes to work. No backend is needed for these demo pages.
