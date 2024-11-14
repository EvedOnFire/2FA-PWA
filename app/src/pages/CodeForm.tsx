import { Input, QrScanner } from '@/components';
import { add, Code, edit, get, TotpAlgorithm, totpAlgorithms } from '@/data';
import { joinCss } from '@/utilities';
import { CameraIcon, ChevronDownIcon, ChevronUpIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import { TOTP, URI } from 'otpauth';
import { useState } from 'react';
import { LoaderFunction, useNavigate, useLoaderData } from 'react-router-dom';

// eslint-disable-next-line react-refresh/only-export-components
export const codeFormLoader: LoaderFunction = async ({ params }) => {
    const id = params?.id ? +params.id : 0;

    const code = await get(id);

    if (!code) {
        return {
            code: {
                algorithm: 'SHA1',
                digits: 6,
                name: '',
                period: 30,
                secret: '',
            }
        };
    }

    return { code };
};

export const CodeForm = () => {
    const { code } = useLoaderData() as { code: Code };

    const [algorithm, setAlgorithm] = useState<TotpAlgorithm>(code.algorithm);
    const [digits, setDigits] = useState(code.digits);
    const [name, setName] = useState(code.name);
    const [period, setPeriod] = useState(code.period);
    const [secret, setSecret] = useState(code.secret);
    const [id] = useState(code.id || 0);

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [showSecret, setShowSecret] = useState(false);

    const navigate = useNavigate();

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!name || !secret || !algorithm || !digits || !period) return;

        if (id && id > 0) {
            edit({ id, algorithm, digits, name, period, secret });
        } else {
            add({ algorithm, digits, name, period, secret });
        }

        navigate('/');
    }

    return (
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <div className="flex gap-x-2">
                    <Input
                        className="flex-grow"
                        label="Secret"
                        name="secret"
                        onChange={(event) => setSecret(event.target.value)}
                        value={secret}
                        type={showSecret ? 'text' : 'password'}
                    />

                    <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className={joinCss(
                            'self-end px-4 py-2 rounded',
                            showSecret ? 'bg-red-600 text-white' : 'bg-gray-300'
                        )}
                    >
                        {showSecret ? (
                            <EyeIcon className="w-6 h-6" />
                        ) : (
                            <EyeSlashIcon className="w-6 h-6" />
                        )}
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => setShowScanner(!showScanner)}
                    className={joinCss(
                        'self-end px-4 py-2 rounded w-full flex justify-center',
                        showScanner ? 'bg-blue-600 text-white' : 'bg-gray-300'
                    )}
                >
                    <CameraIcon className="w-6 h-6" />
                </button>
            </div>

            {showScanner && (
                <QrScanner
                    onDecode={(data) => {
                        setSecret(data);
                        setShowScanner(false);

                        try {
                            const totp = URI.parse(data) as TOTP;

                            setName(totp.issuer);
                            setAlgorithm(totp.algorithm as TotpAlgorithm);
                            setDigits(totp.digits);
                            setPeriod(totp.period);

                            console.log(totp);
                        } catch {
                            // Ignore errors
                        }
                    }}
                    className="flex justify-center"
                />
            )}

            <Input label="Name" name="name" onInput={setName} defaultValue={name} />

            <button
                type="button"
                className="flex items-center"
                onClick={() => setShowAdvanced(!showAdvanced)}
            >
                Advanced
                {showAdvanced ? (
                    <ChevronUpIcon className="w-4 h-4" />
                ) : (
                    <ChevronDownIcon className="w-4 h-4" />
                )}
            </button>

            <div className={joinCss(
                'space-y-6',
                showAdvanced ? 'block' : 'hidden'
            )}>
                <div>
                    <label
                        htmlFor="algorithm"
                        className="block text-sm font-semibold text-gray-700"
                    >
                        Algorithm
                    </label>

                    <select
                        className={joinCss(
                            'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md',
                            'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                        )}
                        onChange={(event) => setAlgorithm(event.currentTarget.value as TotpAlgorithm)}
                        name="algorithm"
                        id="algorithm"
                        defaultValue={algorithm}
                    >
                        {totpAlgorithms.map((algorithm) => (
                            <option key={algorithm} value={algorithm}>
                                {algorithm}
                            </option>
                        ))}
                    </select>
                </div>

                <Input
                    type="number"
                    label="Digits"
                    name="digits"
                    onInput={value => setDigits(+value)}
                    defaultValue={digits}
                />
                <Input
                    type="number"
                    label="Expiration Period (in seconds)"
                    name="period"
                    onInput={value => setPeriod(+value)}
                    defaultValue={period}
                />
            </div>

            <button
                type="submit"
                className={joinCss(
                    'bg-green-600 text-white font-semibold w-full px-4 py-2 rounded-lg',
                    !name || !secret ? 'opacity-50 cursor-not-allowed' : ''
                )}
                disabled={!name || !secret}
            >
                Save
            </button>
        </form>
    );
};

