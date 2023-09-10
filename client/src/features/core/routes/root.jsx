import { Paper } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function Root() {

    return (
        <Paper square sx={{ padding: '20px', height: 'calc(100vh - 40px)'}}>
            <Outlet />
        </Paper>

    );
}
