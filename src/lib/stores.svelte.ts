import { writable } from "svelte/store"

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

export const chosenPhoto = writable<string>('')