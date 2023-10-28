import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import styles from './layout.module.css'
import NavBar from './components/navbar/navbar'
import UserPrefs from '../lib/user'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Drizzle',
    description: 'Generated by create next app',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={styles.html}>
            <body className={styles.body}>
                <NavBar />
                <main className={styles.main}>{children}</main>
            </body>
        </html>
    )
}
