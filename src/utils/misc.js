export const convertToTitleCase = (text) => {
    if (!text) return "";
    return text
        .replace(/([A-Z][a-z]+)/g, (match) => ` ${match.charAt(0).toUpperCase()}${match.slice(1)}`)
        .replace(/^([a-z])/, (match) => match.toUpperCase());
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
