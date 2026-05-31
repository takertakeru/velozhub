# React MVP Frontend Template

> 🚀 A modern, production-ready React template for building MVPs quickly and efficiently.

This template provides everything you need to start building a React application with authentication, analytics, monitoring, and a complete design system - all configured and ready to go!

## What's Included

- **React 19** - Latest React with modern features
- **TypeScript 5.7** - Full type safety with strict configuration
- **Vite 6** - Lightning-fast development and builds
- **TanStack Router** - Type-safe, file-based routing
- **TanStack Query** - Server state management with caching
- **Tailwind CSS 4** - Modern styling with custom design system
- **React Aria Components** - Accessible UI primitives
- **Storybook** - Component documentation and testing

## Getting Started

### Step 1: Use This Template

1. Click the **"Use this template"** button at the top of this repository
2. Choose **"Create a new repository"**
3. Give your project a name (e.g., `my-awesome-app`)
4. Choose if you want it public or private
5. Click **"Create repository from template"**

### Step 2: Clone Your New Repository

```bash
# Replace 'your-username' and 'your-repo-name' with your actual values
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### Step 3: Install Dependencies

> ⚠️ **Important**: This project uses **yarn** as the package manager. Do not use npm.

```bash
yarn install
```

If you don't have yarn installed:

```bash
# macOS
brew install yarn

# Windows (using Chocolatey)
choco install yarn

# Or install globally with npm
npm install -g yarn
```

### Step 4: Set Up Environment Variables

Copy the example environment file:

```bash
# macOS/Linux
cp .env.sample .env.local

# Windows (Command Prompt)
copy .env.sample .env.local

# Windows (PowerShell)
Copy-Item .env.sample .env.local
```

### Step 5: Initial Configuration

Your `.env.local` file should look like this to get started:

```bash
# .env.local
VITE_API_URL="http://localhost:8000"
VITE_COGNITO_POOL_ID=          # Leave empty for now
VITE_COGNITO_CLIENT_ID=        # Leave empty for now
VITE_COGNITO_DOMAIN=           # Leave empty for now

# Analytics  (Leave empty - console logging works by default)
VITE_PUBLIC_POSTHOG_KEY=
VITE_PUBLIC_POSTHOG_HOST=
```

> 📝 **Note**: Analytics work out of the box using console logging. You don't need to configure PostHog or other services initially. When you're ready for production analytics, ask your team lead for the appropriate credentials.

### 🔐 Choosing an auth provider

Pick one at project setup by editing `src/features/auth/provider.ts`. Both implementations conform to the same `AuthProvider` interface, so nothing else in the app changes.

- **`apiAuthProvider`** (default) — Your own backend, cookie-based. Backend sets an `HttpOnly` session cookie; the frontend never sees a token.
- **`cognitoAuthProvider`** — AWS Cognito via Amplify. Requires `VITE_COGNITO_POOL_ID`, `VITE_COGNITO_CLIENT_ID`, `VITE_COGNITO_DOMAIN`.

If you use `apiAuthProvider`, your backend must implement the endpoints documented in `src/features/auth/providers/api-provider.ts` (login, logout, me, signup, password reset). Session cookie should be `HttpOnly` + `Secure` in production.

#### Switching to `cognitoAuthProvider`

1. Provision a Cognito user pool with an app client configured for `USER_PASSWORD_AUTH`.
2. Fill in `VITE_COGNITO_POOL_ID` / `VITE_COGNITO_CLIENT_ID` / `VITE_COGNITO_DOMAIN`.
3. In `src/features/auth/provider.ts`, replace `apiAuthProvider` with `cognitoAuthProvider`.

### Component / Layout Previews

The template ships with two component-showcase routes that are useful while developing the design system:

- `/preview` — UI primitives (buttons, inputs, dialogs, etc.)
- `/layout-preview` — full sidebar / navbar layout demo

These routes are **dev-only**. They return 404 in any `vite build` output (staging or production), so you don't need to manually delete them before deploying.

### Step 6: Start Development

```bash
yarn dev
```

Your app will be available at [http://localhost:3000](http://localhost:3000)

### Step 7: Verify Everything Works

✅ Check that the development server started without errors  
✅ Visit [http://localhost:3000](http://localhost:3000) in your browser  
✅ Open browser developer tools (F12) - you should see analytics events in the console  
✅ Try navigating between pages

## 🔄 Keeping Your Template Updated

As we improve this template, you'll want to pull in those updates. **Always use Pull Requests** - never merge directly to main.

### First Time Setup

Add the original template as a remote source:

```bash
git remote add template https://github.com/original-username/mvp-frontend.git
git remote -v  # Verify it was added
```

### Pulling Template Updates (Always via PR)

```bash
# 1. Fetch latest changes from template
git fetch template

# 2. Create a new branch for the update
git checkout -b update-template-$(date +%Y%m%d)

# 3. Merge template changes
git merge template/main --allow-unrelated-histories

# 4. Resolve any conflicts in VS Code (see below)
# 5. Test everything works
yarn dev

# 6. Push branch and create Pull Request
git push origin update-template-$(date +%Y%m%d)
```

Then create a Pull Request in GitHub and **request review from your team lead**.

### Handling Merge Conflicts in VS Code

When conflicts occur, VS Code will show them clearly:

1. **Open VS Code** - conflicted files will be highlighted
2. **Click on conflicted files** - VS Code shows a 3-way merge view
3. **Use VS Code's merge conflict UI**:
   - Click "Accept Current Change" (your project's version)
   - Click "Accept Incoming Change" (template's version)
   - Click "Accept Both Changes" (merge both)
   - Or manually edit the result

**Common conflicts and what to keep:**

- `package.json` - Keep your project name, accept new dependencies
- `README.md` - Keep your project-specific content
- `.env.local` - Keep your configuration values

```bash
# After resolving all conflicts in VS Code
git add .
git commit -m "Merge template updates - resolved conflicts"
git push origin update-template-$(date +%Y%m%d)
```

> ⚠️ **Important**: Don't merge the PR yourself! Your team lead should review and merge template updates.

## 🛠️ Development Commands

All commands use **yarn** (never use npm with this project):

```bash
# Start development server (port 3000)
yarn dev

# Build for production
yarn build

# Preview production build locally
yarn serve

# Run tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run component documentation
yarn storybook

# Type checking (find TypeScript errors)
npx tsc --noEmit
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Design system components (DON'T MODIFY,unless specfied)
│   └── layouts/        # Page layout components
├── features/           # Feature-specific components
│   └── auth/          # Authentication components
├── libs/              # Shared utilities and configurations
│   ├── analytics/     # PostHog analytics setup
│   ├── api/          # HTTP client configuration
│   └── query/        # React Query configuration
├── routes/            # File-based routing
│   ├── __root.tsx    # Root layout (wraps all pages)
│   ├── (authenticated)/  # Protected routes (require login)
│   └── (unauthenticated)/ # Public routes (login, signup)
└── main.tsx          # App entry point
```

### Where to Add Your Code

- **New pages**: Add files to `src/routes/`
- **New components**: Add to `src/components/` or feature folders
- **Business logic**: Create new folders in `src/features/`

### Files You Shouldn't Modify (As a Junior Dev)

- `src/components/ui/` - Design system components
- `src/libs/` - Core library configurations
- `vite.config.js`, `tsconfig.json` - Build configurations

## Design System

The design system is built on **Tailwind CSS 4** with a two-tier token architecture configured in `src/styles.css`. This system provides consistent styling across all components while remaining flexible for customization.

### Token Architecture

**System Tokens** - Foundation-level design decisions defined in the `@theme` block:

- Raw color palettes (50-950 scales for each color family)
- Typography scales with font sizes and line heights
- Spacing, border radius, and layout primitives

**Component Tokens** - Higher-level semantic tokens that inherit from system tokens:

- Brand colors (`--color-brand-primary`, `--color-brand-success`, etc.)
- Surface styling (`--color-surface-background`, `--radius-surface`)
- Control styling (`--color-control-border`, `--radius-control`)

### Color System

The color system uses **OKLCH color space** for better perceptual uniformity and supports six semantic color families:

- **Primary** - Main brand color
- **Accent** - Secondary brand color
- **Neutral** - Text, borders, and backgrounds
- **Success** - Positive states and confirmations
- **Warning** - Cautionary messaging
- **Danger** - Errors and destructive actions
- **Info** - Informational content

Each color family includes full 50-950 scales designed to work seamlessly across both light and dark modes, covering **80% of typical color use cases**. The scales provide semantic variants (text, border, muted, subtle, bold, inverse) that automatically adapt to theme changes.

### Typography Scale

Five distinct typography categories with consistent sizing:

- **Metric** - Large display numbers and statistics (2rem - 3.25rem)
- **Heading** - Page and section headers (2.25rem - 6rem)
- **Title** - Component and card titles (1.25rem - 2.5rem)
- **Label** - Form labels and UI text (0.75rem - 1.125rem)
- **Paragraph** - Body text and descriptions (0.75rem - 1.125rem)

All scales include matched line-height values for optimal readability and should **not be modified** unless absolutely necessary for brand requirements.

### Component Integration

The design system integrates seamlessly with **React Aria Components** through component tokens:

- Surface components use `--color-surface-*` and `--radius-surface` tokens
- Interactive controls use `--color-control-*` and `--radius-control` tokens
- Button components inherit from `--radius-btn` (maps to control radius)
- Layout components use standardized spacing through `--spacing-surface-*` tokens

### Customization Guidelines

**For Non-Designers:**

1. **Use Component Tokens First** - Before reaching for system tokens, check if component tokens already provide what you need
2. **Modify System Tokens for Global Changes** - Want a different primary color? Update the `--color-primary-*` scale
3. **Create New Component Tokens** - For new components, define semantic tokens that inherit from the system
4. **Avoid Hardcoded Values** - Always reference design tokens rather than arbitrary CSS values
5. **Test Across Themes** - Verify your changes work consistently across different theme configurations

**Key Customization Points:**

- Color families can be replaced by updating the OKLCH values in system tokens
- Component spacing and borders are controlled through surface and control token groups
- Layout behavior is managed through sidebar and surface padding variables

**Typography Warning:** The typography scales are carefully calibrated for readability and visual hierarchy. Modifying them can break the design system's consistency and should only be done for critical brand requirements.

The system is designed to maintain visual consistency even when customized, as component tokens automatically inherit changes from system tokens.

## Feature Folders

### Organization Pattern

Feature folders group related components, hooks, and logic together.
Each feature should be self-contained with its own API calls, types, and components.
Example: `src/features/auth/` contains login forms, auth hooks, and Cognito integration.

### Creating New Features

- Add new folders under `src/features/` for major app sections.
  Include `components/`, `hooks/`, and `api/` subfolders as needed.
- Keep feature-specific logic isolated from shared utilities in `src/libs/`.

## Routing

### How to Write Routes

- Create a `.tsx` file in the routes folder - TanStack Router will automatically scaffold the route structure.
- Add `requireAuth` imported from `auth` feature in the `beforeLoad` for protected routes that need authentication. by default routes files inside `src/routes/(authenticated)/` are protected.

### Where to Create Routes

- Add files in `src/routes/(authenticated)/` for protected pages requiring login.
- Add files in `src/routes/(unauthenticated)/` for public pages like login/signup.
  See [TanStack Router docs](https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing) for complete file conventions.

## API Integration

### Creating API Endpoints

- Use `builder()` with feature-based query keys and Zod schemas for type safety
- Define `payload` and `response` schemas for automatic request/response validation
- Organize endpoints in feature folders (e.g., `src/features/auth/api/endpoints.ts`)

```typescript
// src/features/users/api/endpoints.ts
import { z } from "zod";
import { api } from "@/libs/api/api";
import { builder } from "@/libs/query/query-kit";

export const UserService = builder("users", {
  getProfile: builder.query(
    {
      payload: z.object({ userId: z.string() }),
      response: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
      }),
    },
    () => ({
      fetcher: (payload) => api.get(`/users/${payload.userId}`),
    })
  ),
});
```

### Query Patterns

- Use `builder.query()` for GET requests, `builder.mutation()` for POST/PUT/DELETE
- Use `builder.infiniteQuery()` for paginated data with automatic page management
- Access hooks via `ServiceName.endpointName.useQuery()` or `useMutation()`

### Error Handling

- API errors are automatically structured with `status` and `statusText` properties
- Use `getErrorMessage()` utility for consistent error display in UI
- Errors integrate with toast notifications through the global error boundary

### Pagination Support

- Use `toPaginatedResponseSchema()` schema helper for standardized pagination structure
- Built-in `paginatedParamsSchema` for page/perPage query parameters
- Infinite queries handle `hasNext`/`hasPrevious` logic automatically

### Best Practices

- Keep API endpoints organized by feature with consistent naming conventions
- Always define both request and response Zod schemas for full type safety
- Use the `api` client for requests

## Analytics & Monitoring

The template includes analytics that work out of the box using PostHog's recommended [object] [verb] naming:

```tsx
import { useAnalytics } from "@/libs/analytics";

function MyComponent() {
  const analytics = useAnalytics();

  const handleButtonClick = () => {
    // PostHog best practice: [object] [verb] format
    analytics.track("button clicked", {
      location: "header",
      text: "Sign Up",
    });

    // More examples:
    analytics.track("user signed up", { method: "email" });
    analytics.track("project created", { template: "react" });
    analytics.track("page viewed", { page: "dashboard" });
  };

  return <button onClick={handleButtonClick}>Sign Up</button>;
}
```

**What happens by default:**

- Events are logged to console for development
- Clean [object] [verb] event naming should be followed
- No external service setup required initially
- IntelliSense shows best practices in JSDoc

### Production Analytics Setup

When ready for production analytics, ask your **team lead** for:

- PostHog credentials (gets optimized $pageview events automatically)
- Other monitoring service credentials

Your team should already have these services configured - you just need the environment variables.

## 🐛 Troubleshooting

### "Command not found: yarn"

**Solution**: Install yarn globally

```bash
npm install -g yarn
```

### Development server won't start

1. Check if port 3000 is already in use
2. Try a different port: `yarn dev --port 3001`

### TypeScript errors

Run the type checker to see detailed errors:

```bash
yarn typecheck
```

### Build fails

1. Fix any TypeScript errors first
2. Check that all environment variables are set

### Analytics not working

1. **Check browser console** (F12) - analytics events should appear there
2. Verify the analytics service is initialized (check console messages)
3. If using production analytics credentials, verify they're correct in `.env.local`

## Important Notes

- **Always use yarn**: Never mix npm and yarn in this project
- **Environment variables**: Never commit `.env.local` to git (it's already in .gitignore)
- **Package manager**: The project is configured for yarn - using npm may cause issues
- **Node version**: Use Node 18+ for best compatibility
- **VS Code Recommended**: This template assumes VS Code for merge conflict resolution

## Team Collaboration

- **Junior Developers**: Follow this README for setup, create PRs for template updates
- **Team Leads**: Review and merge template update PRs, manage production credentials
- **Production Services**: Team leads should provide analytics/monitoring credentials when ready

---

**Happy coding!** 🎉 If you run into issues, check the troubleshooting section above or create an issue in this repository.
