import React, { useContext } from 'react'
import { LawContext } from '../contexts/LawContext'

function useLawContext() {
    return useContext(LawContext)
}

export default useLawContext