import Button from "@mui/material/Button"

export default function SecondaryButton({ children, ...props }) {
    return (
        <Button color="primary" variant="outlined" {...props}>
            {children}
        </Button>
    )
}