import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/constants"

export default function Documents() {
    const [documents, setDocuments] = useState(null);

    async function getAllDocuments() {
        const response = await fetch(`${API_BASE_URL}/allfiles/`)
        if (response.ok) {
            const docs = await response.json()
            setDocuments(docs);
        }
    }

    useEffect(() => {
        getAllDocuments()
    }, [])

    return (
        <Paper>
            <h1>All Documents</h1>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Document</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {documents?.map((row) => (
                            <TableRow
                                key={row.name}
                            >
                                <TableCell component="th" scope="row">{row.name}</TableCell>
                                <TableCell>{row.id}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}