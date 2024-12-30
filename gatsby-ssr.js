import React from "react";
import { UserProvider } from  "./src/content/userContext";

export const wrapRootElement = ({ element }) => (
  <UserProvider>{element}</UserProvider>
);
