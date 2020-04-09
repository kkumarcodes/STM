import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import authReducer from '../reducers/auth';
import chatReducer from '../reducers/chat';
import practitionerReducer from '../reducers/practitioner';
import sessionReducer from '../reducers/session';
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistSessionConfig = {
    key: 'session',
    version: 0,
    storage,
    stateReconciler: autoMergeLevel2
}

const persistPracConfig = {
    key: 'practitioner',
    version: 0,
    storage,
    stateReconciler: autoMergeLevel2
}

const persistedSessionReducer = persistReducer(persistSessionConfig, sessionReducer);
const persistedPracReducer = persistReducer(persistPracConfig, practitionerReducer);

export default () => {

    const appReducer = combineReducers({
        user: authReducer,
        rooms: chatReducer,
        practitioner: persistedPracReducer,
        session: persistedSessionReducer
    });

    const rootReducer = (state, action) => {

        if (action.type === "LOGOUT") {
            Object.keys(state).forEach(key => {
                storage.removeItem(`persist:${key}`);
            });
            state = undefined;
        }
        return appReducer(state, action);
    };

    const store = createStore(
        rootReducer,
        composeEnhancers(applyMiddleware(thunk)));

    let persistor = persistStore(store);

    return { store, persistor };
}




