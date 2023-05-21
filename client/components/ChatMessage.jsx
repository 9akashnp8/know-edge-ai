import { Paper } from "@mui/material";

export default function ChatMessage({ messager, children }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                mt: 2,
                fontSize: '0.75rem',
                backgroundColor: messager == 'system' ? 'black' : 'white',
                color: messager == 'system' ? 'white' : 'black'
            }}
        >
            {children}
        </Paper>
    )
}