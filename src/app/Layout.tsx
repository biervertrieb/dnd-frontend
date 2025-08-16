import Header from "./Header";
import Navigation from "./Navigation";

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950">
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
