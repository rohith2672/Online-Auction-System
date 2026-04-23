import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
    credits?: number;
    showWallet?: boolean;
    username?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, credits, showWallet, username }) => {
    return (
        <div className="App">
            <Navbar credits={credits} showWallet={showWallet} username={username} />
            <main className="dashboard">
                {children}
            </main>
        </div>
    );
};

export default Layout;
