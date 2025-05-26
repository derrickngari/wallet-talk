import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { toast } from 'react-toastify'

const ProfilePage = ({ user }) => {
    const [profile, setProfile] = useState({
        full_name: '',
        currency: 'KES',
        avatar_url: ''
    })
    const [isLoading, setIsLoading] = useState(true)
    const [avatarFile, setAvatarFile] = useState(null)

    useEffect(()=> {
        if (user?.id) fetchProfile()
    }, [user])

    const fetchProfile = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('full_name, avatar_url, currency')
            .eq('id', user.id)
            .single()

        if (error) toast.error('Failed to load profile')
        else setProfile(data)

        setIsLoading(false)

    }
    const updateProfile = async (e) => {
        e.preventDefault()
        const { error } = await supabase
            .from('profiles')
            .update(profile)
            .eq('id', user.id)

        if (error) toast.error('Failed to update profile')
        else toast.success('Profile updated')
    }

    const uploadAvatar = async () => {
        if (!avatarFile) return

        const fileExt = avatarFile.name.split('.').pop()
        const filePath = `${user.id}/avatar.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, avatarFile, { upsert: true })

        if (uploadError) return toast.error('Failed to upload avatar')

        const publicUrl = supabase.storage.from('avatars').getPublicUrl(filePath).data.publicUrl

        const { error } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', user.id)

        if (error) toast.error('Failed to save profile image')
        else{
            setProfile((prev) => ({ ...prev, avatar_url: publicUrl }))
            toast.success('profile image updated')
        }
    }


    if (isLoading) return <p className='p-6'>Loading...</p>

  return (
    <div className='p-6 max-w-lg mx-auto bg-white rounded shadow'>
        <h1 className='text-xl font-bold mb-4'>Profile Settings</h1>

        <form onSubmit={updateProfile} className='space-y-4'>
            <input 
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} 
                placeholder='Full Name'
                className='w-full border outline-none rounded px-3 py-2'
            />
            <select
                value={profile.currency}
                onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                className='w-full px-3 py-2 border outline-none rounded '
            >
                <option value="KES">KES</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
            </select>

            <div className='flex flex-col md:flex-row  items-center gap-4'>
                {profile.avatar_url && (
                    <img 
                        src={profile.avatar_url} 
                        alt="avatar" 
                        className='w-16 h-16 rounded-full object-cover'
                    />
                )}
                <input 
                    type="file"
                    accept='image/*'
                    onChange={(e) => setAvatarFile(e.target.files[0])}
                    className='text-sm' 
                />
                <button
                    type='button'
                    onClick={uploadAvatar}
                    className='bg-[#F59E0B] text-white px-3 py-1 rounded'
                >
                    Upload
                </button>
            </div>

            <button
                type='submit'
                className='bg-green-400 text-white px-3 py-2 rounded'
            >
                Save Changes
            </button>
        </form>
    </div>
  )
}

export default ProfilePage