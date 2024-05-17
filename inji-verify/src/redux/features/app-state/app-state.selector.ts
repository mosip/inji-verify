import {useAppSelector} from "../../hooks";
import {ApplicationState} from "../../../types/data-types";

export const useAppStateSelector = (selector: (state: ApplicationState) => any) => selector(useAppSelector(state => state.appState));
