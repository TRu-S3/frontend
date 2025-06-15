import React from 'react';
import { ProfileCard } from '@/components/ui/profile-card';

// カードのサイズ定数
const CARD_SIZES = {
  MAIN: 'w-[80px]',
  OTHER: 'w-[80px]',
} as const;

// カードの配置定数
type Position = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  rotate: string;
};

const CARD_POSITIONS: Position[] = [
  { top: 'top-[10%]', right: 'right-[10%]', rotate: '-rotate-6' },
  { top: 'top-[10%]', left: 'left-[10%]', rotate: 'rotate-7' },
  { bottom: 'bottom-[10%]', right: 'right-[10%]', rotate: 'rotate-4' },
  { bottom: 'bottom-[10%]', left: 'left-[10%]', rotate: '-rotate-9' },
  { top: 'top-[5%]', left: 'left-[35%]', rotate: 'rotate-3' },
  { bottom: 'bottom-[5%]', right: 'right-[35%]', rotate: '-rotate-5' },
];

const mainProfile = {
  name: '手羽太郎',
  bio: 'こんにちは！私は手羽太郎です！ハッカソンに一緒に出てくれる仲間を探しています！ぜひ、ZennのAIエージェントハッカソンに一緒に出ましょう！優勝目指すぞ！',
  skills: {
    hackathonCount: 5,
    strongRoles: ['フロントエンド開発', 'UI/UXデザイン'],
    challengeRoles: ['バックエンド開発', 'インフラ構築'],
  },
  projects: {
    blog: 'https://example.com/blog',
    github: 'https://github.com/example',
  },
};

const otherProfiles = [
  {
    name: '佐藤花子',
    bio: 'フロントエンドエンジニアとして3年の経験があります。新しい技術に挑戦するのが大好きです！',
    skills: {
      hackathonCount: 3,
      strongRoles: ['フロントエンド開発'],
      challengeRoles: ['バックエンド開発'],
    },
    projects: {
      github: 'https://github.com/example2',
    },
  },
  {
    name: '鈴木一郎',
    bio: 'バックエンドエンジニアとして5年の経験があります。スケーラブルなシステム設計が得意です。',
    skills: {
      hackathonCount: 7,
      strongRoles: ['バックエンド開発', 'インフラ構築'],
      challengeRoles: ['フロントエンド開発'],
    },
    projects: {
      blog: 'https://example.com/blog2',
      github: 'https://github.com/example3',
    },
  },
  {
    name: '田中誠',
    bio: 'UI/UXデザイナーとして4年の経験があります。ユーザー体験を重視したデザインを心がけています。',
    skills: {
      hackathonCount: 4,
      strongRoles: ['UI/UXデザイン'],
      challengeRoles: ['フロントエンド開発'],
    },
    projects: {
      blog: 'https://example.com/blog3',
    },
  },
  {
    name: '中村美咲',
    bio: 'フルスタックエンジニアとして2年の経験があります。新しい技術に挑戦するのが大好きです。',
    skills: {
      hackathonCount: 2,
      strongRoles: ['フロントエンド開発', 'バックエンド開発'],
      challengeRoles: ['インフラ構築'],
    },
    projects: {
      github: 'https://github.com/example4',
    },
  },
  {
    name: '加藤健太',
    bio: 'インフラエンジニアとして6年の経験があります。クラウド環境の構築と運用が得意です。',
    skills: {
      hackathonCount: 8,
      strongRoles: ['インフラ構築'],
      challengeRoles: ['バックエンド開発'],
    },
    projects: {
      blog: 'https://example.com/blog4',
      github: 'https://github.com/example5',
    },
  },
  {
    name: '渡辺優子',
    bio: 'フロントエンドエンジニアとして4年の経験があります。アクセシビリティにこだわった開発を心がけています。',
    skills: {
      hackathonCount: 4,
      strongRoles: ['フロントエンド開発'],
      challengeRoles: ['UI/UXデザイン'],
    },
    projects: {
      github: 'https://github.com/example6',
    },
  },
];

const surroundCardClass = "w-[15vw] min-w-[160px] max-w-[220px] h-auto aspect-square p-3";

export default function Demo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="relative w-full h-[700px] max-w-[1100px] mx-auto overflow-hidden">
        {/* 中央カード（手羽太郎） */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <ProfileCard
            {...mainProfile}
            isMain
            containerClassName="w-[340px] max-w-[80vw] h-auto p-6"
          />
        </div>
        {/* 佐藤花子（上） */}
        <div className="absolute top-[2%] left-1/2 -translate-x-1/2 -rotate-6 z-10">
          <ProfileCard {...otherProfiles[0]} containerClassName={surroundCardClass} />
        </div>
        {/* 鈴木一郎（左下） */}
        <div className="absolute bottom-[10%] left-[8%] rotate-6 z-10">
          <ProfileCard {...otherProfiles[1]} containerClassName={surroundCardClass} />
        </div>
        {/* 加藤健太（左上） */}
        <div className="absolute top-[12%] left-[10%] rotate-4 z-10">
          <ProfileCard {...otherProfiles[4]} containerClassName={surroundCardClass} />
        </div>
        {/* 渡辺優子（右上） */}
        <div className="absolute top-[10%] right-[10%] -rotate-9 z-10">
          <ProfileCard {...otherProfiles[5]} containerClassName={surroundCardClass} />
        </div>
        {/* 田中誠（右下の少し上） */}
        <div className="absolute bottom-[16%] right-[12%] -rotate-2 z-10">
          <ProfileCard {...otherProfiles[2]} containerClassName={surroundCardClass} />
        </div>
        {/* 中村美咲（右下） */}
        <div className="absolute bottom-[4%] right-[4%] rotate-8 z-10">
          <ProfileCard {...otherProfiles[3]} containerClassName={surroundCardClass} />
        </div>
      </div>

      {/* モバイル用：縦並び */}
      <div className="md:hidden flex flex-col items-center w-full px-4 py-8">
        <div className="w-full max-w-sm mb-6">
          <ProfileCard {...mainProfile} isMain containerClassName="w-full h-auto p-4" />
        </div>
        {otherProfiles.map((profile, index) => (
          <div key={index} className="w-full max-w-sm mb-4">
            <ProfileCard {...profile} containerClassName="w-full h-auto p-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
