'use client'
import { CloudTestGenerator, CloudsTest } from '../components/background/clouds'

export default function Page() {
    return (
        <div style={{ width: '100%', height: '100%', overflow: 'scroll' }}>
            <CloudsTest cloudCover={100} />
        </div>
    )
}
