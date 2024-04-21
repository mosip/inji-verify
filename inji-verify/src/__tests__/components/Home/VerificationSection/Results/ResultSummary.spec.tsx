import React from "react";
import {render, screen} from "@testing-library/react";
import ResultSummary from "../../../../../components/Home/VerificationSection/Result/ResultSummary";

describe("Result summary", () => {
    test("", () => {
        render(<ResultSummary success/>)
        expect(screen.getByText("Congratulations, the given credential is valid!")).toBeInTheDocument();
    });
    test("", () => {
        render(<ResultSummary success={false}/>)
        expect(screen.getByText("Unfortunately, the given credential is invalid!")).toBeInTheDocument();
    });
})
