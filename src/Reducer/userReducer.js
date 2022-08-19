export const initialState = null;
export const reducer = (state, action) => {
    if (action.type === "COMPANY") {
        return action.payload;
    } else {
        return state;
    }
}