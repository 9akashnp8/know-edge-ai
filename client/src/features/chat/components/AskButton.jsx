import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function AskButton({onClick}) {

    return (
        <IconButton onClick={(e) => onClick()}>
            <SearchIcon />
        </IconButton>
    )
}