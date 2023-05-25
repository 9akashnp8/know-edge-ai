import { useState, useCallback, useEffect } from "react"
import useWebSocket, { ReadyState } from 'react-use-websocket';

import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import document from "../../../files/google.pdf";
import AskButton from "../../components/AskButton";
import ChatMessage from "../../components/ChatMessage";
import { darkTheme } from "../main";

export default function QnA() {
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [messageHistory, setMessageHistory] = useState([]);

    const { sendMessage, lastMessage } = useWebSocket('ws://localhost:8000/api/ws/');
    const handleClickSendMessage = useCallback(() => {
        setMessageHistory((prev) => prev.concat({user: 'user', message: {data: question}}))
        sendMessage(question)
        setLoading(true)
    }, [question, setMessageHistory]);

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat({user: 'system', message: lastMessage}));
            setLoading(false)
        }
    }, [lastMessage, setMessageHistory]);

    return (
        <div style={{ display: 'flex', height: '93vh' }}>
            <embed
                src={document}
                type="application/pdf"
                frameBorder="0"
                scrolling="auto"
                style={{
                    width: '50%',
                    borderRadius: '1rem 0 0 1rem'
                }}
            ></embed>
            <div
                style={{
                    backgroundColor: darkTheme.palette.divider,
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
                        flexDirection: 'column'
                    }}
                >
                    <div id="scroller" style={{ overflowY: 'auto', paddingRight: '0.5rem' }}>
                        {messageHistory.map((message, idx) => (
                            <ChatMessage key={idx}  messager={message.user} >
                                {message ? message.message.data : null}
                            </ChatMessage>
                        ))}
                        <div id="anchor"></div>
                    </div>
                    <TextField
                        id="question"
                        label="Question"
                        multiline
                        maxRows={4}
                        sx={{mt: 3}}
                        onChange={(e) => setQuestion(e.target.value)}
                        InputProps={{
                            endAdornment: !loading ? <AskButton onClick={handleClickSendMessage} /> : <CircularProgress />
                        }}
                    />
                </div>
            </div>
        </div>
    )
}