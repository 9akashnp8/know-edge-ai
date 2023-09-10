import { Paper } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function Root() {

    return (
        <Paper square>
            <Outlet />
        </Paper>

    );
}
