import Fab from '@mui/material/Fab'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { RefObject, useEffect, useState } from 'react'

export interface ScrollButtonProps {
    scrollRef: RefObject<HTMLDivElement>
}
export const ScrollButton: React.FC<ScrollButtonProps> = (
    props: ScrollButtonProps
) => {
    const [mounted, setMounted] = useState<boolean>(false)
    const [visible, setVisible] = useState(false)

    const toggleVisible = () => {
        const scrolled = props.scrollRef.current?.scrollTop ?? undefined
        if (!scrolled || scrolled <= 300) setVisible(false)
        else if (scrolled > 300) {
            setVisible(true)
        }
    }
    const scrollToTop = () => {
        props.scrollRef.current!.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    useEffect(() => {
        setMounted(true)
    }, [])
    if (!mounted) return null
    props.scrollRef.current?.addEventListener('scroll', toggleVisible)
    console.log('Event listener added')

    return (
        <Fab
            onClick={scrollToTop}
            sx={{
                position: 'fixed',
                display: visible ? 'inline' : 'none',
                width: '3rem',
                height: '3rem',
                bottom: '1rem',
                right: '1rem',
            }}
        >
            <KeyboardArrowUpIcon />
        </Fab>
    )
}
