import { AppBar, Toolbar } from '@mui/material'
import styles from './navbar.module.css'
import SearchBar from './search-bar'
import Settings from './settings'

export default function NavBar() {
    //TODO: If mobile, render navbar in footer
    return (
        <header className={styles.header}>
            <AppBar className={styles.AppBar}>
                <Toolbar className={styles.Toolbar}>
                    <SearchBar />
                    <Settings />
                </Toolbar>
            </AppBar>
        </header>
    )
}
