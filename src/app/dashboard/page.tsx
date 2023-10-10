import React from 'react'
import SearchBar from './components/search-bar'
export default function Dashboard({
    params,
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    return (
        <header>
            <SearchBar />
        </header>
    )
}
