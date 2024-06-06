import {useAppSelector} from "../../hooks";
import {ApplicationState} from "../../../types/data-types";

export const useApplicationStateSelector = (selector: (state: ApplicationState) => any) => selector(useAppSelector(state => state.appState));
