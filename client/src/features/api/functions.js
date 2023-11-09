import { fetchEventSource } from '@microsoft/fetch-event-source';
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

export async function sendMessage(message) {
    const response = await fetch(`${API_BASE_URL}/stream`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ "message": message })
    })
    if (!response.ok) {
        console.error("Failed sending message")
    }
}

export function eventSourceWrapper(cb) {
    fetchEventSource('http://localhost:8000/api/stream', {
        onmessage(ev) {
            cb(ev.data, ev.event)
        },
    })
}