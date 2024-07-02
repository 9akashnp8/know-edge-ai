// Hooks and other functions
import { fetchEventSource } from "@microsoft/fetch-event-source";

// Material UI Components
import TextField from "@mui/material/TextField"
import CircularProgress from "@mui/material/CircularProgress";

// Internal UI Components
import AskButton from "./AskButton";
import { useState } from "react";

export default function ChatInput({ setChatResponse }) {
    const [ chatMessage, setChatMessage ] = useState()
    const [ loading, setLoading ] = useState()
    const messageHistory = JSON.parse(localStorage.getItem("messageHistory") || "[]")

    function handleClickSendMessage (question) {
        const controller = new AbortController()
        const { signal } =  controller
        localStorage.setItem(
            "messageHistory",
            JSON.stringify(
                [...messageHistory, { user: 'user', message: question }]
            )
        )
        setLoading(true)
        fetchEventSource("http://localhost:8000/api/stream", {
            method: "POST",
            headers: {
                "Accept": "text/event-stream",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "message": question }),
            onerror: (_) => {
                controller.abort()
                throw new Error()
            },
            onmessage: (ev) => {
                const message = ev.data
                if (ev.event == "message") {
                    setChatResponse(message)
                } else if (ev.event == "end") {
                    const currMessageHistory = JSON.parse(localStorage.getItem("messageHistory"))
                    const systemMessage = { user: 'system', message: message }
                    localStorage.setItem("messageHistory", JSON.stringify([...currMessageHistory, systemMessage]))
                }
            },
            onclose: () => {
                setLoading(false)
                controller.abort()
            },
            signal: signal,
        })
    };

    return (
        <TextField
            id="chat"
            label="Chat"
            multiline
            disabled={loading}
            maxRows={4}
            sx={{ mt: 3 }}
            value={chatMessage}
            onChange={(e) => { setChatMessage(e.target.value) }}
            InputProps={{
                endAdornment: !loading
                    ? <AskButton onClick={() => handleClickSendMessage(chatMessage)} />
                    : <CircularProgress />
            }}
        />
    )
}
