import Button from "."
import styles from './gradient.module.css'
import type { ButtonProps } from "@/components/Button";

const GradientButton = (props: ButtonProps) => {
    const {children} = props
    return (<div className={styles.container}>
        {/* @ts-ignore */}
        <Button externalClass={styles.gradient} {...props}>
            {children}
        </Button>
    </div>)

}

export default GradientButton;