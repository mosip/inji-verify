// match fot the occurrence of an uppercase letter
const splitCamelCaseRegex = /([A-Z][a-z]+)/g;

// match if the first char is lower case
const lowercaseStartRegex = /^([a-z])/;

export const convertToTitleCase = (text) => {
    if (!text) return "";
    return text
        // Once match is found, split the words by adding space at the beginning of the natch
        .replace(splitCamelCaseRegex, (match) => ` ${match.charAt(0).toUpperCase()}${match.slice(1)}`)
        // convert the first care of 'text' to capital case
        .replace(lowercaseStartRegex, (match) => match.toUpperCase());
};

export const getDisplayValue = (data) => {
    if (data instanceof Array && data?.length > 0) {
        let displayValue = "";
        data.forEach(value => {
            displayValue += `${value}, `;
        });
        return displayValue.slice(0, displayValue.length - 2);
    }
    return data;
}
