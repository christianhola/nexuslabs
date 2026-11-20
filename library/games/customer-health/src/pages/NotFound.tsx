import { EmptyState } from '../components/EmptyState'
import { Link } from '../components/Link'
import { pillClass } from '../components/Pill'

export function NotFound({ title = 'Page not found', body = 'That page does not exist. It may have moved.' }: { title?: string; body?: string }) {
  return (
    <div className="mt-10 animate-rise border-y-2 border-rule">
      <h2 className="sr-only" tabIndex={-1} data-page-title>
        {title}
      </h2>
      <EmptyState
        title={title}
        action={
          <Link to="/" className={pillClass('outline')}>
            <span className="-mr-[0.26em]">Back to overview</span>
          </Link>
        }
        className="py-20"
      >
        {body}
      </EmptyState>
    </div>
  )
}
