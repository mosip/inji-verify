import React from 'react';
import CheckingForInternetConnectivity from "../misc/CheckingForInternetConnectivity";

const PageTemplate = (props: any) => {
    return (
        <div>
            {props.children}
            <CheckingForInternetConnectivity/>
        </div>
    );
}

export default PageTemplate;
