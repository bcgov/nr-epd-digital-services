import { nanoid } from '@reduxjs/toolkit';
import { API }  from './endpoints'
import axios from "axios";

export const consoleLog = (identifier,message)=>{
    console.log(identifier,message)
}

export const generateRequestId = () => {
    return nanoid();
}


export const getAxiosInstance = () => {

    const instance = axios.create({
        baseURL: API,
        timeout: 1000,
        headers: {'requestID': generateRequestId(),
        'Access-Control-Allow-Origin':'*' }
      });

      return instance;
}

