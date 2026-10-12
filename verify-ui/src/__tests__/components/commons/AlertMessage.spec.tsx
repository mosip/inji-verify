import React from "react";
import AlertMessage from "../../../components/commons/AlertMessage";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { PreloadedState } from "../../../redux/features/verification/verification.slice";
import { AlertMessages } from "../../../utils/config";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {changeLanguage: jest.fn(), language: "en"}
    }),
    initReactI18next: {
        type: "3rdParty",
        init: jest.fn(),
    },
}));

const mockStore = configureMockStore();
describe("AlertMessage", () => {
    test("renders alert message component", () => {
        const store = mockStore({
            verification: PreloadedState,
            alert: { ...AlertMessages().qrUploadSuccess, open: true },
        });

        render(
            <Provider store={store}>
                <AlertMessage />
            </Provider>
        );

        expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
    });

    test("shows the reason as the alert message when error code and reason are both set", () => {
        const store = mockStore({
            verification: PreloadedState,
            alert: {
                title: "Request Failed",
                message: "The wallet declined the request or does not have the requested credentials. Please try again.",
                errorCode: "access_denied",
                errorReason: "user cancelled",
                severity: "error",
                open: true,
            },
        });

        render(
            <Provider store={store}>
                <AlertMessage />
            </Provider>
        );

        expect(screen.getByText("user cancelled")).toBeInTheDocument();
        expect(screen.queryByText(/Error Code/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Reason:/)).not.toBeInTheDocument();
        expect(screen.queryByText(/access_denied/)).not.toBeInTheDocument();
        expect(screen.queryByText(/does not have the requested credentials/)).not.toBeInTheDocument();
    });
});
