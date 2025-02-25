import { nanoid } from "@reduxjs/toolkit";
import { API, CAMUNDA_API, COMS_API, USERS_API } from "./endpoints";
import axios from "axios";
import { User } from "oidc-client-ts";
import { getClientSettings } from "../auth/UserManagerSetting";

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

export const getAxiosInstanceForCamunda = () => {
  const user = getUser();

  const instance = axios.create({
    baseURL: CAMUNDA_API,
    timeout: 1000,
    headers: {
      Authorization: "Bearer " + user?.access_token,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });

  return instance;
};

export const getAxiosInstanceForUsers = () => {
  const user = getUser();
  const instance = axios.create({
    baseURL: USERS_API,
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

export const getAxiosInstanceForComs = () => {
  const user = getUser();
  const instance = axios.create({
    baseURL: COMS_API,
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
