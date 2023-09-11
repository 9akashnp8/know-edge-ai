import { styled } from '@mui/system';
import { ButtonBase } from '@mui/material';

export const BaseButton = styled(ButtonBase)(({ theme, variant }) => ({
    padding: variant === 'small' ? '6px' : '10px',
    borderRadius: '6px'
}))

const PrimaryButtonBase = styled(BaseButton)(({ theme }) => ({
    color: 'black',
    border: '1px solid black',
    '&:hover': {
        border: '1px solid white'
    },
    backgroundColor: theme.palette.primary.main,
}))

export default function PrimaryButton({ children, ...props }) {
    return (
        <PrimaryButtonBase {...props}>
            {children}
        </PrimaryButtonBase>
    )
}