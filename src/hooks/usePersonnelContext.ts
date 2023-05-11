import React, { useContext } from "react";
import { PersonnelContext } from "../contexts/PersonnelContext";

function usePersonnelContext() {
  return useContext(PersonnelContext);
}

export default usePersonnelContext;
