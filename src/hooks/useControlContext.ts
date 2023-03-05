import React, { useContext } from 'react'
import { ControlContext } from '../contexts/ControlContext'

function useControlContext() {
    return useContext(ControlContext)
}

export default useControlContext