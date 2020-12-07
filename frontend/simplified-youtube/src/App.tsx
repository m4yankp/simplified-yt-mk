import React from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Routes from './Routes';
import { StoreProvider } from "./Store";


export default function App():JSX.Element {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
        <StoreProvider>
          <Routes />
        </StoreProvider>
      <Footer />
    </div>
  );
}

