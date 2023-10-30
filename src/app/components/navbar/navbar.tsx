import { AppBar, Toolbar } from '@mui/material'
import styles from './navbar.module.css'
import SearchBar from './search-bar'
import { Settings } from './settings'

export interface NavBarProps {}
const NavBar: React.FC<NavBarProps> = () => {
    //TODO: If mobile, render navbar in footer
    return (
        <header className={styles.header}>
            <AppBar className={styles.AppBar}>
                <Toolbar className={styles.Toolbar}>
                    <div className={styles.fillerElement}></div>
                    <div className={styles.titleWrapper}>
                        <h1 className={styles.title}>Drizzle</h1>
                        <h3 className={styles.subtitle}>
                            (Yet Another Weather App)
                        </h3>
                    </div>
                    <div className={styles.itemsWrapper}>
                        <SearchBar />
                        <Settings />
                    </div>
                </Toolbar>
            </AppBar>
        </header>
    )
}

export default NavBar
