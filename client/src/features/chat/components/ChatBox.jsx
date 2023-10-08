// Hooks and other functions
import { useState } from "react";
import { useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { getStreamingResponse } from "../../api/functions";

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
        setMessageHistory([...messageHistory, { user: 'user', message: question }]);
        dispatch(setMessage(""))
        setResponseLoading(true)
        getResponse(question)
    };

    async function getResponse(message) {
        const body = JSON.stringify({ "message": message })
        const reader = getStreamingResponse(body)

        let streamingResponse = "";
        while (true) {
            let { value, done } = await reader.read()
            if (done) {
                setMessageHistory((prevmessageHistory) => [
                    ...prevmessageHistory,
                    { user: 'system', message: streamingResponse }
                ]);
                setChatResponse('');
                setResponseLoading(false)
                break
            }

            const pattern = /data: /;
            if (Boolean(value.match(pattern))) {
                value = value.replace(pattern, "")
                streamingResponse += value
            }
            setChatResponse(streamingResponse);
        }
    }

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
