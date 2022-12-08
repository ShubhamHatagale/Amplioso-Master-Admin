import React, { createContext, useEffect, useReducer } from "react";
import { BrowserRouter } from "react-router-dom";
import { reducer, initialState } from "./Reducer/userReducer";
import MasterAdminRouting from "./MasterAdminRoutes";
// export const UserContext = createContext();
function App() {
  // const [state, dispatch] = useReducer(reducer, initialState);
  return (
    // <UserContext.Provider value={{ state, dispatch }}>
    // <BrowserRouter   >
    <BrowserRouter basename={'/master_admin'} >
      <MasterAdminRouting />
    </BrowserRouter>
    // </UserContext.Provider>
  );
}
export default App;
