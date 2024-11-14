import { useZxing } from 'react-zxing';

interface Properties {
    className?: string;
    onDecode: (data: string) => void;
}

export const QrScanner = ({ className, onDecode }: Properties) => {
    const { ref } = useZxing({
        onDecodeResult: (result) => {
            onDecode(result.getText());
        }
    });

    return (
        <div className={className}>
            <video ref={ref}></video>
        </div>
    );
};
