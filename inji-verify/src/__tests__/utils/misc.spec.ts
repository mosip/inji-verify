import {convertToTitleCase, getDisplayValue} from "../../utils/misc";

describe("misc", () => {
    test("", () => {
        expect(convertToTitleCase("policyNumber")).toEqual("Policy Number");
        expect(getDisplayValue(["value1", "value2"])).toEqual("value1, value2");
    })
})