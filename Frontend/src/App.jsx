import React, {useEffect, useState} from "react";
import Select from "react-select";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style
import "react-date-range/dist/theme/default.css"; // Theme style
import "leaflet/dist/leaflet.css";
import "./App.css";

// TO DELETE
const locationOptions = [
    { value: "Delhi", label: "Delhi, India" },
    { value: "Mumbai", label: "Mumbai, India" },
    { value: "Bangalore", label: "Bangalore, India" },
    { value: "Kolkata", label: "Kolkata, India" },
    { value: "Hyderabad", label: "Hyderabad, India" },
    { value: "Chennai", label: "Chennai, India" }
];

function App() {
    const [flights, setFlights] = useState([]);
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [toPositionLat, setToPositionLat] = useState(null);
    const [toPositionLon, setToPositionLon] = useState(null);
    const [fromPositionLat, setFromPositionLat] = useState(null);
    const [fromPositionLon, setFromPositionLon] = useState(null);
    const [centerSet, setCenterSet] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection"
        }
    ]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [handlePost, setHandlePost] = useState(false);


    const handleDateSelect = (ranges) => {
        setDateRange([ranges.selection]);
        setShowCalendar(false);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const feachPredictData = async () => {
        const durationInMillis = dateRange[0].endDate - dateRange[0].startDate;
        const durationInDays = Math.floor(durationInMillis / (1000 * 60 * 60 * 24));

        const daysLeftInMillis = new Date() - dateRange[0].startDate;
        const daysLeft = Math.floor(daysLeftInMillis / (1000 * 60 * 60 * 24));
        const dataToSend = {
            source_city: from.value,
            departure_time: 'Morning',
            is_direct: true,
            duration: durationInDays,
            days_left: daysLeft,
            arrival_time: 'Morning',
            destination_city: to.value
        }

        const response = await fetch(
            `http://localhost:5230/api/predict`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            }
        );
        const toReturn = await response.json();
        return toReturn;
    }

    const generatePredictDataHtml = async () => {
        try {
            const priceData = await feachPredictData();
            const flight = {
                id: flights.length + 1,
                from: from.value,
                to: to.value,
                price: priceData
            }
            setFlights(prevFlights => [...prevFlights, flight]); // Add new flight to the list
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if ((from && to) && (from != to)) {
            generatePredictDataHtml();
        }
    }, [handlePost]);

    const handleMap = async () => {
        if (to.label) {
            const [cityTo, countryTo] = extractCityAndCountry(to.label)
            const [latTo, lonTo] = await getCoordinates(cityTo, countryTo);
            setToPositionLat(latTo);
            setToPositionLon(lonTo);
        }

        if (from.label) {
            const [cityFrom, countryFrom] = extractCityAndCountry(from.label)
            const [latFrom, lonFrom] = await getCoordinates(cityFrom, countryFrom);
            setFromPositionLat(latFrom);
            setFromPositionLon(lonFrom);
        }
    }

    const getCoordinates = async (cityName, countryName) => {
        const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityName)}&country=${encodeURIComponent(countryName)}&format=json`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data && data.length > 0) {
                const place = data[0]; // First result
                const lat = place.lat;
                const lon = place.lon;
                console.log(`Coordinates for "${cityName}": Latitude: ${lat}, Longitude: ${lon}`);
                return [parseFloat(lat), parseFloat(lon)];
            } else {
                console.log(`No coordinates found for ${cityName}`);
                return [null, null];  // Fallback to null if no result found
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return [null, null];  // Fallback to null on error
        }
    };

    const extractCityAndCountry = (label) => {
        const parts = label.split(", ");

        if (parts.length === 2) {
            const city = parts[0];
            const country = parts[1];
            return [ city, country ];
        }

        return null;
    };

    useEffect(() => {
        if (from && to) {
            handleMap();
        }
    }, [from, to]);

    return (
        <div className="container">
            <div className="search-bar">
                <div className="dropdown">
                    <label htmlFor="from">From</label>
                    <Select
                        id="from"
                        options={locationOptions}
                        value={from}
                        onChange={setFrom}
                        placeholder="Type to search..."
                    />
                </div>
                <div className="dropdown">
                    <label htmlFor="to">To</label>
                    <Select
                        id="to"
                        options={locationOptions}
                        value={to}
                        onChange={setTo}
                        placeholder="Type to search..."
                    />
                </div>
                <div className="dropdown">
                    <label htmlFor="departure-date">Departure Date</label>
                    <input
                        type="text"
                        id="departure-date"
                        readOnly
                        value={formatDate(dateRange[0].startDate)}
                        onClick={() => setShowCalendar(!showCalendar)}
                        placeholder="Select departure date"
                    />
                </div>
                <div className="dropdown">
                    <label htmlFor="return-date">Return Date</label>
                    <input
                        type="text"
                        id="return-date"
                        readOnly
                        value={formatDate(dateRange[0].endDate)}
                        onClick={() => setShowCalendar(!showCalendar)}
                        placeholder="Select return date"
                    />
                </div>
                <button className="search-button" onClick={() => setHandlePost(!handlePost)}>Search</button>
            </div>

            {showCalendar && (
                <DateRangePicker
                    ranges={dateRange}
                    onChange={handleDateSelect}
                    moveRangeOnFirstSelection={false}
                    rangeColors={["#007bff"]}
                    showDateDisplay={false}
                    className="calendar"
                />
            )}

            <div className="result-map-container">
                {from && to ? (
                    <div className="prediction">
                        <h2>Predicted Flight Prices</h2>
                        <div className="flight-list">
                            {flights.map((flight) => (
                                <div key={flight.id} className="flight-item">
                                    <p>
                                        <strong>From:</strong> {flight.from}
                                    </p>
                                    <p>
                                        <strong>To:</strong> {flight.to}
                                    </p>
                                    <p>
                                        <strong>Price:</strong> PLN {flight.price}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="prediction">
                        <h2>Please select both a departure and destination to see predictions</h2>
                    </div>
                )}

                <MapContainer
                    center={[21.0859, 79.0450]}
                    zoom={4}
                    className="map">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {/* From marker */}
                    {fromPositionLat && fromPositionLon ? (
                        <Marker position={[fromPositionLat, fromPositionLon]}>
                            <Popup>Starting Point</Popup>
                        </Marker>
                    ) : (
                        <Marker position={[52.2297, 21.0122]}>
                            <Popup>Starting Point (Default)</Popup>
                        </Marker>
                    )}

                    {/* To marker */}
                    {toPositionLat && toPositionLon ? (
                        <Marker position={[toPositionLat, toPositionLon]}>
                            <Popup>Destination</Popup>
                        </Marker>
                    ) : (
                        <Marker position={[52.2297, 21.0122]}>
                            <Popup>Destination (Default)</Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
}

export default App;