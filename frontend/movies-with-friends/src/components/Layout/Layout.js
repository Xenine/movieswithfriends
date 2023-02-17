import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'

const Layout = () => {
    return (
        <div style={{ height: '100%' }}>
            <Navbar />
            <div className="wrapper clear">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout
