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

export interface User {
    name?: string
    email: string
}

export const selectedEmails: Writable<User[]> = writable([]) // this is the friends for the current transaction