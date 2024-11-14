import { Code } from '@/data';
import { joinCss } from '@/utilities';
import { TOTP, URI } from 'otpauth';
import { useEffect, useState } from 'react';

interface Properties {
    className?: string;
    code: Code;
}

function parseSecretToTotp({ algorithm, digits, name, period, secret }: Code): TOTP {
    try {
        return URI.parse(secret) as TOTP;
    } catch {
        return new TOTP({
            algorithm,
            digits,
            issuer: name,
            period,
            secret,
        });
    }
}

export const TotpDisplay = ({ className, code }: Properties) => {
    const [passcode, setPasscode] = useState('');
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const totp = parseSecretToTotp(code);

        setPasscode(totp.generate());
        setSeconds(totp.period - (Math.floor(Date.now() / 1000) % totp.period));

        const interval = setInterval(() => {
            setPasscode(totp.generate());
            setSeconds(totp.period - (Math.floor(Date.now() / 1000) % totp.period));
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [code]);

    const css = joinCss(
        'flex items-center',
        className,
    );

    return (
        <div className={css}>
            <div className={joinCss(
                'font-mono text-2xl font-semibold border-4 rounded-full pt-1 h-14 w-14 flex',
                'items-center justify-center align-middle mr-4',
                seconds >= 20 ? 'text-green-600 border-green-300' : '',
                seconds < 20 && seconds > 10 ? 'text-amber-500 border-amber-300' : '',
                seconds <= 10 ? 'text-red-600 border-red-300' : '',
                seconds <= 5 ? 'animate-[pulse_1s_ease-in-out_infinite]' : ''
            )}>
                {seconds}
            </div>
            <div className="text-4xl font-mono flex-grow-0 break-all pt-1">
                {passcode}
            </div>
        </div>
    );
};
