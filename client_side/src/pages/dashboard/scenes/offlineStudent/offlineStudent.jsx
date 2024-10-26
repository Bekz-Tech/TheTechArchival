import {useState, useEffect} from "react";
import TableComponent from "../../../../components/table";
import { collection, getDocs } from "firebase/firestore"; // Firestore functions
import { db } from "../../../../firebase/config"; // Make sure to import your Firebase config



const OfflineStudentTable = () => {
    const [codes, setLocalCodes] = useState([]); // Local state for handling codes
    const [sortBy, setSortBy] = useState("generatedDate"); // Sorting state
    const [sortDirection, setSortDirection] = useState("asc");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
  // Table columns
  const columns = [
    { id: "code", label: "Code" },
    { id: "generatedDate", label: "Generated Date" },
    { id: "generatedTime", label: "Generated Time" },
    {
      id: "used",
      label: "Used",
      renderCell: (row) => (row.used ? "Yes" : "No"),
    },
    {
      id: "usedDate",
      label: "Used Date",
      renderCell: (row) => (row.usedDate ? row.usedDate : "N/A"),
    },
    {
      id: "usedTime",
      label: "Used Time",
      renderCell: (row) => (row.usedTime ? row.usedTime : "N/A"),
    },
  ];

   useEffect(() => {
     // Fetch codes from Firestore when the component mounts
     const fetchCodes = async () => {
       const querySnapshot = await getDocs(collection(db, "codes"));
       let storedCodes = querySnapshot.docs.map((doc) => doc.data());

       // Sort the codes by generated date and time (newest first)
       storedCodes.sort((a, b) => {
         const dateA = new Date(`${a.generatedDate} ${a.generatedTime}`);
         const dateB = new Date(`${b.generatedDate} ${b.generatedTime}`);
         return dateB - dateA; // Sort by descending order
       });

       setLocalCodes(storedCodes); // Update local state
     };

     fetchCodes();
   }, []);
  
  return (
    <TableComponent
      columns={columns}
      tableHeader="Generated Codes"
      data={codes}
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortChange={(columnId) => {
        const isAsc = sortBy === columnId && sortDirection === "asc";
        setSortDirection(isAsc ? "desc" : "asc");
        setSortBy(columnId);
      }}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={(event, newPage) => setPage(newPage)}
      onRowsPerPageChange={(event) =>
        setRowsPerPage(parseInt(event.target.value, 10))
      }
    />
  );
};

export default OfflineStudentTable;
