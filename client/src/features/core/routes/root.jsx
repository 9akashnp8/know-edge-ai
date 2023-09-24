import { Paper } from "@mui/material";
import { Outlet } from "react-router-dom";

import BreadCrumb from "../components/BreadCrumb";

export default function Root() {

    return (
        <Paper square sx={{ padding: '20px'}}>
            <BreadCrumb />
            <Outlet />
        </Paper>

    );
}
