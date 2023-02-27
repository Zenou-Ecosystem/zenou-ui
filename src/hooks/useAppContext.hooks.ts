import React, { useContext } from 'react'
import { ApplicationContext } from '../contexts/AppContext'

function useAppContext() {
  return useContext(ApplicationContext);
}

export default useAppContext