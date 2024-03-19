import axios from 'axios';

import { StorageKey } from '@/utils/constants';

const storageType = window.sessionStorage;

/**
 * @class ConfigService
 * A singleton wrapper for acquiring and storing configuration data
 * in session storage
 */
export default class ConfigService {
  private static _instance: ConfigService;

  /**
   * @constructor
   */
  constructor() {
    if (!ConfigService._instance) {
      ConfigService._instance = this;
    }

    return ConfigService._instance;
  }

  /**
   * @function init
   * Initializes the ConfigService singleton
   * @returns {Promise<ConfigService>} An instance of ConfigService
   */
  public static async init(): Promise<ConfigService> {
    return new Promise((resolve, reject) => {
      if (storageType.getItem(StorageKey.CONFIG) === null) {
        axios
          .get('/config')
          .then(({ data }) => {
            storageType.setItem(StorageKey.CONFIG, JSON.stringify(data));
            resolve(new ConfigService());
          })
          .catch((err) => {
            storageType.removeItem(StorageKey.CONFIG);
            reject(`Failed to initialize configuration: ${err}`);
          });
      } else {
        resolve(new ConfigService());
      }
    });
  }

  /**
   * @function getConfig
   * Fetches and returns the config object if available
   * @returns {any | undefined} The config object if available
   */
  public getConfig(): any | undefined {
    try {
      const cfgString = storageType.getItem(StorageKey.CONFIG);
      return cfgString ? JSON.parse(cfgString) : undefined;
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error(`Missing configuration: ${err}`);
      return undefined;
    }
  }
}