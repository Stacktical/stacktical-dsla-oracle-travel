"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// test-fetch-data.ts
require("dotenv/config");
var weather_data_sources_1 = require("./weather-data-sources");
// import { fetchOpenWeatherMapData } from './weather-data-sources';
//import { fetchWeatherSourceAPIsData } from './weather-data-sources';
//import { fetchTomorrowIOData } from './weather-data-sources';
function testFetchData() {
    return __awaiter(this, void 0, void 0, function () {
        var params, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        location: '40.7128,-74.0060',
                        startDate: '2023-04-02',
                        endDate: '2023-04-08'
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, weather_data_sources_1.fetchVisualCrossingData)(params)];
                case 2:
                    data = _a.sent();
                    console.log('[TEST] Fetched data:', data);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('[TEST] Error fetching data:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
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
