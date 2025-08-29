import React, { useState } from "react";
import { searchTours } from "../api";

const Search = () => {
  const [destination, setDestination] = useState("");
  const [maxDistance, setMaxDistance] = useState("");
  const [guests, setGuests] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await searchTours({
      destination,
      maxDistance,
      guests,
    });
    setResults(res.data);
  };

  return (
    <div>
      <h2>Search Tours</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Distance (km)"
          value={maxDistance}
          onChange={(e) => setMaxDistance(e.target.value)}
        />
        <input
          type="number"
          placeholder="Guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <ul>
        {results.map((tour) => (
          <li key={tour._id}>{tour.name} - {tour.destination}</li>
        ))}
      </ul>
    </div>
  );
};

export default Search;