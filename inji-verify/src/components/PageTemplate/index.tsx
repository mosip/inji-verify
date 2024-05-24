import React from 'react';
import Navbar from "./Navbar";
import Copyrights from "./Copyrights";

const PageTemplate = (props: any) => {
    return (
        <div className="xs:px-4 md:px-20">
            <Navbar/>
            {props.children}
            <Copyrights/>
        </div>
    );
}

export default PageTemplate;
