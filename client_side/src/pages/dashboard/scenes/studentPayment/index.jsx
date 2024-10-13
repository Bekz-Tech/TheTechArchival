import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import useStudentData from "../dashboard/student/useStudentData";

const StudentPayment = ({ payments = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { outstandings } = useStudentData(); // Destructure outstandings from the custom hook

  // Get total outstanding and paid amounts
  const { totalOutstanding, amountPaid } = outstandings;

  // Calculate total amount due
  const totalAmount = totalOutstanding + amountPaid;

  // Calculate payment percentage
  const paymentPercentage = totalAmount > 0 ? (amountPaid / totalAmount) * 100 : 0;

  return (
    <Box m="20px">
      <Header title="Payment History" subtitle="Overview of Payments Made" />

      <Box backgroundColor={colors.primary[400]} p="20px" borderRadius="4px">
        <Typography variant="h5" fontWeight="600" mb="15px">
          Payment Summary
        </Typography>
        <Box mb="20px">
          <Typography variant="h6" mb="5px">
            Total Amount Due: ₦{totalAmount.toFixed(2)}
          </Typography>
          <Typography variant="h6" mb="5px">
            Total Paid: ₦{amountPaid.toFixed(2)}
          </Typography>
          <Typography variant="h6" mb="15px">
            Payment Percentage: {paymentPercentage.toFixed(2)}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={paymentPercentage}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: colors.grey[300],
              "& .MuiLinearProgress-bar": {
                backgroundColor: colors.greenAccent[500],
              },
            }}
          />
        </Box>

        <Typography variant="h5" fontWeight="600" mb="15px">
          Payment History
        </Typography>
        {payments.map((payment, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">Payment Date: {payment.date}</Typography>
              <Typography>Amount: ₦{payment.amount.toFixed(2)}</Typography>
              <Typography>Method: {payment.method}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

// PropTypes for validating props
StudentPayment.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      amount: PropTypes.number,
      method: PropTypes.string.isRequired,
    })
  ),
};

export default StudentPayment;
