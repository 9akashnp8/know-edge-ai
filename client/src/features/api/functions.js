import { API_BASE_URL } from "../../utils/constants";

/**
 * Return reader that streams the event-stream
 * response from backend
 */
export async function getStreamingResponse(message) {
    const response = await fetch(`${API_BASE_URL}/stream`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
        },
        body: JSON.stringify({ "message": message })
    })
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
    return reader;
}
