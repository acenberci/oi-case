import ProductTable from "@/components/productTable";
import UserDetails from "@/components/userDetails";
import UserTable from "@/components/userTable";
import { HelperContext } from "@/helpers/HelperContext";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

export default function Home() {
  const { editMode,toggleAuth } = useContext(HelperContext)
  const navigate = useRouter()
  useEffect(() => {
    if(toggleAuth)axios.get("http://localhost:3001/users/auth", { headers: { accessToken: Cookies.get("accessToken"), }, }).then((response) => {
      if (!response.data.error) {
        navigate.replace("/")
      } else {
        Cookies.remove("accessToken")
        navigate.replace("/login")
      }
    })
  }, []);
  return (<>
    <div className="px-5">
      <UserTable></UserTable>
      {editMode && <UserDetails></UserDetails>}
      <ProductTable></ProductTable>
    </div>
  </>
  );
}
