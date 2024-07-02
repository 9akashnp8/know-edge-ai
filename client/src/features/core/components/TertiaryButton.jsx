import { Button } from "@mui/material"

export default function TertiaryButton({ children, ...props }) {
    return (
        <Button color="secondary" variant="outlined" {...props}>
            {children}
        </Button>
    )
}