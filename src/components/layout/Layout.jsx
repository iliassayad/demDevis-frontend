import CustomNavbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-vh-100 bg-light">
      <CustomNavbar />
      <main className="pb-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;