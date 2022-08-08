/**
 * JSON-RPC でのリクエストにおける、成功時のレスポンス
 */
export type JSONRPCSuccess<T> = {
	id: string;
	status: 'success';
	result: T;
};

/**
 * JSON-RPC でのリクエストにおける、失敗時のレスポンス
 */
export type JSONRPCFailure = {
	id: string;
	status: 'failure';
	error: {
		code: number;
		message: string;
		data?: unknown;
	};
};

/**
 * JSON-RPC でのリクエストにおけるレスポンス
 */
export type JSONRPCResult<T> = JSONRPCSuccess<T> | JSONRPCFailure;
