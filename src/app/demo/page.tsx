'use client';
import React from 'react';
import { ProfileCard } from './components/profile-card';
import { mainProfile, otherProfiles, surroundCardClass } from './components/profiles';
import { useRouter } from 'next/navigation';

export default function Demo() {
  const router = useRouter();
  const handleCardClick = () => {
    router.push('/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="relative w-full h-[900px] max-w-[1100px] mx-auto overflow-hidden">
        {/* 中央カード（手羽太郎） */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer" onClick={handleCardClick}>
          <ProfileCard
            {...mainProfile}
            isMain
            containerClassName="w-[340px] max-w-[80vw] h-auto p-8 shadow-xl ring-2 ring-indigo-200 rounded-2xl bg-white/80 backdrop-blur-md transition-all duration-300"
          />
        </div>
        {/* 佐藤花子（上） */}
        <div className="absolute top-[2%] left-1/2 -translate-x-1/2 -rotate-6 z-10 cursor-pointer" onClick={handleCardClick}>
          <ProfileCard {...otherProfiles[0]} containerClassName={surroundCardClass} />
        </div>
        {/* 鈴木一郎（左下） */}
        <div className="absolute bottom-[10%] left-[8%] rotate-6 z-10 cursor-pointer" onClick={handleCardClick}>
          <ProfileCard {...otherProfiles[1]} containerClassName={surroundCardClass} />
        </div>
        {/* 加藤健太（左上） */}
        <div className="absolute top-[12%] left-[10%] rotate-4 z-10 cursor-pointer" onClick={handleCardClick}>
          <ProfileCard {...otherProfiles[4]} containerClassName={surroundCardClass} />
        </div>
        {/* 渡辺優子（右上） */}
        <div className="absolute top-[10%] right-[10%] -rotate-9 z-10 cursor-pointer" onClick={handleCardClick}>
          <ProfileCard {...otherProfiles[5]} containerClassName={surroundCardClass} />
        </div>
        {/* 田中誠（右下の少し上） */}
        <div className="absolute bottom-[16%] right-[12%] -rotate-2 z-10 cursor-pointer" onClick={handleCardClick}>
          <ProfileCard {...otherProfiles[2]} containerClassName={surroundCardClass} />
        </div>
        {/* 中村美咲（右下） */}
        <div className="absolute bottom-[0%] right-[44%] rotate-8 z-10 cursor-pointer" onClick={handleCardClick}>
          <ProfileCard {...otherProfiles[3]} containerClassName={surroundCardClass} />
        </div>
      </div>

      {/* モバイル用：縦並び */}
      <div className="md:hidden flex flex-col items-center w-full px-4 py-8">
        <div className="w-full max-w-sm mb-6 cursor-pointer" onClick={handleCardClick}>
          <ProfileCard {...mainProfile} isMain containerClassName="w-full h-auto p-4" />
        </div>
        {otherProfiles.map((profile, index) => (
          <div key={index} className="w-full max-w-sm mb-4 cursor-pointer" onClick={handleCardClick}>
            <ProfileCard {...profile} containerClassName="w-full h-auto p-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
