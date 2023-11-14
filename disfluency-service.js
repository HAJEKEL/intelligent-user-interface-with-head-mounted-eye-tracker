// disfluency-service.js
class DisfluencyService {
    constructor() {
        this.disfluencies = [
            // Include all 50 disfluencies here
            "Hmm, let's consider.",
            "Well, the way I see it.",
            "Now, if I may.",
            "Actually, to put it another way.",
            "Strategically speaking.",
            "Just a second, thinking aloud here.",
            "Hold on, let me reflect on that.",
            "From a broader perspective.",
            "In light of our discussions.",
            "Before we move forward.",
            "Let me ponder that for a moment.",
            "Reflecting on this, I'd say.",
            "Let me frame this properly.",
            "Now, from my understanding.",
            "Considering what's at stake.",
            "Weighing this carefully.",
            "Before I answer that.",
            "Taking a moment to consider.",
            "Regarding this matter.",
            "In terms of our approach.",
            "From my point of view.",
            "Thinking this through.",
            "Just a moment, evaluating this.",
            "Given what we know.",
            "Now, let me be thoughtful here.",
            "In terms of strategy.",
            "Before responding, let me consider.",
            "Analyzing this briefly.",
            "From a high-level point of view.",
            "Taking a strategic view on this.",
            "Considering the broader implications.",
            "Pondering over this aspect.",
            "In alignment with our goals.",
            "From my position.",
            "Now, let me think carefully.",
            "Taking into account what we've discussed.",
            "Contemplating this carefully.",
            "In consideration of our objectives.",
            "Reflecting on our priorities.",
            "From a tactical perspective.",
            "Before I give my perspective.",
            "Given our strategic direction.",
            "Carefully considering this.",
            "In view of our goals.",
            "From a leadership point of view.",
            "Regarding our long-term strategy.",
            "Let me thoughtfully respond.",
            "In the context of our discussion.",
            "Contemplating from a CEO's standpoint.",
            "Weighing in on this topic."
        ];
        this.shuffleDisfluencies();
    }

    shuffleDisfluencies() {
        for (let i = this.disfluencies.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.disfluencies[i], this.disfluencies[j]] = [this.disfluencies[j], this.disfluencies[i]];
        }
    }

    getNextDisfluency() {
        return this.disfluencies.length > 0 ? this.disfluencies.pop() : "";
    }

    resetDisfluencies() {
        this.disfluencies = [
            // Reinitialize all 50 disfluencies here
            // Include all 50 disfluencies here
            "Hmm, let's consider.",
            "Well, the way I see it.",
            "Now, if I may.",
            "Actually, to put it another way.",
            "Strategically speaking.",
            "Just a second, thinking aloud here.",
            "Hold on, let me reflect on that.",
            "From a broader perspective.",
            "In light of our discussions.",
            "Before we move forward.",
            "Let me ponder that for a moment.",
            "Reflecting on this, I'd say.",
            "Let me frame this properly.",
            "Now, from my understanding.",
            "Considering what's at stake.",
            "Weighing this carefully.",
            "Before I answer that.",
            "Taking a moment to consider.",
            "Regarding this matter.",
            "In terms of our approach.",
            "From my point of view.",
            "Thinking this through.",
            "Just a moment, evaluating this.",
            "Given what we know.",
            "Now, let me be thoughtful here.",
            "In terms of strategy.",
            "Before responding, let me consider.",
            "Analyzing this briefly.",
            "From a high-level point of view.",
            "Taking a strategic view on this.",
            "Considering the broader implications.",
            "Pondering over this aspect.",
            "In alignment with our goals.",
            "From my position.",
            "Now, let me think carefully.",
            "Taking into account what we've discussed.",
            "Contemplating this carefully.",
            "In consideration of our objectives.",
            "Reflecting on our priorities.",
            "From a tactical perspective.",
            "Before I give my perspective.",
            "Given our strategic direction.",
            "Carefully considering this.",
            "In view of our goals.",
            "From a leadership point of view.",
            "Regarding our long-term strategy.",
            "Let me thoughtfully respond.",
            "In the context of our discussion.",
            "Contemplating from a CEO's standpoint.",
            "Weighing in on this topic."        ];
        this.shuffleDisfluencies();
    }
}

module.exports = { DisfluencyService };
