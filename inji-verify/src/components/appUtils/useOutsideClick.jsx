import { useEffect } from 'react';

/**
 * A custom hook to detect clicks outside of a specified element.
 * @param {object} ref - A React ref for the element to detect outside clicks for.
 * @param {function} callback - A function to call when an outside click is detected.
 */
const useOutsideClick = (ref, callback) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback(); // Call the callback when a click outside is detected
            }
        };

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup event listener on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, callback]);
};

export default useOutsideClick;