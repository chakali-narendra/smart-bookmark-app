import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BookmarkList from '@/components/bookmark-list'
import AddBookmarkForm from '@/components/add-bookmark-form'
import { LogOutIcon, BookmarkIcon, UserIcon } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-slate-950 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BookmarkIcon className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white hidden sm:block">Smart Bookmark</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
              <UserIcon className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300 font-medium truncate max-w-[150px]">
                {user.email}
              </span>
            </div>

            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl border border-transparent hover:border-slate-700 transition-all"
                title="Sign Out"
              >
                <LogOutIcon className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back!</h2>
          <p className="text-slate-400">Manage your private collection of bookmarks.</p>
        </div>

        <AddBookmarkForm />

        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Your Bookmarks
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                {bookmarks?.length || 0}
              </span>
            </h3>
          </div>

          <BookmarkList initialBookmarks={bookmarks || []} userId={user.id} />
        </div>
      </div>
    </main>
  )
}
