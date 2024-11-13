import React, { useState } from "react";
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
    const [price, setPrice] = useState(2137);
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection"
        }
    ]);
    const [showCalendar, setShowCalendar] = useState(false);

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

    // TO DELETE
    const exampleFlights = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        from: locationOptions[Math.floor(Math.random() * locationOptions.length)].label,
        to: locationOptions[Math.floor(Math.random() * locationOptions.length)].label,
        price: (Math.random() * 500 + 100).toFixed(2)
    }));

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
                <button className="search-button">Search</button>
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
                {from && to ? ( // Only show predictions if both 'from' and 'to' are set
                    <div className="prediction">
                        <h2>Predicted Flight Prices</h2>
                        <div className="flight-list">
                            {exampleFlights.map((flight) => (
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

                <MapContainer center={[52.2297, 21.0122]} zoom={4} className="map">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[52.2297, 21.0122]}>
                        <Popup>Starting Point</Popup>
                    </Marker>
                    <Marker position={[52.5200, 13.4050]}>
                        <Popup>Destination</Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
}

export default App;