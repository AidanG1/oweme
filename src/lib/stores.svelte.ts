import { writable, type Writable } from "svelte/store"

export interface User {
    name?: string
    email: string
}

export const selectedEmails: Writable<User[]> = writable([]) // this is the friends for the current transaction