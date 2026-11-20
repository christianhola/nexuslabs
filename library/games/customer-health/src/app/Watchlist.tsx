import { DataTable } from '../components/DataTable'
import { Panel } from '../components/Panel'
import { copy, type Account, type Range } from '../data'
import { accountColumns } from './columns'

type WatchlistProps = {
  accounts: Account[]
  threshold: number
  range: Range
  onSelect: (account: Account) => void
}

export function Watchlist({ accounts, threshold, range, onSelect }: WatchlistProps) {
  return (
    <Panel id="watchlist" title={copy.watchlist} meta={`${accounts.length} ${accounts.length === 1 ? 'account' : 'accounts'}`} className="animate-rise [animation-delay:350ms]">
      <DataTable
        label={copy.watchlist}
        columns={accountColumns(threshold, range)}
        rows={accounts}
        rowKey={(a) => a.id}
        onRowClick={onSelect}
        defaultSort={{ key: 'drawdown', dir: 1 }}
        minWidth={1080}
        className="-mx-5 mt-7 px-5 sm:-mx-9 sm:mt-[38px] sm:px-9"
        empty={<p className="py-10 text-center text-[14px] text-muted">Nothing on the watchlist for this segment. Drag the threshold to widen it.</p>}
      />
    </Panel>
  )
}
