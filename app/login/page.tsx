import GoogleSignInButton from '@/components/auth-button'
import { BookmarkIcon } from 'lucide-react'

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-slate-950">
            <div className="w-full max-w-md p-8 glass rounded-3xl animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center mb-10 space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                        <BookmarkIcon className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Smart Bookmark</h1>
                        <p className="mt-2 text-slate-400">Save your favorite links in one place</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <GoogleSignInButton />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-700/50"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="px-2 glass text-slate-500">Google Auth Only</span>
                        </div>
                    </div>

                    <p className="text-xs text-center text-slate-500">
                        By signing in, you agree to our terms and privacy policy.
                    </p>
                </div>
            </div>
        </div>
    )
}
