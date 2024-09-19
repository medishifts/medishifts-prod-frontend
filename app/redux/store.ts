import {configureStore,combineReducers} from '@reduxjs/toolkit'
import authReducer from "./features/auth-slice"
import {useSelector,TypedUseSelectorHook} from 'react-redux'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import profileReducer from './features/profile-slice'

const persistConfigure = {
    key: 'persist-store',
    version: 1,
    storage
}

const reducer = combineReducers({
    authReducer,
    profileReducer
})

const persistedReducer = persistReducer(persistConfigure,reducer);


export const store = configureStore({
    reducer:persistedReducer
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;