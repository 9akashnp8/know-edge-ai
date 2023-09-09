import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export default function FileNotFound() {
    return (
        <Paper
        style={{
            width: '50%',
            borderRadius: '1rem 0 0 1rem',
            textAlign: 'center'
        }}
        >
            <Typography variant='h5' pt={5}>File Not Found</Typography>
        </Paper>
    )
}