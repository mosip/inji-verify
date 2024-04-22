// PreloadImages.js
import React, { useEffect } from 'react';

const PreloadImages = ({ imageUrls }: {imageUrls: string[]}) => {
    useEffect(() => {
        const preloadImages = async () => {
            try {
                const cache = await caches.open('image-cache');
                await Promise.all(
                    imageUrls.map(async imageUrl => {
                        const cachedResponse = await cache.match(imageUrl);
                        if (!cachedResponse) {
                            await fetch(imageUrl).then(response => {
                                cache.put(imageUrl, response.clone());
                            });
                        }
                    })
                );
            } catch (error) {
                console.error('Error preloading images:', error);
            }
        };

        preloadImages();
    }, [imageUrls]);
    return (
        <>
            {imageUrls.map(url => (<img src={url} style={{display: "none"}} width={0}/>))}
        </>
    );
};

export default PreloadImages;
