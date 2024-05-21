// PreloadImages.js
import React from 'react';

//Preload the images required for offline use case
const PreloadImages = ({ imageUrls }: {imageUrls: string[]}) => {
    return (
        <>
            {imageUrls.map(url => (<img alt="" src={url} className="hidden w-0"/>))}
        </>
    );
};

export default PreloadImages;
