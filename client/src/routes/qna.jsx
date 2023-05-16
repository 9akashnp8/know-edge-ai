import { useState } from "react"

import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { Paper } from "@mui/material";

import document from "../../../files/google.pdf";
import AskButton from "../../components/AskButton";
import { darkTheme } from "../main";

export default function QnA() {
    const [question, setQuestion] = useState("")
    const [loading, setLoading] = useState(false)
    const [answer, setAnswer] = useState("")

    async function handleSubmit() {
        setLoading(true)
        const resp = await fetch('http://127.0.0.1:8000/api/query/?collection_name=google.pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ query: question })
        })
        if (resp.status == 200) {
            const queryAnswer = await resp.json()
            setAnswer(queryAnswer.response)
            setQuestion("")
            setLoading(false)
        }
    }
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
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
                        flexDirection: 'column'
                    }}
                >
                    <TextField
                        id="question"
                        label="Question"
                        multiline
                        maxRows={4}
                        onChange={(e) => setQuestion(e.target.value)}
                        InputProps={{
                            endAdornment: !loading ? <AskButton onClick={handleSubmit} /> : <CircularProgress />
                        }}
                    />
                    <div style={{ flexGrow: 1 }}>
                        {
                            answer
                                ? (
                                    <Paper
                                        elevation={0}
                                        sx={{ p: 2, mt: 2 }}
                                    >
                                        {answer}
                                    </Paper>
                                )
                                : ''
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}