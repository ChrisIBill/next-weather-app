import './globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import styles from './layout.module.css'
import NavBar from './components/navbar/navbar'
import UserPrefs from '../lib/user'
import palette from './globals.scss'
import { ThemeProvider } from '@/lib/context'

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
                <ThemeProvider>
                    <NavBar />
                    <main className={styles.main}>{children}</main>
                </ThemeProvider>
            </body>
        </html>
    )
}
