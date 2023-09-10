import { createTheme } from '@mui/material/styles';
import { green, grey } from '@mui/material/colors';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#b8dbd9',
        },
        secondary: {
            main: '#bb0a21'
        },
        text: {
            primary: '#fff',
            secondary: '#646968',
        },
        background: {
            default: '#222327',
            paper: '#000000',
        }
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#b8dbd9",
                    },
                }
            }
        }
    }
})