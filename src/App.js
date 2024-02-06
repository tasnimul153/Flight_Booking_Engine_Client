import React from "react";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Reservation from "./Components/Reservation/Reservation";
import SearchPage from "./Components/SearchPage/SearchPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createContext, useState } from "react";
import { FlightDetailsProvider } from "./Components/Contexts/FlightDetailContext";

export const NearestAirportsListContext = createContext();

function App() {
  const NearestAirportsProvider = ({ children }) => {
    const [NearestAirportsList, setNearestAirportsList] = useState([]);
    return (
      <NearestAirportsListContext.Provider value={[NearestAirportsList, setNearestAirportsList]}>
        {children}
      </NearestAirportsListContext.Provider>
    );
  };

  return (
    <NearestAirportsProvider>
      <FlightDetailsProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" exact Component={Home} />
            <Route path="/search" Component={SearchPage} />
            <Route path="/Reservation" Component={Reservation} />
          </Routes>
        </Router>
      </FlightDetailsProvider>
    </NearestAirportsProvider>
  );
}

export default App;
