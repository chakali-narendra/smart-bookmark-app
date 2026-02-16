import Link from 'next/link'
import { AlertCircleIcon } from 'lucide-react'

export default function AuthErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-slate-950">
            <div className="w-full max-w-md p-8 glass rounded-3xl text-center space-y-6">
                <div className="flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-2xl border border-red-500/20 mx-auto">
                    <AlertCircleIcon className="w-8 h-8 text-red-500" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-white">Authentication Error</h1>
                    <p className="text-slate-400">
                        There was a problem signing you in. Please try again or contact support if the problem persists.
                    </p>
                </div>
                <Link
                    href="/login"
                    className="inline-block px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all"
                >
                    Return to Login
                </Link>
            </div>
        </div>
    )
}
