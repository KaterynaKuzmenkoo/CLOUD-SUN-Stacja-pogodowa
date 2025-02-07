import React, { useEffect, useState, useCallback } from 'react';
import { MDBCard, MDBCardBody, MDBContainer, MDBRow, MDBCol, MDBSpinner } from 'mdb-react-ui-kit';
import './Dashboard.css';

const Dashboard = ({ cities }) => {
    const [weatherData, setWeatherData] = useState({});
    const [loading, setLoading] = useState(true);
    const iconBaseURL = "https://www.weatherbit.io/static/img/icons/";
    const weatherApiUrl = "https://api.weatherbit.io/v2.0/current";
    const masterApiKey = "64dfd2f68af944f8b8a52e826bd45e04";

    const fetchWeatherData = useCallback(async () => {
        setLoading(true);
        const fetchedData = {};

        for (const city of cities) {
            try {
                const response = await fetch(`${weatherApiUrl}?city=${city}&key=${masterApiKey}`);
                const data = await response.json();

                if (response.ok) {
                    fetchedData[city] = {
                        currentWeather: {
                            temperature: data.data[0].temp,
                            description: data.data[0].weather.description,
                            icon: data.data[0].weather.icon,
                            windSpeed: data.data[0].wind_spd,
                            humidity: data.data[0].rh,
                            solarRadiation: data.data[0].solar_rad,
                        },
                    };
                } else {
                    console.error(`Błąd dla miasta ${city}:`, data);
                }
            } catch (error) {
                console.error(`Błąd podczas pobierania danych pogodowych dla miasta ${city}:`, error);
            }
        }

        setWeatherData(fetchedData);
        setLoading(false);
    }, [cities]);

    useEffect(() => {
        fetchWeatherData();
    }, [fetchWeatherData]);

    return (
        <MDBContainer className="my-4" style={{ height: '85vh', backgroundColor: '#2E438D' }}>
            {loading ? (
                <MDBSpinner />
            ) : (
                <div className="row d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                    {cities.map((city, index) => (
                        <MDBCol md="6" lg="4" key={index}>
                            <MDBCard className="text-body mb-3" style={{ borderRadius: '35px', backgroundColor: 'white' }}>
                                <MDBCardBody className="p-4">
                                    <div className="d-flex justify-content-between">
                                        <h6 className="flex-grow-1">{city}</h6>
                                        <h6>{new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</h6>
                                    </div>
                                    <div className="d-flex flex-column text-center mt-5 mb-4">
                                        <h6 className="display-4 mb-0 font-weight-bold">
                                            {weatherData[city]?.currentWeather.temperature}&deg;C
                                        </h6>
                                        <span className="small text-muted">{weatherData[city]?.currentWeather.description}</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1" style={{ fontSize: '1rem' }}>
                                            <div>
                                                🌬️ <span className="ms-1">{weatherData[city]?.currentWeather.windSpeed?.toFixed(1)} km/h</span>
                                            </div>
                                            <div>
                                                💧 <span className="ms-1">{weatherData[city]?.currentWeather.humidity}%</span>
                                            </div>
                                            <div>
                                                🌞 <span className="ms-1">{weatherData[city]?.currentWeather.solarRadiation?.toFixed(1)} W/m²</span>
                                            </div>
                                        </div>
                                        <div>
                                            <img
                                                src={`${iconBaseURL}${weatherData[city]?.currentWeather.icon}.png`}
                                                alt={weatherData[city]?.currentWeather.description}
                                                width="100px"
                                            />
                                        </div>
                                    </div>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    ))}
                </div>
            )}
        </MDBContainer>

    );
};

export default Dashboard;
