import React from 'react';
import Loader from "./Loader";

function LoaderWithBackdrop(props: any) {
    return (
        <div className="fixed z-[100000] bg-black opacity-50 top-0 left-0 w-full h-full">
            <Loader className="mx-auto mt-[30vh]"/>
        </div>
    );
}

export default LoaderWithBackdrop;
