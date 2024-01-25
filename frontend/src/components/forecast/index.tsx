import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {
  Button,
  Typography,
  Input,
} from "@material-tailwind/react";
import {
  ToastContainer,
  toast
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ThemeProvider from "../theme-provider";
import Navbar from "../navbar";
import { weatherIconMapping } from "../../utils/weatherIconMapping";


interface JwtPayload {
  user_id: string;
}

interface WeatherData {
  city: {
    name: string;
  };
  list: {
    dt_txt: string;
    weather: {
      id: number;
      main: string;
      description: string;
    }[];
  }[];
}

export function WeatherForecast() {
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    getUserFromToken();
  }, [])

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const isUserLoggedIn = () => {
    return !!Cookies.get("authToken");
  };

  const getWeatherIcon = (weather_id: number): string => {
    return weatherIconMapping[weather_id];
  };

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

  const handleWeather = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/v1/weather/?user_id=${userId}&city=${city}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setWeatherData(responseData);
        console.log(responseData)
      } else {
        const responseData = await response.json();
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error("Error capturing weather forecast.");
      console.error("Error capturing weather forecast:", error);
    }
  };

  return (
    <ThemeProvider>
      <Navbar />
      <div className="flex place-items-center bg-white py-20">
        <div className="container mx-auto items-center flex">
          <ToastContainer />
        {isUserLoggedIn() ? (
          <>
            <div className="text-left mb-8 md:w-1/2">
              <Typography
                color="blue"
                className="flex items-center font-bold text-lg mb-5"
              >
                <a href="/history">View search history</a>
              </Typography>

              <Typography
                variant="h2"
                color="blue-gray"
                className="mb-6 leading-tight"
              >
                Enter the city you want to know the <span className="text-blue">temperature</span> of!
              </Typography>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input  
                  color="black"
                  label="City"
                  type="city"
                  name="city"
                  value={city}
                  onChange={handleInputChange}
                  crossOrigin
                />
                <Button
                  color="blue"
                  onClick={handleWeather}
                >
                  search
                </Button>
              </div>
            </div>

            <div className="text-left mb-8 md:w-1/2">
              {weatherData && weatherData.city ? (
                <>
                  <div className="md:flex">
                    <div className="mx-auto" style={{ fontSize: '10rem' }}>{getWeatherIcon(weatherData.list[0].weather[0].id)}</div>
                  </div>

                  <div className="flex items-center mb-4">
                    <Typography
                      variant="h3"
                      color="blue-gray"
                      className="font-bold mx-auto"
                    >
                      now in <span className="text-blue">{weatherData.city.name}</span>
                    </Typography>
                  </div>

                  <div className="flex items-center">
                    <Typography
                      variant="h5"
                      color="blue-gray"
                      className="font-bold mx-auto"
                    >
                      {weatherData.list[0].weather[0].main} - {weatherData.list[0].weather[0].description}
                    </Typography>
                  </div>
                </>
              ) : (
                <>
                  <img src="sun.png" alt="sun" className="mx-auto md:flex" />
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="text-left mb-8 md:w-1/2">
              <Typography
                color="blue"
                className="flex items-center font-bold text-lg mb-5"
              >
                Linx Technical Test
              </Typography>

              <Typography
                variant="h1"
                color="blue-gray"
                className="mb-8 lg:mr-32 leading-tight font-black"
              >
                Will it rain today?☔<span className="text-blue">Or sun for a run!</span>
              </Typography>
              <Typography variant="lead" color="blue-gray" className="lg:pr-32">
                Stay tuned for the latest weather updates and plan your day accordingly. Enjoy accurate weather forecasts right here!
              </Typography>
              <div className="mt-12 flex flex-wrap justify-center gap-3 lg:justify-start">
                <a href="/signup">
                  <Button className="flex items-center dark" >
                    I want to know
                  </Button>
                </a>
              </div>
            </div>

            <div className="text-left md:w-1/2">
              <img src="sun.png" alt="sun" className="mx-auto md:flex" />
            </div>
          </>
        )}
        </div>
      </div>
      {weatherData && weatherData.city ? (
        <section className="px-8">
          <div className="container mx-auto text-center">
            <Typography
              variant="h3"
              color="blue-gray"
              className="text-xl font-bold mb-8"
            >
              Weekday forecast
            </Typography>
            <div className="flex flex-wrap items-center justify-center gap-8">
            {weatherData.list.map((data, index) => (
              <div key={index} className="flex flex-col items-center">
                <Typography
                  variant="h5"
                  color="blue"
                  className="font-bold mb-3"
                >
                  {new Date(data.dt_txt).toLocaleDateString('en-US', {
                    weekday: 'long',
                  })}
                </Typography>
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="font-bold mb-3"
                >
                  {new Date(data.dt_txt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
                <div className="md:flex">
                    <div className="mx-auto" style={{ fontSize: '3rem' }}>{getWeatherIcon(data.weather[0].id)}</div>
                </div>
                <Typography
                  variant="body1"
                  color="blue-gray"
                  className="mb-3"
                >
                  {data.weather[0].main}
                </Typography>
                <Typography
                  variant="body1"
                  color="blue-gray"
                >
                  {data.weather[0].description}
                </Typography>
              </div>
            ))}
            </div>
          </div>
        </section>
      ) : (
        null
      )}
    </ThemeProvider>
  );
}

export default WeatherForecast;
