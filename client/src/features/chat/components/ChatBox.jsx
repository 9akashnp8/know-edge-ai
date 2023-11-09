// Hooks and other functions
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { sendMessage } from "../../api/functions";
import { eventSourceWrapper } from "../../api/functions";

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
        sendMessage(question)
    };

    useEffect(() => {
        let msg = ''
        eventSourceWrapper((data, eventType) => {
        setResponseLoading(false)
        if (eventType == 'end') {
            const payload = { user: "system", message: msg }
            setMessageHistory([...messageHistory, payload]);
            setChatResponse("")
        } else {
            msg += data
            setChatResponse(msg)
        }
        })
    }, [messageHistory])

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
