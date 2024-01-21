/**
 * JSON-RPC レスポンス
 */
export type JSONRPCResult<T> = JSONRPCSuccess<T> | JSONRPCFailed;

/**
 * JSON-RPC 成功時レスポンス
 */
export type JSONRPCSuccess<T> = {
	id: string;
	status: 'success';
	result: T;
};

/**
 * JSON-RPC エラー時レスポンス
 */
export type JSONRPCFailed = {
	id: string;
	status: 'failed';
	error: {
		code: number;
		message: string;
		data?: unknown;
	};
};
