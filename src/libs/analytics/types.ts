/**
 * Analytics Types and Interfaces
 * Simplified, flexible event tracking with progressive type safety.
 */

/**
 * Interface for typed analytics events.
 *
 * Teams can augment this interface to add type safety using PostHog's [object] [verb] format:
 *
 * @example
 * ```typescript
 * declare module '@/libs/analytics' {
 *   interface AnalyticsEventMap {
 *     'user signed up': {
 *       method: 'email' | 'google' | 'github';
 *       source?: 'homepage' | 'pricing' | 'blog';
 *     };
 *     'project created': {
 *       template: 'react' | 'vue' | 'angular';
 *       visibility: 'public' | 'private';
 *     };
 *     'button clicked': {
 *       location: string;
 *       button_text?: string;
 *     };
 *   }
 * }
 * ```
 */
export interface AnalyticsEventMap {
  // Empty by default - teams can augment for type safety
}
export type AnalyticsStrategy = {
  readonly name: string;
  initialize: (config: Record<string, unknown>) => Promise<void> | void;
  track: (event: string, properties?: Record<string, unknown>) => void;
  identify: (userId: string, properties?: Record<string, unknown>) => void;
  clearIdentity: () => void;
  isReady: () => boolean;
  cleanup?: () => void;
};

// Main Analytics Client Interface
export type AnalyticsClient = {
  /**
   * Track user events and actions.
   *
   * @param event - Event name using PostHog's [object] [verb] format (e.g., 'user signed up', 'project created').
   * @param properties - Optional event properties as key-value pairs.
   * @example
   * ```typescript
   * // PostHog recommended format: [object] [verb]
   * analytics.track('user signed up', {method: 'email', source: 'homepage'});
   * analytics.track('project created', {template: 'react', plan: 'premium'});
   * analytics.track('button clicked', {location: 'header', text: 'Get Started'});
   * analytics.track('page viewed', {page: 'dashboard', section: 'overview'});
   * analytics.track('invite sent', {recipient_type: 'team_member'});
   * analytics.track('file uploaded', {type: 'image', size_mb: 2.5});
   *
   * // Good object examples: user, project, button, page, invite, file, form, payment
   * // Good verb examples: signed up, created, clicked, viewed, sent, uploaded, submitted, completed
   *
   * // Avoid these patterns:
   * analytics.track('click'); // ❌ Missing object
   * analytics.track('signup'); // ❌ Missing object, use 'user signed up'
   * analytics.track('userSignedUp'); // ❌ Use spaces, not camelCase
   * analytics.track('button_clicked'); // ❌ Use spaces, not snake_case
   * ```
   *
   * **PostHog Best Practices:**
   * - Use [object] [verb] format: 'user signed up', 'project created'
   * - Use lowercase with spaces: 'button clicked' not 'Button_Clicked'
   * - Be specific about the object: 'signup button clicked' not just 'button clicked'
   * - Use past tense for verbs: 'created' not 'create'
   * - Include context in properties: {location: 'header', text: 'Sign Up'}
   */
  track: {
    <K extends keyof AnalyticsEventMap>(
      event: K,
      properties: AnalyticsEventMap[K],
    ): void;
    (event: string, properties?: Record<string, unknown>): void;
  };

  /**
   * Identify a user and set their properties.
   *
   * @param userId - Unique identifier for the user.
   * @param properties - Optional user properties.
   * @example
   * ```typescript
   * // When user logs in or signs up
   * analytics.identify('user_123', {
   *   name: 'John Doe',
   *   email: 'john@example.com',
   *   plan: 'premium',
   *   signup_date: '2024-01-15',
   *   team_size: 5
   * });
   *
   * // Update user properties later
   * analytics.identify('user_123', {plan: 'enterprise'});
   * ```
   *
   * **PostHog Best Practices:**
   * - Call once when user logs in or signs up
   * - Use consistent userId across sessions
   * - Include relevant user attributes for segmentation
   * - Don't include sensitive data (passwords, SSNs, etc.)
   * - Use snake_case for property keys for consistency
   */
  identify: (userId: string, properties?: Record<string, unknown>) => void;

  /**
   * Clear the current user identity and session data.
   *
   * @example
   * ```typescript
   * // Call when user logs out
   * analytics.clearIdentity();
   *
   * // Then track the logout event
   * analytics.track('user logged out');
   * ```
   *
   * **PostHog Best Practices:**
   * - Always call on user logout
   * - Call before identifying a new user
   * - Ensures clean session boundaries
   * - Consider tracking 'user logged out' event after clearing identity
   */
  clearIdentity: () => void;
};

// Generic Configuration
export type AnalyticsConfig = {
  enabled: boolean;
  debug: boolean;
};

// Context Value
export type AnalyticsContextValue = AnalyticsClient;
