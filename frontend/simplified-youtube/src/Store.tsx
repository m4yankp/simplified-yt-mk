import React, { useReducer } from 'react';
import { IVideos, IAction } from './Interfaces';


const initialState: IVideos = {
   allVideos:{}
}

export const Store = React.createContext<IVideos | any >(initialState);

function reducer(state: IVideos, action: IAction): IVideos {
    
    switch(action.type)
    {
        case 'FETCH_VIDEOS':
            return {...state, allVideos: action.payload }
        default: 
            return state
    }
}

export function StoreProvider(props: any): JSX.Element {
    const [state, dispatch] = useReducer(reducer,initialState);
    return <Store.Provider value={{state, dispatch}}>{props.children}</Store.Provider>
}