import { Link } from 'react-router'

import { PROJECTS, type Room } from '../content'
import { cx } from '../lib/cx'
import { Photo } from './Photo'
import { SaveButton } from './SaveButton'

/** A room from the portfolio: photo, type, room and project, save toggle. */
export function RoomCard({ room, index, className, tall }: { room: Room; index?: number; className?: string; tall?: boolean }) {
  const project = PROJECTS.find((p) => p.slug === room.project)!
  return (
    <article className={cx('group relative', className)}>
      <Link to={`/portfolio/${project.slug}#${room.id}`} className="block focus-visible:outline-offset-4">
        <Photo
          name={room.image}
          alt={`${room.name}, ${project.name}`}
          className={cx(tall ? 'aspect-[4/5]' : 'aspect-[4/3]')}
          imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-[1.035]"
        />
        <div className="mt-3 flex items-baseline justify-between gap-4">
          <h3 className="text-[19px] font-medium tracking-[-0.03em]">
            {room.name}
            <span className="text-muted">, {project.name}</span>
          </h3>
          <span className="label-sm shrink-0 tabular-nums text-muted">{index !== undefined ? String(index + 1).padStart(2, '0') : room.type}</span>
        </div>
        <p className="label-sm mt-1 text-muted">
          {room.type} in {project.location}
        </p>
      </Link>
      <SaveButton id={room.id} name={room.name} className="absolute top-3 right-3" />
    </article>
  )
}
