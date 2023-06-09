import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import TablePagination from '@mui/material/TablePagination';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useContext } from 'react';
import UserAuthContext from '../context/UserAuthContext';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const MyUrls = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const { token } = useContext(UserAuthContext);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const summarizeOptions = [
        { code: null, label: 'None' },
        { code: 'url', label: 'URL' },
        { code: 'base_url', label: 'Base URL' },
        { code: 'short_url', label: 'Short URL' },
    ];

    const [summarizeBy, setSummarizeBy] = useState(null);
    const [columns, setColumns] = React.useState([]);
    const [rows, setRows] = React.useState([]);

    const updateSummarizeBy = (e) => {
        setSummarizeBy(e.target.value);
    }

    const columnNameMap = { "url": "URL", "short_url": "Short URL", "base_url": "Base URL", "createdAt": "Created At", "count": "Count" };

    useEffect(() => {
        (async () => {
            if (summarizeBy) {
                try {
                    const headers = {
                        Authorization: `Bearer ${token}`,
                    }
                    const response = await axios.post(`/user/summarise/${summarizeBy}`, {}, { headers });
                    const data = response.data;
                    setRows(data)
                    setColumns(Object.keys(data[0]).map((column) => ({
                        code: column,
                        label: columnNameMap[column]
                    })));
                }
                catch (e) { }
            }
            else {
                try {
                    const headers = {
                        Authorization: `Bearer ${token}`,
                    }
                    const response = await axios.post("/user/my_urls", {}, { headers });
                    const data = response.data;
                    setRows(data)
                    setColumns(Object.keys(data[0]).map((column) => ({
                        code: column,
                        label: columnNameMap[column]
                    })));
                }
                catch (e) { }
            }
        })();
    }, [summarizeBy, token]);

    const getReadableDate = (dateStr) => {
        const dateObj = new Date(dateStr);
        const options = {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZone: "Asia/Kolkata"
        };
        const formattedDate = dateObj.toLocaleString("en-US", options);
        return formattedDate
    }

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" gutterBottom>
                    <strong>Summarize By</strong>
                </Typography>
                <Select
                    value={summarizeBy}
                    onChange={updateSummarizeBy}
                    displayEmpty
                    style={{ marginLeft: '1.5vw', height: '4.5vh' }}

                >
                    {summarizeOptions.map((option, index) => (
                        <MenuItem key={index} value={option.code}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </div><br></br>
            <TableContainer sx={{
                width: '100%',
                maxWidth: '72vw',
                margin: '0 auto',
                '@media (max-width: 700px)': {
                    maxWidth: '100%',
                },
            }} component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <StyledTableRow>
                            {columns.map((column, index) => (
                                <StyledTableCell align={index === 0 ? "left" : "right"}>{column.label}</StyledTableCell>
                            ))}
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                            <StyledTableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {columns.map((col, index) => (
                                    <StyledTableCell align={index === 0 ? "left" : "right"} component="th" scope="row">{columns[index].code === "createdAt" ? getReadableDate(row[columns[index].code]) : row[columns[index].code]}</StyledTableCell>
                                ))}
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
}
export default MyUrls;