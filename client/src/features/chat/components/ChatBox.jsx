// Hooks and other functions
import { useState } from "react";
import { useTheme } from "@mui/material";

// UI Components
import ChatInput from "./ChatInput"
import ChatMessagesWindow from "./ChatMessagesWindow"


export default function ChatBox() {
    const theme = useTheme();
    const [chatResponse, setChatResponse] = useState('')

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
                <ChatMessagesWindow chatResponse={chatResponse} />
                <ChatInput setChatResponse={setChatResponse} />
            </div>
        </div>
    )
}
