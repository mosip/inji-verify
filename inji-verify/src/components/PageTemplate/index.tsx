import React from 'react';
import Navbar from "./Navbar";
import Copyrights from "./Copyrights";
import CheckingForInternetConnectivity from "../misc/CheckingForInternetConnectivity";

const PageTemplate = (props: any) => {
    return (
        <div>
            {/* <Navbar/> */}
            {props.children}
            {/* <Copyrights/> */}
            <CheckingForInternetConnectivity/>
        </div>
    );
}

export default PageTemplate;
