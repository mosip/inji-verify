import React from 'react';
import {NavbarContainer} from "./styles";

function Navbar(props: any) {
    const logoImageName = process.env.REACT_APP_LOGO_IMAGE;
    // Logo goes here
    return (
        <NavbarContainer>
            <img src={`/assets/images/${logoImageName}`}/>
        </NavbarContainer>
    );
}

export default Navbar;
