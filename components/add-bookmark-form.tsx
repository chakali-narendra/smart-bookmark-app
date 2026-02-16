'use client'

import { useRef, useState } from 'react'
import { addBookmark } from '@/lib/actions'
import { PlusIcon, Loader2Icon } from 'lucide-react'

export default function AddBookmarkForm() {
    const formRef = useRef<HTMLFormElement>(null)
    const [isPending, setIsPending] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true)
        try {
            await addBookmark(formData)
            formRef.current?.reset()
        } catch (error) {
            console.error(error)
            alert('Failed to add bookmark')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <form
            ref={formRef}
            action={handleSubmit}
            className="p-6 glass rounded-2xl border border-white/5 shadow-2xl space-y-4"
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-slate-400 ml-1">
                        Bookmark Title
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        placeholder="e.g. My Portfolio"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="url" className="text-sm font-medium text-slate-400 ml-1">
                        URL
                    </label>
                    <input
                        id="url"
                        name="url"
                        type="url"
                        required
                        placeholder="e.g. https://example.com"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>
            <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? (
                    <Loader2Icon className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        <PlusIcon className="w-5 h-5" />
                        <span>Add Bookmark</span>
                    </>
                )}
            </button>
        </form>
    )
}
