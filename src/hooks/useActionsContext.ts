import React, { useContext } from 'react'
import { ActionsContext } from '../contexts/ActionsContext'


function useActionsContext() {
    return useContext(ActionsContext)
}

export default useActionsContext