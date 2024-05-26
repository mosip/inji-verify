import React from 'react';

function Loader(props: any) {
    return (
        <div data-testid="loader" className="w-[56px] md:w-[76px] aspect-square rounded-[50%] border-[3px] border-l-primary border-t-primary animate-spin">
        </div>
    );
}

export default Loader;
