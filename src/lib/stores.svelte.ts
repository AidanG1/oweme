import { writable, type Writable } from "svelte/store"

// export function createPhoto() {
// 	let count = $state(0)
// 	function increment() {
// 		count += 1
// 	}
// 	return {
// 		get count() {
// 			return count
// 		},
// 		increment
// 	}
// }

// export const chosenPhoto = writable<string>('')

interface Users {
    name?: string
    email: string
}

interface DisplayUser {
    name: string
    email: string
    id: string
}

export const selectedFriends: Writable<DisplayUser[]> = writable([]) // this is the friends for the current transaction
export const selectedEmails: Writable<Users[]> = writable([]) // this is the friends for the current transaction