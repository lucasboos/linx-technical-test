import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { format } from 'date-fns';
import { jwtDecode } from "jwt-decode";
import { 
  ArrowSmallRightIcon, 
} from "@heroicons/react/24/outline";
import { 
  Card, 
  Typography,
} from "@material-tailwind/react";
import Navbar from "../navbar";
import ThemeProvider from "../theme-provider";


interface JwtPayload {
  user_id: string;
}

export function SearchHistory() {
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [records, setRecords] = useState([]);

  useEffect(() => {
    getUserFromToken();
    if (userId) handleUserRecords();
  }, [userId])

  const getUserFromToken = () => {
    const authToken = Cookies.get("authToken");
    setToken(authToken);

    if (!authToken) {
      return null;
    }

    try {
      const decodedToken = jwtDecode(authToken) as JwtPayload;
      if (decodedToken.user_id) setUserId(decodedToken.user_id);
    } catch (error) {
      console.error("Error decoding the token: ", error);
    }
  };

  const handleUserRecords = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/v1/records/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setRecords(responseData);
      } else {
        const responseData = await response.json();
        console.error("Error capturing records:", responseData.message);
      }
    } catch (error) {
      console.error("Error capturing records:", error);
    }
  };

  const handleDeleteUserRecords = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/v1/records/delete/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        handleUserRecords();
      } else {
        const responseData = await response.json();
        console.error("Error deleting records:", responseData.message);
      }
    } catch (error) {
      console.error("Error deleting records:", error);
    }
  };

  const TABLE_HEAD = ["City", "Date"];
 
  return (
    <ThemeProvider>
      <Navbar />
      <header className="h-full w-screen place-items-center bg-white px-8 py-28">
        <div className="container mx-auto grid items-center lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <div 
              className="inline-flex items-center rounded-lg border border-dark/30 py-1 pl-1 pr-3 mb-4 cursor-pointer"
              onClick={handleDeleteUserRecords}
            >
              <Typography
                variant="small"
                className="mr-3 rounded-md bg-red py-0.5 px-3 font-medium text-white"
              >
                🗑
              </Typography>
              <Typography
                color="red"
                variant="small"
                className="!flex !items-center !font-semibold"
              >
                Clear search history
                <ArrowSmallRightIcon
                  className="ml-1.5 h-4 w-4"
                  strokeWidth={3}
                />
              </Typography>
            </div>
            <Typography
              variant="h1"
              color="blue-gray"
              className="leading-tight lg:text-6xl"
            >
              Search history
            </Typography>
          </div>
          {records.length === 0 && (
            <Typography
              variant="h2"
              color="blue-gray"
              className="mb-6 leading-tight"
            >
              No search history available.
            </Typography>
          )}
          <Card className="h-full w-full overflow-y">
            <div className="max-h-96 overflow-y-auto">
            {records.length > 0 ? (
              <table className="w-full min-w-max table-auto text-left">
                <thead className="sticky top-0 bg-blue-gray-50">
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th key={head} className="border-b border-blue-gray-100 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map(({ id, searched_region, date }, index) => {
                    const parsedDate = new Date(date);
                    const formattedDate = format(parsedDate, "dd/MM/yyyy HH:mm:ss");
                    return(
                      <tr key={id} className="even:bg-blue-gray-50/50">
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {searched_region}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {formattedDate}
                          </Typography>
                        </td>
                      </tr>
                    )
                  })}             
                </tbody>
              </table>
            ) : null}
            </div>
          </Card>
        </div>
      </header>
    </ThemeProvider>
  );
}

export default SearchHistory;
