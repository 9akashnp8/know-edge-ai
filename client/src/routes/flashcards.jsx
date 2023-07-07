import { useState } from "react"
import { useSearchParams } from "react-router-dom";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import FlashCard from "../../components/FlashCard";
import { darkTheme } from "../main";

export default function Flashcards() {
    const [topic, setTopic] = useState("");
    const [flashcards, setFlashcards] = useState([]);
    const [searchParams] = useSearchParams();

    async function handleSubmit(event) {
        event.preventDefault();
        const fileName = searchParams.get('fileName')
        const resp = await fetch(`http://127.0.0.1:8000/api/flashcard/?fileName=${fileName}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: topic })
        })

        if (resp.status == 200) {
            const fcs = await resp.json()
            setFlashcards(fcs)
        }
    }

    return (
        <div
            style={{
                backgroundColor: darkTheme.palette.divider,
                width: '100%',
                minHeight: '93vh',
                padding: '1.25rem',
                borderRadius: '1rem'
            }}
        >
            <Box pb={2}>
                <form method="POST" onSubmit={handleSubmit}>
                    <Stack spacing={2} direction={'row'}>
                        <TextField
                            id="topic"
                            variant="outlined"
                            size="small"
                            label={searchParams.get('fileName')}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                        <Button variant="contained" type="submit">Generate</Button>
                    </Stack>
                </form>
            </Box>
            <Divider/>
            <Box pt={2}>
                <Grid container spacing={2}>
                    {flashcards.response ? flashcards.response.map((card) => {
                        return (
                            <Grid item xs={4}>
                                <FlashCard data={card} />
                            </Grid>
                        )
                    }) : ''}
                </Grid>
            </Box>
        </div>
    )
}