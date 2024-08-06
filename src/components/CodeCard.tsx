type CodeCardProps = {
    code: string;
};

const CodeCard = ({ code }: CodeCardProps) => {
    return <div>{code}</div>;
};

export default CodeCard;
