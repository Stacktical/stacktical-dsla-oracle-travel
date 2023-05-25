// test-fetch-data.ts
import 'dotenv/config';

import { fetchVisualCrossingData } from './weather-data-sources';
// import { fetchOpenWeatherMapData } from './weather-data-sources';
//import { fetchWeatherSourceAPIsData } from './weather-data-sources';
//import { fetchTomorrowIOData } from './weather-data-sources';

async function testFetchData() {
    const params = {
        location: '40.7128,-74.0060',
        startDate: '2023-04-02',
        endDate: '2023-04-08',
    };

    try {
        const data = await fetchVisualCrossingData(params);
        console.log('[TEST] Fetched data:', data);
    } catch (error) {
        console.error('[TEST] Error fetching data:', error);
    }
    /*
    try {
        const data = await fetchOpenWeatherMapData(params);
        console.log('[TEST] Fetched data:', data);
    } catch (error) {
        console.error('[TEST] Error fetching data:', error);
    }
    
    try {
        const data = await fetchTomorrowIOData(params);
        console.log('[TEST] Fetched data:', data);
    } catch (error) {
        console.error('[TEST] Error fetching data:', error);
    }
    */

}

// curl calls for testing
// curl --location --request POST 'http://localhost:3002/test-sli' --header 'Content-Type: application/json' --data-raw '{"data": {"period_start": "2023-04-02", "period_end": "2023-04-08", "location": "40.7128,-74.0060"}}'
// call with fewer dates to lighten on api weight for free tier.
// curl --location --request POST 'http://localhost:3002/test-sli' --header 'Content-Type: application/json' --data-raw '{"data": {"period_start": "2023-04-05", "period_end": "2023-04-08", "location": "40.7128,-74.0060"}}'
// run external adapter:
// ts-node services/fits-adapter/index.ts

testFetchData();

/*
MANUAL TESTING DATA FOR CALLS TO API PROVIDERS

curl --location --request POST 'http://localhost:6070/test-sli' --header 'Content-Type: application/json' --data-raw '{ "data": { "coverageType": "temperature", "tripStartDate": "1666656000", "tripEndDate": "1667001600", "period_start": "1666569600", "period_end": "1667174399", "location": "25.7617,-80.1918", "maxDeviation": 5000000, "coordinates": { "lat": 25.7617, "long": -80.1918 } } }'

## DTK Periods
Period 0
Start: "24/10/2022 00:00:00", 1666569600
End: "30/10/2022 23:59:59", 1667174399

Period 1
Start: "31/10/2022 00:00:00", 1667174400
End: "06/11/2022 23:59:59", 1667779199

Period 2
Start: "07/11/2022 00:00:00", 1667779200
End: "13/11/2022 23:59:59",  1668383999

## Locations

"lat:" 40.7128, "long": -74.0060" NEW YORK, NY
"lat": 25.7617, "long": -80.1918 MIAMI, FL
"lat": 25.059999, "long": -77.345001 NASSAU, BAHAMAS
"lat": 21.1743, "long": -86.8466 CANCUN, MX
*/
