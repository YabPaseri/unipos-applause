export {};

declare global {
	interface KeyboardEvent {
		/**
		 * macOS: `metaKey`  \
		 * others: `ctrlKey`
		 */
		get commandKey(): boolean;
	}

	interface MouseEvent {
		/**
		 * macOS: `metaKey`  \
		 * others: `ctrlKey`
		 */
		get commandKey(): boolean;
	}
}
