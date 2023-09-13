import { useState, useCallback, useEffect } from "react"
import { useSearchParams } from "react-router-dom";
import { useTheme } from "@mui/material";

import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import FileNotFound from "../../core/components/FileNotFound";
import AskButton from "../components/AskButton";
import ChatMessage from "../components/ChatMessage";
import { API_BASE_URL } from "../../../utils/constants";
import { useGetDocumentQuery } from "../../api/apiSlice";

export default function Chat() {
    const theme = useTheme();
    const [searchParams] = useSearchParams();
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [chatResponse, setChatResponse] = useState('')
    const [messageHistory, setMessageHistory] = useState([]);
    const { data, error } = useGetDocumentQuery(searchParams.get('fileName'))

    const handleClickSendMessage = useCallback(() => {
        setMessageHistory([...messageHistory, { user: 'user', message: question }]);
        setQuestion('');
        setLoading(true)
        getResponse(question)
    }, [question, setMessageHistory]);

    /**
     * stream event-stream response received from server,
     * once done, append streamed/final message to messageHistory
     * @param {string} message the user message
     */
    async function getResponse(message) {
        const response = await fetch(`${API_BASE_URL}/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream',
            },
            body: JSON.stringify({ "message": message })
        })
        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()

        let streamingResponse = "";
        while (true) {
            let { value, done } = await reader.read()
            if (done) {
                setMessageHistory((prevmessageHistory) => [
                    ...prevmessageHistory,
                    { user: 'system', message: streamingResponse }
                ]);
                setChatResponse('');
                setLoading(false)
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
        <div style={{ display: 'flex', height: 'calc(100vh - 40px)' }}>
            <embed
                src={data ? URL.createObjectURL(data) : ''}
                type="application/pdf"
                frameBorder="0"
                scrolling="auto"
                style={{
                    width: '95%',
                    borderRadius: '1rem 0 0 1rem'
                }}
            ></embed>
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
                    <div id="scroller" style={{ overflowY: 'auto', paddingRight: '0.5rem' }}>
                        {messageHistory.map((message, idx) => (
                            <ChatMessage key={idx} messager={message.user} >
                                {message ? message.message : null}
                            </ChatMessage>
                        ))}
                        {chatResponse
                            ? (
                                <ChatMessage messager={'system'}>
                                    {chatResponse}
                                </ChatMessage>
                            )
                            : null
                        }

                        <div id="anchor"></div>
                    </div>
                    <TextField
                        id="chat"
                        label="Chat"
                        multiline
                        maxRows={4}
                        sx={{ mt: 3 }}
                        value={question}
                        onChange={(e) => { setQuestion(e.target.value) }}
                        InputProps={{
                            endAdornment: !loading ? <AskButton onClick={handleClickSendMessage} /> : <CircularProgress />
                        }}
                    />
                </div>
            </div>
        </div>
    )
}