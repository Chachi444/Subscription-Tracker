import aj from '../config/arcjet.js';
import { isSpoofedBot } from "@arcjet/inspect";

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 1 });
        console.log("Arcjet decision", decision);
        
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ error: "Too Many Requests" });
            } else if (decision.reason.isBot()) {
                return res.status(403).json({ error: "No bots allowed" });
            } else {
                return res.status(403).json({ error: "Forbidden" });
            }
        } else if (decision.ip.isHosting()) {
            // Requests from hosting IPs are likely from bots, so they can usually be
            // blocked. However, consider your use case - if this is an API endpoint
            // then hosting IPs might be legitimate.
            return res.status(403).json({ error: "Forbidden" });
        } else if (decision.results.some(isSpoofedBot)) {
            // Paid Arcjet accounts include additional verification checks using IP data.
            // Verification isn't always possible, so we recommend checking the decision
            // separately.
            return res.status(403).json({ error: "Forbidden" });
        } else {
            // Request is allowed, continue to next middleware
            next();
        }

    } catch (error) {
        console.log(`Arcjet Middleware Error: ${error}`);
        next(error);
    }
};

export default arcjetMiddleware;