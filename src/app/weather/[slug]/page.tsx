export default function Page({
    params,
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    console.log(searchParams)
    return (
        <div>
            <h1>My Page</h1>
            <h2>params: {params.slug}</h2>
            <h2>searchParams: {JSON.stringify(searchParams)}</h2>
        </div>
    )
}
