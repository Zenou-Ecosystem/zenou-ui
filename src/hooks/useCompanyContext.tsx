import React, { useContext } from 'react'
import { CompanyContext } from '../contexts/CompanyContext'

function useCompanyContext() {
    return useContext(CompanyContext)
}

export default useCompanyContext