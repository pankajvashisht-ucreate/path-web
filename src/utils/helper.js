import axios from "axios";
const isProduction = process.env.REACT_APP_IS_PRODUCTION;
const url = {
    true: process.env.REACT_APP_PROD_URL,
    false: process.env.REACT_APP_UAT_URL
};
const instance = axios.create({
  baseURL: url[isProduction],
  headers: {
    "x-access-token": process.env.REACT_APP_API_TOKEN,
    "Content-Type": "application/json",
    role: "member"
  }
});
export const getJourneyInfo = (journeyId) => {
  return instance.get(`/journey/${journeyId}/locations`);
};