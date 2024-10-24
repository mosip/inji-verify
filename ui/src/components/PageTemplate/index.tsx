import React from 'react';
import Navbar from "./Navbar";
import Copyrights from "./Copyrights";
import CheckingForInternetConnectivity from "../misc/CheckingForInternetConnectivity";
import Header from '../Home/Header';

const PageTemplate = (props: any) => {
    return (
        <div>
            <Navbar/>
            <div className="w-full bg-pageBackGroundColor text-center">
                <Header/>
            </div>
            {props.children}
            <Copyrights/>
            <CheckingForInternetConnectivity/>
        </div>
    );
}

export default PageTemplate;
