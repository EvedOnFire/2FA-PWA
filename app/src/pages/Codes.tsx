import { TotpDisplay } from '@/components';
import { Code, getAll, remove } from '@/data';
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const Codes = () => {
    const [codes, setCodes] = useState<Code[]>([]);

    useEffect(() => {
        getCodes();
    }, []);

    async function getCodes() {
        setCodes(await getAll());
    }

    async function removeCode(code: Code) {
        if (!confirm('Are you sure you want to delete this code?')) return;

        await remove(code.id);

        getCodes();
    }

    return (
        <>
            <Link
                to="/new"
                className="flex items-center text-white bg-green-600 font-semibold w-full px-6 py-4"
            >
                <PlusIcon className="w-6 h-6" />
                New Code
            </Link>

            <ul>
                {codes.map((code) => (
                    <li key={code.id} className="flex flex-col items-stretch border-b border-gray-300">
                        <div className="bg-gray-200 px-6 py-1 text-sm font-semibold">
                            {code.name}
                        </div>

                        <div className="px-6 py-4 flex items-center">
                            <TotpDisplay code={code} />

                            <div className="ml-auto mr-4 md:mr-6">
                                <Link to={`/edit/${code.id}`} className="text-blue-600">
                                    <PencilSquareIcon className="w-6 h-6" />
                                </Link>
                            </div>
                            <div>
                                <button className="text-red-600" onClick={() => removeCode(code)}>
                                    <TrashIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
                {codes.length === 0 && (
                    <li className="px-6 py-4 text-center">No codes found</li>
                )}
            </ul>
        </>
    );
};
