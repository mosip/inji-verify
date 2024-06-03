import React from 'react';
import VerificationProgressTracker from "../components/Home/VerificationProgressTracker";
import VerificationSection from "../components/Home/VerificationSection";
import PageTemplate from "../components/PageTemplate";
import Header from "../components/Home/Header";

function Home(props: any) {
    return (
        <PageTemplate>
            <div className="grid columns-12">
                <div className="col-start-1 col-end-12 bg-[#FAFBFD] text-center">
                    <Header/>
                </div>
                <div
                    className="col-start-1 col-end-12 lg:col-start-1 lg:col-span-6 lg:bg-[#FAFBFD] xs:w-[100vw] lg:max-w-[50vw]">
                    <VerificationProgressTracker/>
                </div>
                <div className="col-start-1 col-end-12 lg:col-start-7 lg:col-end-12 xs:[100vw] lg:max-w-[50vw]">
                    <VerificationSection/>
                </div>
            </div>
        </PageTemplate>
    );
}

export default Home;
