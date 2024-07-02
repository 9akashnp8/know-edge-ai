
import Button from "@mui/material/Button"


export default function PrimaryButton({ children, ...props }) {
    return (
        <Button color='primary' variant='contained' {...props}>
            {children}
        </Button>
    )
}