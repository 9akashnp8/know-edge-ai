// Hooks and other functions
import { setMessage } from "../chatSlice";
import { useDispatch, useSelector } from "react-redux";

// Material UI Components
import TextField from "@mui/material/TextField"
import CircularProgress from "@mui/material/CircularProgress";

// Internal UI Components
import AskButton from "./AskButton";

export default function ChatInput({ loading, handleClickSendMessage }) {
    const dispatch = useDispatch();
    const chatMessage = useSelector((state) => state.chatMessage)

    return (
        <TextField
            id="chat"
            label="Chat"
            multiline
            maxRows={4}
            sx={{ mt: 3 }}
            value={chatMessage}
            onChange={(e) => { dispatch(setMessage(e.target.value)) }}
            InputProps={{
                endAdornment: !loading
                    ? <AskButton onClick={() => handleClickSendMessage(chatMessage)} />
                    : <CircularProgress />
            }}
        />
    )
}
