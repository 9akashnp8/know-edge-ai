import { styled } from '@mui/system';
import { BaseButton } from "./PrimaryButton";

const SecondaryButtonBase = styled(BaseButton)(({ theme }) => ({
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    '&:hover': {
        color: 'black',
        backgroundColor: theme.palette.primary.main,
    }
}))

export default function SecondaryButton({ children, ...props }) {
    return (
        <SecondaryButtonBase {...props}>
            {children}
        </SecondaryButtonBase>
    )
}