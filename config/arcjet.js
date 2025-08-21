import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY, NODE_ENV } from "./env.js";

const aj = arcjet({
  // Get your site key from https://app.arcjet.com and set it as an environment
  // variable rather than hard coding.
  key: ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: NODE_ENV === "production" ? "LIVE" : "DRY_RUN" }),
    // Create a bot detection rule
    detectBot({
      mode: NODE_ENV === "production" ? "DRY_RUN" : "DRY_RUN", // Use DRY_RUN in production to avoid blocking legitimate traffic
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        "CATEGORY:MONITOR", // Uptime monitoring services
        "CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
        "CATEGORY:API", // API clients
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE",
      // Tracked by IP address by default, but this can be customized
      // See https://docs.arcjet.com/fingerprints
      //characteristics: ["ip.src"],
      refillRate: 2, // Refill only 2 tokens per interval
      interval: 60, // Refill every 60 seconds (1 minute)
      capacity: 5, // Bucket capacity of 5 tokens only
    }),
  ],
});

export default aj;