import React from 'react';
import VerificationProgressTracker from "../components/Home/VerificationProgressTracker";
import VerificationSection from "../components/Home/VerificationSection";
import PageTemplate from "../components/PageTemplate";
import Header from "../components/Home/Header";

function Home(props: any) {
    return (
        <PageTemplate>
            <div>
                <div className="w-full bg-[#FAFBFD] text-center">
                    <Header/>
                </div>
                <div className="grid grid-cols-12">
                    <div
                        className="col-start-1 col-end-13 lg:col-start-1 lg:col-span-6 lg:bg-[#FAFBFD] xs:w-[100vw] lg:max-w-[50vw]">
                        <VerificationProgressTracker/>
                    </div>
                    <div className="col-start-1 col-end-13 lg:col-start-7 lg:col-end-13 xs:[100vw] lg:max-w-[50vw]">
                        <VerificationSection/>
                    </div>
                </div>
            </div>
        </PageTemplate>
    );
}

export default Home;
