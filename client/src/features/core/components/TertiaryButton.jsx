import { styled } from "@mui/material";
import { BaseButton } from "./PrimaryButton";

const TertiaryButtonBase = styled(BaseButton)(({ theme, accentColor }) => ({
    color: accentColor,
    border: '1px solid black',
    '&:hover': {
        border: `1px solid ${accentColor}`
    }
}))

export default function TertiaryButton({ children, ...props }) {
    return (
        <TertiaryButtonBase {...props}>
            {children}
        </TertiaryButtonBase>
    )
}