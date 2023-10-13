import React from 'react'
import SearchBar from './components/search-bar'
import styles from './page.module.css'

export default function Dashboard({
    params,
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    return (
        <header className={styles.header}>
            <SearchBar />
        </header>
    )
}
