# Analytics Module

A flexible, type-safe analytics system using the Strategy pattern. Supports multiple providers (PostHog, Console) with a unified API.

### Event Naming Best Practices

The analytics system guides you to use PostHog's recommended format:

```typescript
// ✅ (PostHog [object] [verb] format):
analytics.track("user signed up", { method: "email" });
analytics.track("project created", { template: "react" });
analytics.track("button clicked", { location: "header" });
analytics.track("file uploaded", { type: "image", size_mb: 1.2 });

// ❌ Avoid these patterns:
analytics.track("click"); // Missing object
analytics.track("signup"); // Use 'user signed up'
analytics.track("button_clicked"); // Use spaces, not underscores
```

### Advanced: Type Safety (Optional)

Teams can add type safety through module augmentation:

```typescript
// In your types file
declare module "@/libs/analytics" {
  interface AnalyticsEventMap {
    "user signed up": {
      method: "email" | "google" | "github";
      source?: "homepage" | "pricing";
    };
    "project created": {
      template: "react" | "vue";
      visibility: "public" | "private";
    };
  }
}

// Now you get autocomplete and validation
analytics.track("user signed up", { method: "email" });
```

## Quick Start

### 1. Basic Setup

```tsx
import {
  createAnalytics,
  AnalyticsProvider,
  PostHogStrategy,
} from "@/libs/analytics";

// Wrap your app
function App() {
  return (
    <AnalyticsProvider client={analyticsClient}>
      <YourApp />
    </AnalyticsProvider>
  );
}
```

### 2. Using Analytics in Components

```tsx
import { useAnalytics } from "@/libs/analytics";

function MyComponent() {
  const analytics = useAnalytics();

  const handleClick = () => {
    analytics.track("click", {
      element: "button",
      label: "Sign Up",
      // Add any additional verbose properties
      section: "hero",
      variant: "primary",
    });
  };

  return <button onClick={handleClick}>Sign Up</button>;
}
```
