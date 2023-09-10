import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import { Link } from 'react-router-dom';

import { useState, useEffect } from "react";
import { useTheme } from '@mui/material';

import { API_BASE_URL } from "../../../utils/constants"
import PrimaryButton from '../../core/components/PrimaryButton';
import SecondaryButton from '../../core/components/SecondaryButton';
import TertiaryButton from '../../core/components/TertiaryButton';

export default function Documents() {
    const theme = useTheme()
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
    }, [setDocuments])

    return (
            <Table
                component={Paper}
                sx={{
                    backgroundColor: theme.palette.background.default,
                    height: 'calc(100vh - 40px)' ,
                    display: 'block',
                    overflowY: 'scroll',
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell align='center'>Document</TableCell>
                        <TableCell align='center'>Created Date</TableCell>
                        <TableCell align='center'>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {documents?.map((row) => (
                        <TableRow
                            key={row.name}
                            hover
                        >
                            <TableCell align='center'>{row.name}</TableCell>
                            <TableCell align='center'>
                                {new Date(row.created_at).toDateString()}
                            </TableCell>
                            <TableCell align='center'>
                                <Stack direction={'row'} spacing={2} justifyContent={'center'}>
                                    <Link to={`chat?fileName=${row.name}`} style={{ textDecoration: 'none' }}>
                                        <PrimaryButton>Chat</PrimaryButton>
                                    </Link>
                                    <Link to={`flashcards?fileName=${row.name}`} style={{ textDecoration: 'none' }}>
                                        <SecondaryButton>Flashcards</SecondaryButton>
                                    </Link>
                                    <Link to={`delete?fileName=${row.name}`} style={{ textDecoration: 'none' }}>
                                        <TertiaryButton accentColor={'#B21D38'} >Delete</TertiaryButton>
                                    </Link>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
    );
}