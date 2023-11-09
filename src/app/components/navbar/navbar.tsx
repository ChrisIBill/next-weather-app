import { AppBar, Toolbar } from '@mui/material'
import styles from './navbar.module.scss'
import SearchBar from './search-bar'
import { Settings } from './settings'
import { BorderBottom } from '@mui/icons-material'
import { palette } from '@/lib/color'

export interface NavBarProps {}
const NavBar: React.FC<NavBarProps> = () => {
    //TODO: If mobile, render navbar in footer
    const primary = {
        main: '',
        light: '',
    }
    return (
        <header className={styles.header}>
            <AppBar
                className={styles.AppBar}
                sx={{
                    position: 'relative',
                    zIndex: 20,
                    backgroundColor: 'transparent',
                    borderRadius: '0px 0px 20px 20px',
                    borderBottom: `0.2rem solid ${palette.offWhite}`,
                    boxShadow: 'none',
                }}
            >
                <Toolbar className={styles.Toolbar}>
                    <div className={styles.fillerElement}></div>
                    <div
                        className={styles.titleWrapper}
                        style={{ color: palette.offWhite }}
                    >
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
