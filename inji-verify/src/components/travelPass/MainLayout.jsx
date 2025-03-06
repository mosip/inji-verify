import Navbar from "./Navbar";


function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

export default MainLayout;