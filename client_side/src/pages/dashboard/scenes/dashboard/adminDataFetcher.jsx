import { useEffect } from 'react';
import { fetchAndStoreUsers, fetchEnquiries, fetchTimetables, fetchCourses} from '../../../../firebase/utils'; // Replace with actual import paths

const DataFetcher = ({ setUserData,
                        setUnreadEnquiriesCount,
                        setTotalRevenue,
                        setTimeTable,
                        fetchCourses }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const users = await fetchAndStoreUsers();
        setUserData(users);

        // Fetch unread enquiries
        const enquiries = await fetchEnquiries();
        // Count unread enquiries
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
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


    fetchData();
  }, [setUserData, setUnreadEnquiriesCount, setTotalRevenue, setTimeTable]);

  return null; // This component doesn't render anything itself
};

export default DataFetcher;
