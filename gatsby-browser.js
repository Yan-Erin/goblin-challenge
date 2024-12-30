import "./src/styles/global.css"
import React from "react";
import { UserProvider } from  "./src/pages/userContext";

export const wrapRootElement = ({ element }) => (
  <UserProvider>{element}</UserProvider>
);
