import { useEffect, useState } from 'react';
import { fetchAndStoreUsers, fetchEnquiries, fetchTimetables, fetchPayments } from '../../../../../firebase/utils'; // Adjust the import path as needed

const useFetchData = () => {
  const [userData, setUserData] = useState([]);
  const [unreadEnquiriesCount, setUnreadEnquiriesCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [timeTable, setTimeTable] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const users = await fetchAndStoreUsers();
        setUserData(users);

        // Fetch unread enquiries
        const enquiries = await fetchEnquiries();
        const unreadCount = enquiries.filter(enquiry => !enquiry.read).length;
        setUnreadEnquiriesCount(unreadCount);

        // Fetch total revenue
        const total = users.reduce((sum, user) => {
          const amountPaid = parseFloat(user.amountPaid) || 0;
          return sum + amountPaid;
        }, 0);
        setTotalRevenue(total);

        // Fetch timetable
        const timetable = await fetchTimetables();
        setTimeTable(timetable);

         // Fetch payments
         const payment = await fetchPayments();
         setPayments(payment);

        setIsDataLoaded(true); // Set data as loaded
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return { userData, unreadEnquiriesCount, totalRevenue, timeTable, isDataLoaded, payments};
};

export default useFetchData;
