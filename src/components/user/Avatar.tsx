import clsx from 'clsx'
import Image from 'next/image'
import { HiUser } from 'react-icons/hi'

const Avatar: React.FC<{ picture: string | null; size: number; classNames?: string }> = ({
  picture,
  size,
  classNames,
}) => {
  return (
    <div
      className={clsx(
        classNames ?? '',
        `inline-flex items-center justify-center h-${size} w-${size} rounded-full bg-gray-400`
      )}
    >
      {picture ? (
        <Image className="rounded-full" src={picture} width={64} height={64} alt="Аватарка" />
      ) : (
        <HiUser className={`h-${size - 2} w-${size - 2} text-white`} />
      )}
    </div>
  )
}

export default Avatar