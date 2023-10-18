import SettingsIcon from '@mui/icons-material/Settings'
import styles from './settings.module.css'

export default function Settings() {
    return (
        <div className={styles.settingsButton}>
            <SettingsIcon />
        </div>
    )
}
