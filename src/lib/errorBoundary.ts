import React, { Component, ErrorInfo, ReactNode } from 'react'
import logger from './pinoLogger'

interface Props {
    fallback: ReactNode
    children?: ReactNode
}

interface State {
    hasError: boolean
}

const ErrorBoundaryLogger = logger.child({ component: 'ErrorBoundary' })

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    public static getDerivedStateFromError(_: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        ErrorBoundaryLogger.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback
        }

        return this.props.children
    }
}

export default ErrorBoundary
