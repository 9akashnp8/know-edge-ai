import { IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function AskButton({onClick}) {

    return (
        <IconButton onClick={(e) => onClick()}>
            <SendIcon color='primary'  />
        </IconButton>
    )
}