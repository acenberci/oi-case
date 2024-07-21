import { HelperContext } from "@/helpers/HelperContext";
import "@/styles/globals.css";
import { useState } from "react";
import 'devextreme/dist/css/dx.light.css';

export default function App({ Component, pageProps }) {
  const [users, setUsers] = useState([]);
  const [focusedUser, setFocusedUser] = useState(null)
  const [editMode,setEditMode] = useState(false)
  const [toggleAuth,] = useState(true)
  return (
    <HelperContext.Provider value={{toggleAuth,focusedUser, setFocusedUser,editMode,setEditMode,users, setUsers}}>
      <Component {...pageProps} />
    </HelperContext.Provider>);
}
