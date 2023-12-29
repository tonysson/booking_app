import React, { useContext, useState } from 'react';
import Toast from '../components/Toast';
import * as  apiClient from '../api-client'
import { useQuery } from 'react-query';

type ToastMessage = {
    message : string;
    type : "SUCCESS" | "ERROR" 
}

type AppContext = {
    showToast: (toastMessage: ToastMessage) => void ;
    isLoggedIn: boolean ;
}

// Context
const AppContext = React.createContext<AppContext | undefined>(undefined);

// Provider
export const AppContextProvider = ({children} : {children : React.ReactNode}) => {

    const [toast , setToast] = useState<ToastMessage | undefined>(undefined)
    const { isError } = useQuery("validateToken", apiClient.validateToken,{
        retry : false,
    })


  return (
    <AppContext.Provider value={{
        showToast : (toastMessage) => {
            setToast(toastMessage)
        },
        isLoggedIn: !isError
    }}>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(undefined)}/>}
        {children}
    </AppContext.Provider>
  )
}



// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    const context = useContext(AppContext)
    return context as AppContext
}