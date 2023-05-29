"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
require('dotenv').config();
var Joi = require("joi");
var constants_1 = require("./constants");
var axios_1 = require("axios");
var web3_1 = require("web3");
var abis_1 = require("./abis");
// import { fetchVisualCrossingData, fetchOpenWeatherData, fetchWeatherbitData, fetchWeatherSourceData, fetchTomorrowIOData } from './weather-data-sources';
var weather_data_sources_1 = require("./weather-data-sources");
var networksObject = Object.keys(constants_1.NETWORKS).reduce(function (r, networkName) {
    var _a;
    return (__assign(__assign({}, r), (_a = {}, _a["".concat(networkName.toUpperCase(), "_URI")] = Joi.string().uri().required(), _a)));
}, {});
var schema = Joi.object(__assign({ IPFS_GATEWAY_URI: Joi.string().uri().required() }, networksObject)).unknown();
var error = schema.validate(process.env).error;
if (error) {
    throw new Error("Configuration error: ".concat(error.message));
}
function getSLAData(address, networkName) {
    return __awaiter(this, void 0, void 0, function () {
        var networkURI, web3, slaContract, periodType, ipfsCID, messengerAddress, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('[SLA] Contract address:', address); // Log the contract address
                    console.log('[SLA] Network name:', networkName); // Log the network name
                    networkURI = constants_1.NETWORKS[networkName];
                    if (!networkURI) {
                        throw new Error("No network URI found for network: ".concat(networkName));
                    }
                    web3 = new web3_1["default"](networkURI);
                    slaContract = new web3.eth.Contract(abis_1.SLAABI, address);
                    console.log('[SLA] Successfully instantiated web3 and slaContract variables'); // Log progress
                    return [4 /*yield*/, slaContract.methods.periodType().call()];
                case 1:
                    periodType = _a.sent();
                    console.log('[SLA] Period type:', periodType); // Log the period type
                    return [4 /*yield*/, slaContract.methods.ipfsHash().call()];
                case 2:
                    ipfsCID = _a.sent();
                    console.log('[SLA] IPFS CID:', ipfsCID); // Log the IPFS CID
                    return [4 /*yield*/, slaContract.methods.messengerAddress().call()];
                case 3:
                    messengerAddress = _a.sent();
                    console.log('[SLA] Messenger address:', messengerAddress); // Log the messenger address
                    return [4 /*yield*/, axios_1["default"].get("".concat(process.env.IPFS_GATEWAY_URI, "/ipfs/").concat(ipfsCID))];
                case 4:
                    data = (_a.sent()).data;
                    return [2 /*return*/, __assign(__assign({}, data), { periodType: periodType, messengerAddress: messengerAddress })];
            }
        });
    });
}
function getMessengerPrecision(messengerAddress, networkName) {
    return __awaiter(this, void 0, void 0, function () {
        var networkURI, web3, messenger;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('[MESSENGER] networkName:', networkName);
                    networkURI = constants_1.NETWORKS[networkName];
                    if (!networkURI) {
                        throw new Error("No network URI found for network: ".concat(networkName));
                    }
                    web3 = new web3_1["default"](networkURI);
                    messenger = new web3.eth.Contract(abis_1.MessengerABI, messengerAddress);
                    return [4 /*yield*/, messenger.methods.messengerPrecision().call()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function fetchWeatherData(location, startDate, endDate) {
    return __awaiter(this, void 0, void 0, function () {
        var startDateISO, endDateISO, visualCrossingData, weatherDataSources;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startDateISO = new Date(startDate * 1000).toISOString().split('T')[0];
                    endDateISO = new Date(endDate * 1000).toISOString().split('T')[0];
                    return [4 /*yield*/, (0, weather_data_sources_1.fetchVisualCrossingData)({ location: location, startDate: startDateISO, endDate: endDateISO })];
                case 1:
                    visualCrossingData = _a.sent();
                    // Add additional data source calls here
                    console.log('[WEATHER] fetchVisualCrossingData in index.ts:', { visualCrossingData: visualCrossingData });
                    weatherDataSources = [
                        visualCrossingData,
                    ];
                    return [2 /*return*/, weatherDataSources];
            }
        });
    });
}
function calculatePercentageDifference(actual, historical) {
    if (historical === 0) {
        return actual === 0 ? 0 : 100;
    }
    else {
        return Math.abs(((actual - historical) / historical) * 100);
    }
}
function processDataAndCalculateSLI(weatherDataSources, messengerPrecision, slaData) {
    var totalDays = weatherDataSources[0].length;
    var totalDataSources = weatherDataSources.length;
    var maxDeviation = slaData.maxDeviation / messengerPrecision;
    console.log('[SLO] maxDeviation:', maxDeviation);
    console.log('[SLO] coverageType:', slaData.coverageType);
    var daysMetMaxDeviation = 0;
    var daysInTrip = 0;
    // Get start and end dates Unix timestamp
    var tripStartDateTimestamp = slaData.tripStartDate;
    var tripEndDateTimestamp = slaData.tripEndDate;
    console.log('[SLI] tripStartDateTimeStamp:', tripStartDateTimestamp, ' - readable:', new Date(tripStartDateTimestamp * 1000).toUTCString());
    console.log('[SLI] tripEndDateTimeStamp:', tripEndDateTimestamp, ' - readable:', new Date(tripEndDateTimestamp * 1000).toUTCString());
    var _loop_1 = function (i) {
        var dailyData = weatherDataSources.map(function (source) { return source[i]; });
        // Convert the raw date to a Unix timestamp
        var rawDateTimestamp = new Date(dailyData[0].date).getTime() / 1000;
        console.log('[SLI] rawDateTimeStamp:', rawDateTimestamp, ' - readable:', new Date(rawDateTimestamp * 1000).toUTCString());
        // Check if the date is within the trip dates
        if (rawDateTimestamp >= tripStartDateTimestamp && rawDateTimestamp <= tripEndDateTimestamp) {
            daysInTrip++;
            var avgActualTemperature = dailyData.reduce(function (sum, day) { return sum + day.actualTemperature.avg; }, 0) / totalDataSources;
            var avgActualPrecipitation = dailyData.reduce(function (sum, day) { return sum + day.actualPrecipitation; }, 0) / totalDataSources;
            var avgHistoricalTemperature = dailyData.reduce(function (sum, day) { return sum + day.historicalTemperature.avg; }, 0) / totalDataSources;
            var avgHistoricalPrecipitation = dailyData.reduce(function (sum, day) { return sum + day.historicalPrecipitation; }, 0) / totalDataSources;
            console.log('[SLI-TRIP] readableDate:', new Date(dailyData[0].date).toUTCString());
            console.log('[SLI-TRIP] rawDate:', dailyData[0].date);
            console.log('[SLI-TRIP] avgActualTemperature:', avgActualTemperature);
            console.log('[SLI-TRIP] avgActualPrecipitation:', avgActualPrecipitation);
            console.log('[SLI-TRIP] avgHistoricalTemperature:', avgHistoricalTemperature);
            console.log('[SLI-TRIP] avgHistoricalPrecipitation:', avgHistoricalPrecipitation);
            // Calculate the percentage difference for temperature and precipitation
            var temperatureDifference = calculatePercentageDifference(avgActualTemperature, avgHistoricalTemperature);
            var precipitationDifference = calculatePercentageDifference(avgActualPrecipitation, avgHistoricalPrecipitation);
            console.log('[SLI-TRIP] temperatureDifference:', temperatureDifference);
            console.log('[SLI-TRIP] precipitationDifference:', precipitationDifference);
            // Check if the day met the maxDeviation parameter
            if (slaData.coverageType === 'temperature') {
                // For temperature coverage type, we only care about temperature difference
                if (avgActualTemperature < avgHistoricalTemperature) {
                    if (temperatureDifference <= maxDeviation) {
                        daysMetMaxDeviation++;
                    }
                }
                else {
                    daysMetMaxDeviation++; // Actual temperature is greater than or equal to Historical, so it meets the SLA
                }
            }
            else if (slaData.coverageType === 'precipitation') {
                // For precipitation coverage type, we only care about precipitation difference
                if (avgActualPrecipitation > avgHistoricalPrecipitation) {
                    if (precipitationDifference <= maxDeviation) {
                        daysMetMaxDeviation++;
                    }
                }
                else {
                    daysMetMaxDeviation++; // Actual precipitation is less than or equal to Historical, so it meets the SLA
                }
            }
        }
    };
    // Iterate over the days
    for (var i = 0; i < totalDays; i++) {
        _loop_1(i);
    }
    console.log('[SLI] daysInTrip:', daysInTrip);
    console.log('[SLI] daysMetMaxDeviation:', daysMetMaxDeviation);
    // Calculate the SLI based on the number of days meeting the SLO within the trip dates
    var SLI = 0;
    if (daysInTrip > 0) {
        SLI = (daysMetMaxDeviation / daysInTrip) * 100;
    }
    console.log('[SLI] SLI:', SLI);
    return Math.round(SLI * messengerPrecision);
}
exports['dsla-oracle-travel'] = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, periodStart, periodEnd, slaAddress, networkName, requestData, slaData, location_1, locationString, messengerPrecision, weatherData, SLI, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                data = req.body.data;
                periodStart = data.period_start, periodEnd = data.period_end, slaAddress = data.address, networkName = data.network_name;
                // Log entire request body
                console.log("[POST] Request received with periodStart: ".concat(periodStart, ", periodEnd: ").concat(periodEnd, ", networkName: ").concat(networkName));
                console.log('[POST] Request body:', req.body);
                requestData = {
                    sla_address: slaAddress,
                    network_name: networkName,
                    sla_monitoring_start: periodStart,
                    sla_monitoring_end: periodEnd
                };
                return [4 /*yield*/, getSLAData(requestData.sla_address, networkName)];
            case 1:
                slaData = _a.sent();
                console.log('[POST] SLA Data:', slaData);
                location_1 = slaData.coordinates;
                locationString = "".concat(slaData.coordinates.lat, ",").concat(slaData.coordinates.long);
                console.log('[POST] SLA Data retrieved with location:', location_1);
                console.log('[POST] Location string conversion:', locationString);
                return [4 /*yield*/, getMessengerPrecision(slaData.messengerAddress, networkName)];
            case 2:
                messengerPrecision = _a.sent();
                console.log('[POST] Messenger Precision:', messengerPrecision);
                return [4 /*yield*/, fetchWeatherData(locationString, periodStart, periodEnd)];
            case 3:
                weatherData = _a.sent();
                console.log("[POST] Fetched weather data:", weatherData);
                SLI = processDataAndCalculateSLI(weatherData, messengerPrecision, slaData);
                console.log('[POST] Calculated SLI:', SLI);
                res.send({
                    jobRunID: req.body.id,
                    data: { result: SLI }
                });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.error('Error:', error_1.message);
                res.send({
                    jobRunID: req.body.id,
                    data: { result: null },
                    error: error_1.message
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
