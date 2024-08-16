import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  useTheme
} from "@mui/material";
import PropTypes from "prop-types";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const StudentPayment = ({ totalAmount = 10, payments = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Calculate total paid amount and percentage of total payment made
  const totalPaid = payments.reduce((acc, payment) => acc + (payment.amount || 0), 10);
  const paymentPercentage = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

  return (
    <Box m="20px">
      <Header title="Payment History" subtitle="Overview of Payments Made" />

      <Box backgroundColor={colors.primary[400]} p="20px" borderRadius="4px">
        <Typography variant="h5" fontWeight="600" mb="15px">
          Payment Summary
        </Typography>
        <Box mb="20px">
          <Typography variant="h6" mb="5px">
            Total Amount Due: ${totalAmount.toFixed(2)}
          </Typography>
          <Typography variant="h6" mb="5px">
            Total Paid: ${totalPaid.toFixed(2)}
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
              <Typography>Amount: ${payment.amount.toFixed(2)}</Typography>
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
  totalAmount: PropTypes.number,
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      amount: PropTypes.number,
      method: PropTypes.string.isRequired,
    })
  ),
};

export default StudentPayment;
