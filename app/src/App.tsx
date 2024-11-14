import { joinCss } from '@/utilities/css';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { Link, NavLink, NavLinkRenderProps, Outlet, useLocation } from 'react-router-dom';

function getWideLinkCss({ isActive }: NavLinkRenderProps) {
    return joinCss(
        'px-6 py-4 rounded-lg',
        isActive
            ? 'font-black border-b-4 border-blue-300'
            : 'font-medium hover:bg-blue-500'
    );
}

function getMobileLinkCss({ isActive }: NavLinkRenderProps) {
    return joinCss(
        'px-6 py-4',
        isActive ? 'bg-blue-500 font-black border-b-4 border-blue-300' : ''
    );
}

const links = [
    { to: '/', label: 'Codes' },
    { to: '/about', label: 'About' }
];

function App() {
    const [showMenu, setShowMenu] = useState(true);

    const location = useLocation();

    useEffect(() => {
        setShowMenu(false);
    }, [location]);

    function toggleMenu() {
        setShowMenu((showMenu) => !showMenu);
    }

    return (
        <>
            <header className="flex items-center px-6 py-4 bg-blue-600 relative">
                <Link to="/" className="text-2xl md:text-4xl text-gray-200 font-serif font-semibold mr-12">
                    TOTP Offline
                </Link>

                <nav className="hidden md:flex items-center text-white gap-x-6">
                    {links.map(({ to, label }) => (
                        <NavLink key={to} to={to} className={getWideLinkCss}>
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {showMenu && (
                    <nav className="md:hidden flex flex-col absolute text-white bg-blue-700 w-full left-0 top-full">
                        {links.map(({ to, label }) => (
                            <NavLink key={to} to={to} className={getMobileLinkCss}>
                                {label}
                            </NavLink>
                        ))}
                    </nav>
                )}

                <button onClick={toggleMenu} className="md:hidden ml-auto">
                    {showMenu ? (
                        <XMarkIcon className="w-6 h-6 text-white" />
                    ) : (
                        <Bars3Icon className="w-6 h-6 text-white" />
                    )}
                </button>
            </header>

            <main>
                <Outlet />
            </main>
        </>
    );
}

export default App;
