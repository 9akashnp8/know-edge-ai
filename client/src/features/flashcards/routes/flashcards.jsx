import { useState } from "react"
import { useSearchParams } from "react-router-dom";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

import FlashCard from "../components/FlashCard";
import { darkTheme } from "../../../main";
import SecondaryButton from "../../core/components/SecondaryButton";
import PrimaryButton from "../../core/components/PrimaryButton";

export default function Flashcards() {
    const [topic, setTopic] = useState("");
    const [flashcards, setFlashcards] = useState([]);
    const [isDownloadable, setIsDownloadable] = useState(false);
    const [searchParams] = useSearchParams();

    async function handleSubmit(event) {
        event.preventDefault();
        const fileName = searchParams.get('fileName')
        const resp = await fetch(`http://127.0.0.1:8000/api/flashcard/?fileName=${fileName}&mock=True`, {
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
            setIsDownloadable(true)
        }
    }

    return (
        <div style={{ padding: '20px' }}>
            <div
                style={{
                    backgroundColor: darkTheme.palette.divider,
                    padding: '20px',
                    height: '88vh',
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
                            <PrimaryButton variant="contained" type="submit">Generate</PrimaryButton>
                            {isDownloadable
                                ? (
                                    <SecondaryButton
                                        sx={{ marginLeft: 'auto !important' }}
                                        href={`data:text/json;charset=utf-8,${encodeURIComponent(
                                            JSON.stringify(flashcards, null, '\t')
                                        )}`}
                                        download="filename.json"
                                    >
                                        Download
                                    </SecondaryButton>
                                )
                                : null
                            }
                        </Stack>
                    </form>
                </Box>
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
        </div>
    )
}