import Header from "./Header";
import Navigation from "./Navigation";

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Header />
            <Navigation />
            <main className="main">
                <div className="content">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default Layout;
