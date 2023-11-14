import cx from 'classnames'

interface SkeletonCardProps {
    externalStyles: {
        textarea: string
    }
}

const SkeletonCard = (props: SkeletonCardProps) => {
    const { externalStyles } = props
    return <div className="animate-pulse w-full rounded">
        <div className="bg-pulseGrey w-full h-5 rounded mb-2"></div>
        <div className={cx("bg-pulseGrey w-full rounded", externalStyles?.textarea)}></div>
    </div>
}

export default SkeletonCard