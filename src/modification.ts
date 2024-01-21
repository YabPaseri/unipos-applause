/**
 * Extending prototype
 */
(function main() {
	Object.defineProperty(KeyboardEvent.prototype, 'commandKey', {
		get() {
			const mac = window.navigator.userAgent.includes('Mac');
			return (mac && this.metaKey) || (!mac && this.ctrlKey);
		},
	});

	Object.defineProperty(MouseEvent.prototype, 'commandKey', {
		get() {
			const mac = window.navigator.userAgent.includes('Mac');
			return (mac && this.metaKey) || (!mac && this.ctrlKey);
		},
	});
})();
