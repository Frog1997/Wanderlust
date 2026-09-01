import React from 'react';

export interface AnimalPreset {
  id: string;
  emoji: string;
  name: string;
  color: string;
}

export const GOOGLE_ANIMAL_PRESETS: AnimalPreset[] = [
  { id: 'fox', emoji: '🦊', name: '狐狸', color: '#F97316' }, // Orange
  { id: 'panda', emoji: '🐼', name: '熊貓', color: '#10B981' }, // Emerald
  { id: 'koala', emoji: '🐨', name: '無尾熊', color: '#64748B' }, // Slate
  { id: 'rabbit', emoji: '🐰', name: '兔子', color: '#EC4899' }, // Pink
  { id: 'cat', emoji: '🐱', name: '貓咪', color: '#F59E0B' }, // Amber
  { id: 'dog', emoji: '🐶', name: '柴犬', color: '#EAB308' }, // Yellow
  { id: 'bear', emoji: '🐻', name: '小熊', color: '#854D0E' }, // Brown
  { id: 'penguin', emoji: '🐧', name: '企鵝', color: '#0EA5E9' }, // Sky
  { id: 'owl', emoji: '🦉', name: '貓頭鷹', color: '#8B5CF6' }, // Purple
  { id: 'hedgehog', emoji: '🦔', name: '刺蝟', color: '#14B8A6' }, // Teal
  { id: 'hamster', emoji: '🐹', name: '倉鼠', color: '#FB923C' }, // Coral
  { id: 'dolphin', emoji: '🐬', name: '海豚', color: '#3B82F6' }, // Blue
  { id: 'duck', emoji: '🦆', name: '鴨子', color: '#84CC16' }, // Lime
  { id: 'lion', emoji: '🦁', name: '獅子', color: '#D97706' }, // Amber
  { id: 'unicorn', emoji: '🦄', name: '獨角獸', color: '#A855F7' }, // Violet
  { id: 'frog', emoji: '🐸', name: '青蛙', color: '#22C55E' }, // Green
];

export function getAnimalByEmojiOrId(key: string): AnimalPreset | undefined {
  return GOOGLE_ANIMAL_PRESETS.find(
    (a) => a.emoji === key || a.id === key || a.name === key
  );
}

export function getDefaultAnimalForName(name: string): AnimalPreset {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % GOOGLE_ANIMAL_PRESETS.length;
  return GOOGLE_ANIMAL_PRESETS[index];
}

export interface AnimalAvatarProps {
  avatar?: string;
  name?: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showBorder?: boolean;
}

export const AnimalAvatar: React.FC<AnimalAvatarProps> = ({
  avatar,
  name = '',
  color,
  size = 'md',
  className = '',
  showBorder = false,
}) => {
  const sizeMap = {
    xs: 'w-5 h-5 text-[11px]',
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-xl',
    '2xl': 'w-14 h-14 text-2xl',
  };

  // Determine fallback animal if avatar not explicitly given
  const matchedAnimal = avatar ? getAnimalByEmojiOrId(avatar) : undefined;
  const fallbackAnimal = getDefaultAnimalForName(name);
  const bgColor = color || matchedAnimal?.color || fallbackAnimal.color;

  const isUrl =
    avatar &&
    (avatar.startsWith('http://') ||
      avatar.startsWith('https://') ||
      avatar.startsWith('/'));

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 select-none overflow-hidden transition-transform shadow-xs ${
        sizeMap[size]
      } ${showBorder ? 'ring-2 ring-white dark:ring-neutral-900' : ''} ${className}`}
      style={{ backgroundColor: bgColor }}
      title={name ? `${name}${matchedAnimal ? ` (${matchedAnimal.name})` : ''}` : undefined}
    >
      {isUrl ? (
        <img
          src={avatar}
          alt={name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : avatar ? (
        <span className="leading-none flex items-center justify-center transform hover:scale-110 transition-transform">
          {avatar}
        </span>
      ) : (
        <span className="leading-none flex items-center justify-center">
          {fallbackAnimal.emoji}
        </span>
      )}
    </div>
  );
};
