import { HelperContext } from "@/helpers/HelperContext";
import "@/styles/globals.css";
import { useState } from "react";

export default function App({ Component, pageProps }) {
  const [focusedUser, setFocusedUser] = useState(null)
  const [editMode,setEditMode] = useState(false)
  const [toggleAuth,setToggleAuth] = useState(true)
  return (
    <HelperContext.Provider value={{toggleAuth,focusedUser, setFocusedUser,editMode,setEditMode}}>
      <Component {...pageProps} />
    </HelperContext.Provider>);
}
