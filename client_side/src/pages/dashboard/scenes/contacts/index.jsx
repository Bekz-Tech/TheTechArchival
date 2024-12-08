import React, { useState } from 'react';
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import TableComponent from "../../../../components/table"; // Make sure this path is correct
import { mockDataContacts } from "../../data/mockData";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns = [
    { id: "id", label: "ID", flex: 0.5 },
    { id: "registrarId", label: "Registrar ID" },
    {
      id: "name",
      label: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      id: "age",
      label: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      id: "phone",
      label: "Phone Number",
      flex: 1,
    },
    {
      id: "email",
      label: "Email",
      flex: 1,
    },
    {
      id: "address",
      label: "Address",
      flex: 1,
    },
    {
      id: "city",
      label: "City",
      flex: 1,
    },
    {
      id: "zipCode",
      label: "Zip Code",
      flex: 1,
    },
  ];

  const handleSortChange = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
  };

  const tableProps = {
    columns,
    tableHeader: "List of Contacts for Future Reference",
    data: mockDataContacts,
    sortBy,
    sortDirection,
    onSortChange: handleSortChange,
    page,
    rowsPerPage,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
    onRowClick: handleRowClick,
  };

  return (
    <Box m="20px">
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
      <Box m="40px 0 0 0" height="75vh">
        <TableComponent {...tableProps} />
      </Box>
    </Box>
  );
};

export default Contacts;
