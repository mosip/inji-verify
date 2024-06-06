import {useAppSelector} from "../../hooks";

export const useAlertsSelector = () => useAppSelector(state => state.alert);
