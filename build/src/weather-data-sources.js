"use strict";
// weather-data-sources.ts
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
exports.fetchVisualCrossingData = void 0;
var axios_1 = require("axios");
var OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
var WEATHERSOURCE_API_KEY = process.env.WEATHERSOURCE_API_KEY;
var TOMORROW_API_KEY = process.env.TOMORROW_API_KEY;
var VISUALCROSSING_API_KEY = process.env.VISUALCROSSING_API_KEY;
function processVisualCrossingData(actualData, historicalData) {
    var locationKey = Object.keys(actualData.locations)[0];
    var actualValues = actualData.locations[locationKey].values;
    var historicalValues = historicalData.locations[locationKey].values;
    var dailyData = actualValues.map(function (day) {
        var date = new Date(day.datetime).toISOString().split("T")[0].substring(5); // Get MM-DD
        var actualDate = day.datetime;
        var historicalDays = historicalValues.filter(function (historicalDay) {
            var historicalDate = new Date(historicalDay.datetime).toISOString().split("T")[0].substring(5); // Get MM-DD
            return historicalDate === date;
        });
        var historicalTemperature = {
            avg: historicalDays.reduce(function (sum, day) { return sum + day.temp; }, 0) / historicalDays.length,
            min: historicalDays.reduce(function (sum, day) { return sum + day.mint; }, 0) / historicalDays.length,
            max: historicalDays.reduce(function (sum, day) { return sum + day.maxt; }, 0) / historicalDays.length
        };
        var historicalPrecipitation = historicalDays.reduce(function (sum, day) { return sum + day.precip; }, 0) / historicalDays.length;
        return {
            date: actualDate,
            actualTemperature: {
                avg: day.temp,
                min: day.mint,
                max: day.maxt
            },
            actualPrecipitation: day.precip,
            historicalTemperature: historicalTemperature,
            historicalPrecipitation: historicalPrecipitation
        };
    });
    return dailyData;
}
function fetchVisualCrossingData(params) {
    return __awaiter(this, void 0, void 0, function () {
        var location, startDate, endDate, fields, unitScale, baseUrl, endpoint, historicalPromises, i, historicalStartDate, historicalEndDate, historicalEndpoint, actualResponse, historicalResponses, locationKey, historicalValues, _i, historicalResponses_1, response, historicalData, processedData, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    location = params.location, startDate = params.startDate, endDate = params.endDate, fields = params.fields, unitScale = params.unitScale;
                    baseUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history";
                    endpoint = "".concat(baseUrl, "?location=").concat(location, "&startDateTime=").concat(startDate, "T00:00:00&endDateTime=").concat(endDate, "T00:00:00&aggregateHours=24&unitGroup=us&contentType=json&key=").concat(VISUALCROSSING_API_KEY);
                    historicalPromises = [];
                    for (i = 0; i < 10; i++) {
                        historicalStartDate = new Date(new Date(startDate).setFullYear(new Date(startDate).getFullYear() - i)).toISOString().split('T')[0];
                        historicalEndDate = new Date(new Date(endDate).setFullYear(new Date(endDate).getFullYear() - i)).toISOString().split('T')[0];
                        historicalEndpoint = "".concat(baseUrl, "?location=").concat(location, "&startDateTime=").concat(historicalStartDate, "T00:00:00&endDateTime=").concat(historicalEndDate, "T00:00:00&aggregateHours=24&unitGroup=us&contentType=json&key=").concat(VISUALCROSSING_API_KEY);
                        historicalPromises.push(axios_1["default"].get(historicalEndpoint));
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, axios_1["default"].get(endpoint)];
                case 2:
                    actualResponse = _b.sent();
                    return [4 /*yield*/, Promise.all(historicalPromises)];
                case 3:
                    historicalResponses = _b.sent();
                    locationKey = Object.keys(actualResponse.data.locations)[0];
                    historicalValues = [];
                    for (_i = 0, historicalResponses_1 = historicalResponses; _i < historicalResponses_1.length; _i++) {
                        response = historicalResponses_1[_i];
                        historicalValues.push.apply(historicalValues, response.data.locations[locationKey].values);
                    }
                    historicalData = {
                        locations: (_a = {},
                            _a[locationKey] = {
                                values: historicalValues
                            },
                            _a)
                    };
                    processedData = processVisualCrossingData(actualResponse.data, historicalData);
                    console.log("[PROCESSED-DATA] Processed Visual Crossing data:", processedData);
                    return [2 /*return*/, processedData];
                case 4:
                    error_1 = _b.sent();
                    throw error_1;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.fetchVisualCrossingData = fetchVisualCrossingData;
/*
export async function fetchTomorrowIOData(params: APIDataParams) {
    const { location, startDate, endDate } = params;
    const [latitude, longitude] = location.split(',');

    const fields = [
        'temperatureAvg',
        'temperatureMax',
        'temperatureMin',
        'precipitationAccumulationSum',
    ];

    const baseUrl = 'https://api.tomorrow.io/v4/timelines';
    const actualEndpoint = `${baseUrl}?location=${latitude},${longitude}&fields=${fields.join(',')}&timesteps=1d&startTime=${startDate}T00:00:00Z&endTime=${endDate}T00:00:00Z&apikey=${TOMORROW_API_KEY}`;

    const historicalBaseUrl = 'https://api.tomorrow.io/v4/historical/normals';
    const historicalStart = startDate.slice(5);
    const historicalEnd = endDate.slice(5);

    try {
        const actualResponse = await axios.get(actualEndpoint);

        const historicalResponse = await axios.post(
            `${historicalBaseUrl}?apikey=${TOMORROW_API_KEY}`,
            {
                location: `${latitude},${longitude}`,
                fields: fields,
                timesteps: ['1d'],
                startDate: historicalStart,
                endDate: historicalEnd,
                units: 'metric',
            },
            {
                headers: {
                    'Accept-Encoding': 'gzip',
                    'Content-Type': 'application/json',
                },
            },
        );

        //const processedData = processTomorrowIOData(actualResponse.data, historicalResponse.data);
        //console.log("[PROCESSED-DATA] Processed Tomorrow.io data:", processedData);
        console.log("[FETCHED-DATA] actual Tomorrow.io data:", actualResponse.data);
        console.log("[FETCHED-DATA] actual Tomorrow.io data:", historicalResponse.data);
        //return processedData;
    } catch (error) {
        throw error;
    }
}
*/
/*
export async function fetchWeatherSourceAPIsData(params: APIDataParams) {
    const { location, startDate, endDate, fields, unitScale } = params;
    const latLong = location.split(','); // Assuming location is in 'latitude,longitude' format

    const baseUrl = "https://history.weathersourceapis.com/v2";
    const endpoint = `/points/${latLong[0]},${latLong[1]}/days/${startDate},${endDate}`;

    // fetch historical data
    const historicalPromises = [];
    for (let i = 0; i < 10; i++) {
        const historicalStartDate = new Date(new Date(startDate).setFullYear(new Date(startDate).getFullYear() - i)).toISOString().split('T')[0];
        const historicalEndDate = new Date(new Date(endDate).setFullYear(new Date(endDate).getFullYear() - i)).toISOString().split('T')[0];
        const historicalEndpoint = `/points/${latLong[0]},${latLong[1]}/days/${historicalStartDate},${historicalEndDate}`;
        historicalPromises.push(axios.get(baseUrl + historicalEndpoint, {
            headers: { 'X-API-KEY': WEATHERSOURCE_API_KEY },
            params: {
                fields: fields || 'tempAvg,tempMin,tempMax,precip',
                unitScale: unitScale || 'IMPERIAL',
            },
        }));
    }

    try {
        const actualResponse = await axios.get(baseUrl + endpoint, {
            headers: { 'X-API-KEY': WEATHERSOURCE_API_KEY },
            params: {
                fields: fields || 'tempAvg,tempMin,tempMax,precip',
                unitScale: unitScale || 'IMPERIAL',
            },
        });
        const historicalResponses = await Promise.all(historicalPromises);

        // Combine historical data
        const historicalData = {
            locations: {
                [location]: {
                    values: [],
                },
            },
        };

        for (const response of historicalResponses) {
            historicalData.locations[location].values.push(...response.data);
        }

        //const processedData = processWeatherSourceData(actualResponse.data, historicalData);
        //console.log("[PROCESSED-DATA] Processed Weather Source data:", processedData);
        console.log("[RESPONSE-DATA] Weather Source data:", actualResponse.data);
        //return processedData;
    } catch (error) {
        throw error;
    }
}
*/
/*
export async function fetchOpenWeatherMapData(params: APIDataParams) {
    const { location, startDate, endDate, fields, unitScale } = params;
    const latLong = location.split(','); // Assuming location is in 'latitude,longitude' format

    const baseUrl = "https://history.openweathermap.org/data/2.5/history/city";
    const startUnix = Math.floor(new Date(startDate).getTime() / 1000);
    const endUnix = Math.floor(new Date(endDate).getTime() / 1000);
    const endpoint = `${baseUrl}?lat=${latLong[0]}&lon=${latLong[1]}&type=hour&start=${startUnix}&end=${endUnix}&appid=${OPENWEATHER_API_KEY}&units=imperial`;

    // fetch historical data
    const historicalPromises = [];
    for (let i = 0; i < 10; i++) {
        const historicalStartDate = new Date(new Date(startDate).setFullYear(new Date(startDate).getFullYear() - i)).getTime();
        const historicalEndDate = new Date(new Date(endDate).setFullYear(new Date(endDate).getFullYear() - i)).getTime();
        const historicalStartUnix = Math.floor(historicalStartDate / 1000);
        const historicalEndUnix = Math.floor(historicalEndDate / 1000);
        const historicalEndpoint = `${baseUrl}?lat=${latLong[0]}&lon=${latLong[1]}&type=hour&start=${historicalStartUnix}&end=${historicalEndUnix}&appid=${OPENWEATHER_API_KEY}&units=imperial`;
        historicalPromises.push(axios.get(historicalEndpoint));
    }

    try {
        const actualResponse = await axios.get(endpoint);
        const historicalResponses = await Promise.all(historicalPromises);

        // Combine historical data
        const historicalData = {
            locations: {
                [location]: {
                    values: [],
                },
            },
        };

        for (const response of historicalResponses) {
            historicalData.locations[location].values.push(...response.data.list);
        }

        // const processedData = processOpenWeatherMapData(actualResponse.data, historicalData);
        // console.log("[PROCESSED-DATA] Processed OpenWeatherMap data:", processedData);
        // return processedData;
        return actualResponse.data;
    } catch (error) {
        throw error;
    }
}
*/ 
