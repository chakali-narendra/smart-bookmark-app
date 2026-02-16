'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addBookmark(formData: FormData) {
    const supabase = await createClient()
    const title = formData.get('title') as string
    const url = formData.get('url') as string

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase.from('bookmarks').insert([
        { title, url, user_id: user.id }
    ])

    if (error) throw error

    revalidatePath('/')
}

export async function deleteBookmark(id: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase.from('bookmarks').delete().match({ id, user_id: user.id })

    if (error) throw error

    revalidatePath('/')
}
