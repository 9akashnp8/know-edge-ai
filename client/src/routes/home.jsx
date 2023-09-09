import { Typography } from "@mui/material";
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import Button from '@mui/material/Button';

import { useState } from "react";

import { Link } from 'react-router-dom';

import { startChatCTA, uploadDocumentCTA } from "../utils/theme";

export default function Home() {
    const [loading, setLoading] = useState(false);

    // Upload file and redirect if successfull
    async function handleFileUpload(fileObject) {
        setLoading(true);
        const formData = new FormData();
        formData.append("payload", fileObject, fileObject.name)
        const resp = await fetch('http://127.0.0.1:8000/api/uploadfile/', {
            method: 'POST',
            body: formData
        })
        if (resp.ok) {
            setLoading(false);
            window.location.href = `/chat?fileName=${fileObject.name}`
        }
    }

    return (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
            <Box>
                <Box textAlign={'center'}>
                    <Typography variant="h3" component={"h1"} gutterBottom>
                        Study Smart AI
                    </Typography>
                    <Typography variant="subtitle1" mb={3}>
                        Your personal GPT Assisted Learning Partner!
                    </Typography>
                </Box>
                <Stack direction={'row'} spacing={5}>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileUpload(e.target.files[0])}
                        id="upload-document"
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="upload-document">
                        <Button
                            component={Card}
                            sx={{
                                height: '100%',
                                padding: 2,
                                textTransform: 'none',
                                fontSize: '1rem',
                                color: 'white',
                                backgroundColor: uploadDocumentCTA
                            }}
                        >
                            <Stack direction={'row'} spacing={1}>
                                <UploadFileIcon />
                                <Typography>Upload Document</Typography>
                            </Stack>
                        </Button>
                    </label>
                    <Link to={'/documents'} style={{ textDecoration: 'none' }}>
                        <Button
                            component={Card}
                            sx={{
                                height: '100%',
                                padding: 2,
                                textTransform: 'none',
                                fontSize: '1rem',
                                color: 'white',
                                backgroundColor: startChatCTA
                            }}
                        >
                            <Stack direction={'row'} spacing={1}>
                                <QuestionAnswerIcon />
                                <Typography>Chat & Learn</Typography>
                            </Stack>
                        </Button>
                    </Link>
                </Stack>
            </Box>
        </Box>
    )
}