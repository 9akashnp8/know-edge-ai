import { useState, useCallback, useEffect } from "react"
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useSearchParams } from "react-router-dom";

import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import FileNotFound from "../../components/FileNotFound";
import AskButton from "../../components/AskButton";
import ChatMessage from "../../components/ChatMessage";
import { darkTheme } from "../main";
import { API_BASE_URL } from "../utils/constants";

export default function Chat() {
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [messageHistory, setMessageHistory] = useState([]);
    const [hasFetchedDocument, setHasFetchedDocument] = useState(false);
    const [fileUrl, setFileUrl] = useState('');
    const [searchParams] = useSearchParams();

    const { sendMessage, lastMessage } = useWebSocket('ws://localhost:8000/api/ws/');
    const handleClickSendMessage = useCallback(() => {
        setMessageHistory((prev) => prev.concat({ user: 'user', message: { data: question } }))
        sendMessage(question)
        setQuestion("")
        setLoading(true)
    }, [question, setMessageHistory]);

    /**
     * Get document from server
     * @param {string} fileName - the filename (including ".pdf")
     * present in the query param.
     */
    async function getDocument(fileName) {
        try {
            const response = await fetch(`${API_BASE_URL}/getfile/?file_name=${fileName}`)
            if (response.ok) {
                const document = await response.blob()
                setFileUrl(URL.createObjectURL(document))
            } else if (response.status == 400) {
                console.log("File Not Found")
            } else {
                console.log("Error when fetching file")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat({ user: 'system', message: lastMessage }));
            setLoading(false)
        }
        if (!hasFetchedDocument) {
            getDocument(searchParams.get('fileName'));
            setHasFetchedDocument(true);
        }
    }, [lastMessage, setMessageHistory, hasFetchedDocument]);

    return (
        <div style={{ display: 'flex', height: '93vh' }}>
            {
                fileUrl
                    ? (
                        <embed
                            src={fileUrl}
                            type="application/pdf"
                            frameBorder="0"
                            scrolling="auto"
                            style={{
                                width: '50%',
                                borderRadius: '1rem 0 0 1rem'
                            }}
                        ></embed>
                    )
                    : <FileNotFound />
            }
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
                            <ChatMessage key={idx} messager={message.user} >
                                {message ? message.message.data : null}
                            </ChatMessage>
                        ))}
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