import { chatChannels, seedChat, seedPosts, seedTasks } from '../content'
import type { ChatMessage, FeedPost, Task } from '../content'
import { useStored } from './storage'

/*
  The demo app's state, shared by the hero drawing, the home showcase and
  the product page, and kept in this browser (branchwork:<key>).
*/
export const useTasks = () => useStored<Task[]>('tasks', seedTasks)
export const usePosts = () => useStored<FeedPost[]>('posts', seedPosts)
export const useReactions = () => useStored<string[]>('reacted', [])
export const useChat = () => useStored<Record<string, ChatMessage[]>>('chat', seedChat)
export const useChannel = () => useStored<string>('channel', chatChannels[0].id)
export const usePulseVote = () => useStored<string | null>('pulse-vote', null)
export const useSwaps = () => useStored<string[]>('swaps', [])

export const completion = (tasks: Task[]) => (tasks.length ? tasks.filter((t) => t.done).length / tasks.length : 0)
