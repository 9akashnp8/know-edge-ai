import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { Link } from 'react-router-dom';

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
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Document</TableCell>
                            <TableCell align='center'>Created Date</TableCell>
                            <TableCell align='right'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {documents?.map((row) => (
                            <TableRow
                                key={row.name}
                                hover
                            >
                                <TableCell>{row.name}</TableCell>
                                <TableCell align='center'>
                                    {new Date(row.created_at).toDateString()}
                                </TableCell>
                                <TableCell align='right'>
                                    <Stack direction={'row'} spacing={2} justifyContent={'flex-end'}>
                                        <Link to={`/chat?fileName=${row.name}`} style={{ textDecoration: 'none' }}>
                                            <Button variant="contained">Chat</Button>
                                        </Link>
                                        <Link to={`/flashcards?fileName=${row.name}`} style={{ textDecoration: 'none' }}>
                                            <Button variant="contained">Flashcards</Button>
                                        </Link>
                                        <Link to={`/delete?fileName=${row.name}`} style={{ textDecoration: 'none' }}>
                                            <Button variant="outlined" color="error">Delete</Button>
                                        </Link>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}