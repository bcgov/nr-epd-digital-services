import { nanoid } from "@reduxjs/toolkit";
import { API } from "./endpoints";
import axios from "axios";
import { User } from "oidc-client-ts";
import { getClientSettings } from "../auth/UserManagerSetting";
import { format } from "date-fns";

  
export const formatDateRange = (range: [Date, Date]) => {
    const [startDate, endDate] = range;
    const formattedStartDate = format(startDate, 'dd-MMM-yy');
    const formattedEndDate = format(endDate, 'dd-MMM-yy');
    return `${formattedStartDate} - ${formattedEndDate}`;
};

export function getUser() {
  const oidcStorage = sessionStorage.getItem(
    `oidc.user:` +
      getClientSettings().authority +
      `:` +
      getClientSettings().client_id
  );
  if (!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage);
}

export const consoleLog = (identifier: string, message: any) => {
  console.log(identifier, message);
};

export const generateRequestId = () => {
  return nanoid();
};

export const getAxiosInstance = () => {
  const user = getUser();

  const instance = axios.create({
    baseURL: API,
    timeout: 1000,
    headers: {
      Authorization: "Bearer " + user?.access_token,
      requestID: generateRequestId(),
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });

  return instance;
};
