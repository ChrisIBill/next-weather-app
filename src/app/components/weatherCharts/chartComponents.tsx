import { CSSObject } from '@emotion/react'
import { ChevronRight, ChevronLeft } from '@mui/icons-material'
import {
    Drawer,
    IconButton,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material'
import React from 'react'
import { ChartDataKeys, ChartIconsMap } from './weatherChart'
import { useTheme } from '@/lib/context'

export interface WeatherChartControlsProps {
    chartKeys: ChartDataKeys[]
    selectedKey: ChartDataKeys
    chartWidth?: number
    handleKeySelect: (e: any, key: ChartDataKeys) => void
}

const drawerWidth = 160

const openMixin = (theme: any): CSSObject => ({
    transition: `${drawerWidth}px 225ms cubic-bezier(0, 0, 0.2, 1) 0ms`,
    overflowX: 'hidden',
    width: `${drawerWidth}px`,
})

const closedMixin = (theme: any): CSSObject => ({
    transition: `${drawerWidth}px 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms`,
    overflowX: 'hidden',
    width: '2.5rem',
})
export const WeatherChartControls: React.FC<WeatherChartControlsProps> = (
    props
) => {
    const [open, setOpen] = React.useState<boolean>(true)
    const theme = useTheme().theme

    return (
        <Drawer
            variant="permanent"
            open={open}
            anchor="right"
            sx={{
                position: 'relative',
                top: '0',
                left: '0',
                ...(open && {
                    ...openMixin(theme),
                    '& .MuiPaper-root': openMixin(theme),
                }),
                ...(!open && {
                    ...closedMixin(theme),
                    '& .MuiPaper-root': closedMixin(theme),
                }),
                '& .MuiPaper-root': {
                    position: 'relative',
                    top: '0',
                    right: '0',
                },
            }}
            style={{}}
        >
            <div>
                <IconButton onClick={() => setOpen(!open)}>
                    {open ? <ChevronRight /> : <ChevronLeft />}
                </IconButton>
            </div>
            <Divider />
            <List>
                {props.chartKeys.map((key) => (
                    <ListItem
                        key={key}
                        disablePadding
                        sx={{ display: 'block' }}
                    >
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'flex-start' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 0,
                                    justifyContent: 'center',
                                }}
                            >
                                {ChartIconsMap[key]}
                            </ListItemIcon>
                            <ListItemText
                                primary={key}
                                sx={{
                                    opacity: open ? 1 : 0,
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    )
}
