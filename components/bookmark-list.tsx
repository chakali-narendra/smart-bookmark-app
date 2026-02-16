'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { deleteBookmark } from '@/lib/actions'
import { Trash2Icon, ExternalLinkIcon, BookmarkIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Bookmark {
    id: string
    title: string
    url: string
    created_at: string
}

export default function BookmarkList({ initialBookmarks, userId }: { initialBookmarks: Bookmark[], userId: string }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const supabase = createClient()

    useEffect(() => {
        // Subscribe to realtime changes
        const channel = supabase
            .channel('bookmarks_realtime')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((prev) => [payload.new as Bookmark, ...prev])
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, userId])

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="grid gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
                {bookmarks.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center col-span-full py-20 text-slate-500"
                    >
                        <BookmarkIcon className="w-12 h-12 mb-4 opacity-20" />
                        <p>No bookmarks yet. Add your first one!</p>
                    </motion.div>
                ) : (
                    bookmarks.map((bookmark) => (
                        <motion.div
                            key={bookmark.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            className="group glass rounded-2xl p-5 hover:border-blue-500/50 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                                        {bookmark.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm truncate mt-1">
                                        {bookmark.url}
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    <a
                                        href={bookmark.url.startsWith('http') ? bookmark.url : `https://${bookmark.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                                    >
                                        <ExternalLinkIcon className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={async () => {
                                            if (confirm('Are you sure you want to delete this bookmark?')) {
                                                await deleteBookmark(bookmark.id)
                                            }
                                        }}
                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                    >
                                        <Trash2Icon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 text-[10px] text-slate-600 uppercase tracking-wider font-medium">
                                {mounted ? new Date(bookmark.created_at).toLocaleDateString() : '...'}
                            </div>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>
    )
}
