import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { useState } from 'react';

export default function FlashCard({ data }) {
    const [ displayData, setDisplayData ] = useState(data ? data.q : 'This is a question')
    const [ isViewingAnswer, setIsViewingAnswer ] = useState(false)

    function handleViewAnswer() {
        setDisplayData(data ? data.a : 'Unknown Answer, Bad Flashcard')
        setIsViewingAnswer(true)
    }

    function handleHideAnswer() {
        setDisplayData(data ? data.q : null)
        setIsViewingAnswer(false)
    }

    return (
        <Box sx={{ maxWidth: 275, minWidth: 'content' }}>
            <Card variant="outlined">
                <div style={{ display: 'grid', placeItems: 'center', padding: '2rem'}}>
                    <Typography mb={3}>{displayData}</Typography>
                    {!isViewingAnswer ? <button type='button' onClick={handleViewAnswer}>View</button> : <button type='button' onClick={handleHideAnswer}>Hide</button>}
                    
                </div>
            </Card>
        </Box>
    )
}