type BaseToast = {
	message: string
	duration?: number
	type?: 'info' | 'success' | 'error'
	id?: number
}

type Toast = {
	message: string
	type: 'info' | 'success' | 'error'
	duration: number
	id: number
}

function manageToasts() {
	let id = $state(0)
	let toasts: Toast[] = $state([])

	function addToast(toast: BaseToast) {
		toast.id = id++
		toast.type = toast.type || 'info'
        toast.duration = toast.duration || 5000
		const toasted = toast as Toast
		toasts.push(toasted)

		setTimeout(() => {
			removeToast(toasted.id)
		}, toast.duration)
	}

	function removeToast(id: number) {
		toasts = toasts.filter((toast) => toast.id !== id)
	}

	return {
		get toasts() {
			return toasts
		},
		addToast,
		removeToast
	}
}

export const toasts = manageToasts()
