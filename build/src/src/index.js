"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const Joi = __importStar(require("joi"));
const constants_1 = require("./constants");
const axios_1 = __importDefault(require("axios"));
const web3_1 = __importDefault(require("web3"));
const abis_1 = require("./abis");
// import { fetchVisualCrossingData, fetchOpenWeatherData, fetchWeatherbitData, fetchWeatherSourceData, fetchTomorrowIOData } from './weather-data-sources';
const weather_data_sources_1 = require("./weather-data-sources");
const networksObject = Object.keys(constants_1.NETWORKS).reduce((r, networkName) => ({
    ...r,
    [`${networkName.toUpperCase()}_URI`]: Joi.string().uri().required(),
}), {});
const schema = Joi.object({
    IPFS_GATEWAY_URI: Joi.string().uri().required(),
    ...networksObject,
}).unknown();
const { error } = schema.validate(process.env);
if (error) {
    throw new Error(`Configuration error: ${error.message}`);
}
async function getSLAData(address, networkName) {
    console.log('[SLA] Contract address:', address); // Log the contract address
    console.log('[SLA] Network name:', networkName); // Log the network name
    const networkURI = constants_1.NETWORKS[networkName];
    if (!networkURI) {
        throw new Error(`No network URI found for network: ${networkName}`);
    }
    const web3 = new web3_1.default(networkURI);
    const slaContract = new web3.eth.Contract(abis_1.SLAABI, address);
    console.log('[SLA] Successfully instantiated web3 and slaContract variables'); // Log progress
    const periodType = await slaContract.methods.periodType().call();
    console.log('[SLA] Period type:', periodType); // Log the period type
    const ipfsCID = await slaContract.methods.ipfsHash().call();
    console.log('[SLA] IPFS CID:', ipfsCID); // Log the IPFS CID
    const messengerAddress = await slaContract.methods.messengerAddress().call();
    console.log('[SLA] Messenger address:', messengerAddress); // Log the messenger address
    const { data } = await axios_1.default.get(`${process.env.IPFS_GATEWAY_URI}/ipfs/${ipfsCID}`);
    return { ...data, periodType, messengerAddress };
}
async function getMessengerPrecision(messengerAddress, networkName) {
    console.log('[MESSENGER] networkName:', networkName);
    const networkURI = constants_1.NETWORKS[networkName];
    if (!networkURI) {
        throw new Error(`No network URI found for network: ${networkName}`);
    }
    const web3 = new web3_1.default(networkURI);
    const messenger = new web3.eth.Contract(abis_1.MessengerABI, messengerAddress);
    return await messenger.methods.messengerPrecision().call();
}
async function fetchWeatherData(location, startDate, endDate) {
    // Convert Unix timestamps to ISO date strings for weather API calls
    const startDateISO = new Date(startDate * 1000).toISOString().split('T')[0];
    const endDateISO = new Date(endDate * 1000).toISOString().split('T')[0];
    const visualCrossingData = await (0, weather_data_sources_1.fetchVisualCrossingData)({ location, startDate: startDateISO, endDate: endDateISO });
    // Add additional data source calls here
    console.log('[WEATHER] fetchVisualCrossingData in index.ts:', { visualCrossingData });
    const weatherDataSources = [
        visualCrossingData,
    ];
    return weatherDataSources;
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
    const totalDays = weatherDataSources[0].length;
    const totalDataSources = weatherDataSources.length;
    const maxDeviation = slaData.maxDeviation / messengerPrecision;
    console.log('[SLO] maxDeviation:', maxDeviation);
    console.log('[SLO] coverageType:', slaData.coverageType);
    let daysMetMaxDeviation = 0;
    let daysInTrip = 0;
    // Get start and end dates Unix timestamp
    const tripStartDateTimestamp = slaData.tripStartDate;
    const tripEndDateTimestamp = slaData.tripEndDate;
    console.log('[SLI] tripStartDateTimeStamp:', tripStartDateTimestamp, ' - readable:', new Date(tripStartDateTimestamp * 1000).toUTCString());
    console.log('[SLI] tripEndDateTimeStamp:', tripEndDateTimestamp, ' - readable:', new Date(tripEndDateTimestamp * 1000).toUTCString());
    // Iterate over the days
    for (let i = 0; i < totalDays; i++) {
        const dailyData = weatherDataSources.map(source => source[i]);
        // Convert the raw date to a Unix timestamp
        const rawDateTimestamp = new Date(dailyData[0].date).getTime() / 1000;
        console.log('[SLI] rawDateTimeStamp:', rawDateTimestamp, ' - readable:', new Date(rawDateTimestamp * 1000).toUTCString());
        // Check if the date is within the trip dates
        if (rawDateTimestamp >= tripStartDateTimestamp && rawDateTimestamp <= tripEndDateTimestamp) {
            daysInTrip++;
            const avgActualTemperature = dailyData.reduce((sum, day) => sum + day.actualTemperature.avg, 0) / totalDataSources;
            const avgActualPrecipitation = dailyData.reduce((sum, day) => sum + day.actualPrecipitation, 0) / totalDataSources;
            const avgHistoricalTemperature = dailyData.reduce((sum, day) => sum + day.historicalTemperature.avg, 0) / totalDataSources;
            const avgHistoricalPrecipitation = dailyData.reduce((sum, day) => sum + day.historicalPrecipitation, 0) / totalDataSources;
            console.log('[SLI-TRIP] readableDate:', new Date(dailyData[0].date).toUTCString());
            console.log('[SLI-TRIP] rawDate:', dailyData[0].date);
            console.log('[SLI-TRIP] avgActualTemperature:', avgActualTemperature);
            console.log('[SLI-TRIP] avgActualPrecipitation:', avgActualPrecipitation);
            console.log('[SLI-TRIP] avgHistoricalTemperature:', avgHistoricalTemperature);
            console.log('[SLI-TRIP] avgHistoricalPrecipitation:', avgHistoricalPrecipitation);
            // Calculate the percentage difference for temperature and precipitation
            const temperatureDifference = calculatePercentageDifference(avgActualTemperature, avgHistoricalTemperature);
            const precipitationDifference = calculatePercentageDifference(avgActualPrecipitation, avgHistoricalPrecipitation);
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
    }
    console.log('[SLI] daysInTrip:', daysInTrip);
    console.log('[SLI] daysMetMaxDeviation:', daysMetMaxDeviation);
    // Calculate the SLI based on the number of days meeting the SLO within the trip dates
    let SLI = 0;
    if (daysInTrip > 0) {
        SLI = (daysMetMaxDeviation / daysInTrip) * 100;
    }
    console.log('[SLI] SLI:', SLI);
    return Math.round(SLI * messengerPrecision);
}
exports['dsla-oracle-travel'] = async (req, res) => {
    try {
        const { data } = req.body;
        const { period_start: periodStart, period_end: periodEnd, address: slaAddress, network_name: networkName } = data;
        // Log entire request body
        console.log(`[POST] Request received with periodStart: ${periodStart}, periodEnd: ${periodEnd}, networkName: ${networkName}`);
        console.log('[POST] Request body:', req.body);
        const requestData = {
            sla_address: slaAddress,
            network_name: networkName,
            sla_monitoring_start: periodStart,
            sla_monitoring_end: periodEnd,
        };
        const slaData = await getSLAData(requestData.sla_address, networkName);
        console.log('[POST] SLA Data:', slaData);
        const location = slaData.coordinates;
        const locationString = `${slaData.coordinates.lat},${slaData.coordinates.long}`;
        console.log('[POST] SLA Data retrieved with location:', location);
        console.log('[POST] Location string conversion:', locationString);
        const messengerPrecision = await getMessengerPrecision(slaData.messengerAddress, networkName);
        console.log('[POST] Messenger Precision:', messengerPrecision);
        const weatherData = await fetchWeatherData(locationString, periodStart, periodEnd);
        console.log("[POST] Fetched weather data:", weatherData);
        const SLI = processDataAndCalculateSLI(weatherData, messengerPrecision, slaData);
        console.log('[POST] Calculated SLI:', SLI);
        res.send({
            jobRunID: req.body.id,
            data: { result: SLI },
        });
    }
    catch (error) {
        console.error('Error:', error.message);
        res.send({
            jobRunID: req.body.id,
            data: { result: null },
            error: error.message,
        });
    }
};
//# sourceMappingURL=index.js.map