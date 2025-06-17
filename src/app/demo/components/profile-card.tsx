import React from 'react';

interface ProfileCardProps {
  name: string;
  bio: string;
  skills: {
    hackathonCount: number;
    strongRoles: string[];
    challengeRoles: string[];
  };
  projects: {
    blog?: string;
    github?: string;
  };
  isMain?: boolean;
  containerClassName?: string;
}

export function ProfileCard({
  name,
  bio,
  skills,
  projects,
  isMain = false,
  containerClassName = '',
}: ProfileCardProps) {
  // 名前の頭文字を取得
  const initial = name.charAt(0);

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 flex flex-col min-h-[220px] justify-between ${containerClassName}`}>
      <div className="flex flex-col items-center space-y-2 mb-2 flex-shrink-0">
        <div
          className={`flex items-center justify-center rounded-full bg-blue-500 text-white font-bold ${
            isMain ? 'w-16 h-16 text-2xl' : 'w-10 h-10 text-lg'
          }`}
        >
          {initial}
        </div>
        <h2 className={`font-bold ${isMain ? 'text-xl' : 'text-sm'}`}>
          {name}
        </h2>
        <p className={`text-gray-600 text-center ${isMain ? 'text-sm' : 'text-xs line-clamp-3'}`}>
          {bio}
        </p>
      </div>

      {isMain && (
        <div className="mt-4 space-y-3 flex-grow">
          <div>
            <h3 className="font-semibold text-sm mb-1">主要スキル</h3>
            <ul className="space-y-1 text-sm">
              <li>ハッカソン出場回数: {skills.hackathonCount}回</li>
              <li>得意な役割: {skills.strongRoles.join(', ')}</li>
              <li>挑戦したい役割: {skills.challengeRoles.join(', ')}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-1">プロジェクト</h3>
            <div className="space-y-1 text-sm">
              {projects.blog && (
                <a
                  href={projects.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block"
                >
                  技術ブログ
                </a>
              )}
              {projects.github && (
                <a
                  href={projects.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {!isMain && (
        <div className="text-gray-500 text-xs text-center mt-2 flex-shrink-0">
          {skills.strongRoles[0] || ''}
        </div>
      )}
    </div>
  );
} 