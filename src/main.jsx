import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import "./App.css";
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from "react-redux";
import { rootReducer } from './reducer/index';
import { Toaster } from 'react-hot-toast';
import { ScrollToTop } from './components/ScrollToTop';

const store = configureStore({
    reducer: rootReducer
});

createRoot(document.getElementById('root')).render(
        <Provider store={store}>
            <BrowserRouter>
                <ScrollToTop/>
                <App />
                <Toaster/>
            </BrowserRouter>
        </Provider>
);

