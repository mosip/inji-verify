// PreloadImages.js
import React from 'react';

//Preload the images required for offline use case
const PreloadImages = ({ imageUrls }: {imageUrls: string[]}) => {
    return (
        <>
            {imageUrls.map((url,index) => (<img key={index} src={url} className="hidden w-0" alt=""/>))}
        </>
    );
};

export default PreloadImages;
