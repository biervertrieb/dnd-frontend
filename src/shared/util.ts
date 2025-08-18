import removeMd from "remove-markdown";

export function snip(
    text?: string,
    maxLength?: number,
    options: {
        preserveWords?: boolean;
        suffix?: string;
    } = {}
): string {
    const {
        preserveWords = true,
        suffix = "..."
    } = options;
    text = text ?? "";
    maxLength = maxLength ?? 160;

    const stripped = removeMd(text);

    if (stripped.length <= maxLength)
        return stripped;

    let truncated = stripped.substring(0, maxLength);

    if (preserveWords) {
        const lastSpace = truncated.lastIndexOf(' ');
        const lastNewline = truncated.lastIndexOf('\n');
        const lastBoundary = Math.max(lastSpace, lastNewline);

        if (lastBoundary > maxLength * 0.75) {
            truncated = truncated.substring(0, lastBoundary);
        }
    }

    return truncated.trim() + suffix;
}
