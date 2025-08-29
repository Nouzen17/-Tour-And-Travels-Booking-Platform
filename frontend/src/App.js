import React from "react";
import Review from "./components/Review";
import Search from "./components/Search";

function App() {
  return (
    <div>
      <h1>Tour & Travels Booking</h1>
      <Search />
      <hr />
      {/* Example for a specific tour */}
      <Review tourId="1234567890abcdef" />
    </div>
  );
}

export default App;