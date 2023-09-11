import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import PrimaryButton from '../../core/components/PrimaryButton';
import SecondaryButton from '../../core/components/SecondaryButton';

import { useState } from 'react';

/**
 * Flashcard component that renders question on one
 * side and answer behind it
 * @param {Object} data - the question and answer object
 * @param {string} data.q - the question
 * @param {string} data.a - the answer
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
        <Box
            sx={{
                minWidth: 'content'
            }}
        >
            <Card
                variant="outlined"
                sx={{ borderRadius: '1rem' }}
            >
                <div
                    style={{
                        display: 'grid',
                        placeItems: 'center',
                        padding: '25px',
                        height: 160,
                        overflowY: 'auto'
                    }}
                >
                    <Typography mb={3}>{displayData}</Typography>
                    {!isViewingAnswer
                        ? <PrimaryButton variant="small" onClick={handleViewAnswer}>View</PrimaryButton>
                        : <SecondaryButton variant="small" onClick={handleHideAnswer}>Hide</SecondaryButton>
                    }
                </div>
            </Card>
        </Box>
    )
}