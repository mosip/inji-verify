import React from 'react';
import VerificationProgressTracker from "../components/Home/VerificationProgressTracker";
import VerificationSection from "../components/Home/VerificationSection";
import Copyrights from "../components/Home/VerificationProgressTracker/Copyrights";

function Home(props: any) {
    return (
        <div>
            <div className="grid columns-12">
                <div className="xs:col-end-12 md:col-start-1 md:col-span-6 bg-[#FAFBFD] xs:w-[100vw] md:w-[50vw]">
                    <VerificationProgressTracker/>
                </div>
                <div className="xs:col-end-12 md:col-start-7 md:col-end-12 xs:[100vw] md:w-[50vw]">
                    <VerificationSection/>
                </div>
            </div>
            <Copyrights/>
        </div>
    );
}

export default Home;
