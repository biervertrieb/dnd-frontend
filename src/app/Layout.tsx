import Header from "./Header";
import Navigation from "./Navigation";

const Layout = ({ children, nonav }: { children: React.ReactNode, nonav?: boolean }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950">
            <div className="fixed inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-amber-800/10 pointer-events-none"></div>

            <Header />
            {!nonav && <Navigation />}
            <main>
                {children}
            </main>
        </div>
    );
}

export default Layout;
