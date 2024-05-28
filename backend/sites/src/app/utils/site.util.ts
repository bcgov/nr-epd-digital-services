export class SiteUtil {

    /**
     * Removes all special characters from a given string except alphanumeric characters and spaces.
     * @param input The input string to clean.
     * @returns The cleaned string.
     */
    public async removeSpecialCharacters(input: string): Promise<string> {
        // Allow only alphanumeric characters
        return input.replace(/[^a-zA-Z0-9]/g, '');
    }
}
