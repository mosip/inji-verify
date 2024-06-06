import React from 'react';
import Navbar from "./Navbar";
import Copyrights from "./Copyrights";

const PageTemplate = (props: any) => {
    return (
        <div>
            <Navbar/>
            {props.children}
            <Copyrights/>
        </div>
    );
}

export default PageTemplate;
