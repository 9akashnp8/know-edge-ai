// Hooks and other functions
import { useState } from "react";
import { useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { fetchEventSource } from "@microsoft/fetch-event-source";

// UI Components
import ChatInput from "./ChatInput"
import { setMessage } from "../chatSlice";
import ChatMessagesWindow from "./ChatMessagesWindow"


export default function ChatBox() {
    const theme = useTheme();
    const dispatch = useDispatch()
    const [chatResponse, setChatResponse] = useState('')
    const [messageHistory, setMessageHistory] = useState([]);
    const [responseLoading, setResponseLoading] = useState(false);
    
    function handleClickSendMessage (question) {
        const controller = new AbortController()
        const { signal } =  controller
        setMessageHistory([...messageHistory, { user: 'user', message: question }]);
        dispatch(setMessage(""))
        setResponseLoading(true)
        fetchEventSource("http://localhost:8000/api/stream", {
            method: "POST",
            headers: {
                "Accept": "text/event-stream",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "message": question }),
            onopen: ((response) => {
                console.log(`Connection Opened: ${response.status}`)
            }),
            onerror: (_) => {
                controller.abort()
                throw new Error()
            },
            onmessage: (ev) => {
                const message = ev.data
                setChatResponse((prev) => prev += message)
            },
            onclose: () => {
                console.log("Connection Closed")
                setResponseLoading(false)
                controller.abort()
            },
            signal: signal,
        })
    };

    return (
        <div
            style={{
                backgroundColor: theme.palette.background.default,
                width: '50%',
                padding: '1.25rem',
                borderRadius: '0 1rem 1rem 0'
            }}
        >
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    flexDirection: 'column',
                }}
            >
                <ChatMessagesWindow
                    messageHistory={messageHistory}
                    chatResponse={chatResponse}
                />
                <ChatInput
                    loading={responseLoading}
                    handleClickSendMessage={handleClickSendMessage}
                />
            </div>
        </div>
    )
}
