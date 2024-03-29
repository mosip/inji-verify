import {convertToTitleCase, getDisplayValue} from "../utils/commonUtils.js";

describe("Functionality tests", () => {
    test("misc utils", () => {
        expect(convertToTitleCase("convertCamelCaseToTitleCase")).toBe("Convert Camel Case To Title Case");
        expect(getDisplayValue("display value")).toBe("display value");
        expect(getDisplayValue(["data1", "data2"])).toBe("data1, data2");
    })

    test("verification utils", async () => {
        // testing VC offline is not possible since resolving web did has some issues
        // web did resolver only supports https protocol by default which makes it difficult to resolve and test the verify functionality
        // let vcStatus = await verify(VC);
        // ex
    })
});
