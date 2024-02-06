import React, { createContext, useState } from 'react';

export const FlightDetailsContext = createContext({
    metaData: null,
    setMetaData: () => {}
});

export const FlightDetailsProvider = ({ children }) => {
    const [metaData, setMetaData] = useState(null);

    return (
        <FlightDetailsContext.Provider value={{ metaData, setMetaData }}>
            {children}
        </FlightDetailsContext.Provider>
    );
};
