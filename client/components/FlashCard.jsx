import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { useState } from 'react';

/**
 * Flashcard component that renders question on one
 * side and answer behind it
 * @param {Object} data - the question and answer
 * object
 * @returns 
 */
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
        <Box sx={{
            maxWidth: 275,
            minWidth: 'content',
            padding: '5px'
        }}>
            <Card variant="outlined" sx={{borderRadius: '1rem',minHeight: 160}}>
                <div style={{ display: 'grid', placeItems: 'center', padding: '2rem'}}>
                    <Typography mb={3}>{displayData}</Typography>
                    {!isViewingAnswer ? <button type='button' onClick={handleViewAnswer}>View</button> : <button type='button' onClick={handleHideAnswer}>Hide</button>}
                    
                </div>
            </Card>
        </Box>
    )
}