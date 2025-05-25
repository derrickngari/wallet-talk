function parseExpenseText(text) {
    const lowerText = text.toLowerCase();

    // Match amount like: "cash 500", "500 shillings", "spent 300"
    const amountMatch = lowerText.match(/(?:cash\s*)?(\d+)(?:\s*(?:shillings|ksh|sh))?/i);
    const amount = amountMatch ? parseInt(amountMatch[1]) : null;

    // Match category: "on food", "on transport"
    const categoryMatch = lowerText.match(/on\s+(\w+)/i);
    const category = categoryMatch ? categoryMatch[1] : "general";

    return {
        type: "expense",
        amount,
        category,
        description: text.trim(),
        currency: "KES"
    };
}

function parseIncomeText(text) {
    const lowerText = text.toLowerCase();

    // Match amount like: "received 500", "got 500", "500 shillings", "shillings 500"
    const amountMatch = lowerText.match(/(\d+)\s*(?:shillings|ksh|sh)?|(?:shillings|ksh|sh)\s*(\d+)/i);
    const amount = amountMatch
        ? parseInt(amountMatch[1] || amountMatch[2])
        : null;

    // Match category like: "from job", "from freelance"
    const categoryMatch = lowerText.match(/from\s+(\w+)/i);
    const category = categoryMatch ? categoryMatch[1] : "general";

    return {
        type: "income",
        amount,
        category,
        description: text.trim(),
        currency: "KES"
    };
}

export function startSpeechRecognition(callback) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.error("Speech recognition not supported in this browser");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript.toLowerCase();
        console.log("Transcript:", transcript);

        let data;

        if (transcript.includes("spent") || transcript.includes("bought") || transcript.includes("paid")) {
            data = parseExpenseText(transcript);
        } else if (transcript.includes("earned") || transcript.includes("received") || transcript.includes("got")) {
            data = parseIncomeText(transcript);
        } else {
            data = {
                type: "unknown",
                amount: null,
                description: transcript,
                currency: "KES"
            };
        }

        console.log("Parsed data:", data);
        callback(data);
    };

    recognition.onerror = (e) => {
        console.error("Speech recognition error:", e.error);
    };

    recognition.start();
}
