import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { toast } from 'react-hot-toast'
import SplashScreen from '../components/SplashScreen';

const ProfilePage = ({ user }) => {
  const [profile, setProfile] = useState({
    full_name: '',
    currency: 'KES',
    avatar_url: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (user?.id) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, currency')
      .eq('id', user.id)
      .single();

    if (error) toast.error('Failed to load profile');
    else setProfile(data);

    setIsLoading(false);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id);

    if (error) toast.error('Failed to update profile');
    else toast.success('Profile updated');
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;

    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile, { upsert: true });

    if (uploadError) return toast.error('Failed to upload avatar');

    const publicUrl = supabase.storage.from('avatars').getPublicUrl(filePath).data.publicUrl;

    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (error) toast.error('Failed to save profile image');
    else {
      setProfile((prev) => ({ ...prev, avatar_url: publicUrl }));
      toast.success('Profile image updated');
    }
  };

  if (isLoading) return <SplashScreen />;

  return (
    <div className='p-6 max-w-lg mx-auto bg-black/30 border border-gray-500/40 text-gray-300 rounded shadow'>
      <h1 className='text-xl font-bold mb-4'>Profile Settings</h1>

      <div className='flex justify-center mb-4'>
        <img
          src={
            profile.avatar_url
              ? profile.avatar_url
              : 'https://via.placeholder.com/100x100.png?text=Avatar'
          }
          alt="Avatar"
          className='w-24 h-24 rounded-full object-cover border-2 border-purple-500'
        />
      </div>

      <form onSubmit={updateProfile} className='space-y-4'>

        <input
          type="text"
          value={profile.full_name}
          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
          placeholder='Full Name'
          className='w-full text-gray-400 border border-gray-500/30 text-sm bg-gray-900 px-2 py-1 rounded outline-none'
        />

        <select
          value={profile.currency}
          onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
          className='w-full text-gray-400 border border-gray-500/30 text-sm bg-gray-900 px-2 py-1 rounded outline-none'
        >
          <option value="KES">KES</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>

        <div className='flex flex-col md:flex-row items-center gap-4'>
          <input
            type="file"
            accept='image/*'
            onChange={(e) => setAvatarFile(e.target.files[0])}
            className='w-full text-gray-400 border border-gray-500/30 text-sm bg-gray-900 px-2 py-1 rounded outline-none'
          />
          <button
            type='button'
            onClick={uploadAvatar}
            className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded'
          >
            Upload
          </button>
        </div>

        <div className='flex justify-center'>
          <button
            type='submit'
            className='bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded'
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
