interface ButtonProps {
    onClick?: () => void;
    externalClass?: string;
    children: React.ReactNode
    type?: "button" | "submit" | "reset" | undefined;
    disabled?: boolean
}

const Button = (props: ButtonProps) => {
    const {children, onClick, externalClass, ...rest} = props
    return <button onClick={onClick} className={externalClass} {...rest}>{children}</button>
}

export default Button;

export type {ButtonProps};