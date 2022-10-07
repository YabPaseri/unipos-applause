import SyncAltIcon from '@mui/icons-material/SyncAlt';
import { Button, CircularProgress, Divider, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import UniposAPI from '../unipos';
import { TCardsItem, TMe, TMember } from '../unipos/type';
import { MemberSearch, memofy } from './components';
import { useCloseDialog } from './data';

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

export const Dev2 = memofy(() => {
	const close = useCloseDialog();
	const [me, setMe] = useState<TMe>();
	const available = useMemo(() => me?.pocket.available_point || -1, [me]);

	// 総拍手数・総消費ポイント数
	const [clap, setClap] = useState('0');
	const [point, setPoint] = useState('0');
	const setPoints = useCallback((value: string) => {
		setPoint(value);
		const num = parseInt(value, 10);
		setClap(`${Number.isNaN(num) || num < 0 ? 0 : Math.floor(num / 2)}`);
	}, []);
	const handleAllClick = useCallback(() => setPoints(`${available < 0 ? 0 : available}`), [available, setPoints]);
	const handleClapChange = useCallback((e: ChangeEvent) => {
		const value = e.target.value;
		setClap(value);
		const num = parseInt(value, 10);
		setPoint(`${Number.isNaN(num) || num < 0 ? 0 : num * 2}`);
	}, []);
	const handlePointChange = useCallback((e: ChangeEvent) => setPoints(e.target.value), [setPoints]);
	const handleCPBlur = useCallback(() => {
		const c_num = parseInt(clap, 10);
		const p_num = parseInt(point, 10);
		// 両者同時に不正値にはならない。
		setClap(`${Number.isNaN(c_num) || c_num < 0 ? Math.floor(p_num / 2) : c_num}`);
		setPoint(`${Number.isNaN(p_num) || p_num < 0 ? c_num * 2 : p_num}`);
	}, [clap, point]);

	// 各投稿への拍手数・各投稿への消費ポイント数
	const [e_clap, setEClap] = useState('0');
	const [e_point, setEPoint] = useState('0');
	const handleEClapChange = useCallback((e: ChangeEvent) => {
		const value = e.target.value;
		setEClap(value);
		const num = parseInt(value, 10);
		setEPoint(`${Number.isNaN(num) || num < 0 ? 0 : num * 2}`);
	}, []);
	const handleEPointChange = useCallback((e: ChangeEvent) => {
		const value = e.target.value;
		setEPoint(value);
		const num = parseInt(value, 10);
		setEClap(`${Number.isNaN(num) || num < 0 ? 0 : Math.floor(num / 2)}`);
	}, []);
	const handleECPBlur = useCallback(() => {
		const ec_num = parseInt(e_clap, 10);
		const ep_num = parseInt(e_point, 10);
		// 両者同時に不正値にはならない。
		setEClap(`${Number.isNaN(ec_num) || ec_num < 0 ? Math.floor(ep_num / 2) : ec_num}`);
		setEPoint(`${Number.isNaN(ep_num) || ep_num < 0 ? ec_num * 2 : ep_num}`);
	}, [e_clap, e_point]);

	const [offset, setOffset] = useState('');
	const handleOffsetChange = useCallback((e: ChangeEvent) => {
		setOffset(e.target.value);
	}, []);

	const [breaker, setBreaker] = useState('');
	const handleBreakerChange = useCallback((e: ChangeEvent) => {
		setBreaker(e.target.value);
	}, []);

	const [limit, setLimit] = useState('0');
	const handleLimitChange = useCallback((e: ChangeEvent) => {
		setLimit(e.target.value);
	}, []);
	const handleLimitBlur = useCallback(() => {
		const l_num = parseInt(limit, 10);
		const adjusted = Number.isNaN(l_num) || l_num < 0 ? 0 : 60 < l_num ? 60 : l_num;
		setLimit('' + adjusted);
	}, [limit]);

	const [from, setFrom] = useState<TMember | null>(null);
	const [to, setTo] = useState<TMember | null>(null);

	const is_sendable = useMemo(() => {
		const c_num = parseInt(clap, 10);
		const p_num = parseInt(point, 10);
		const ec_num = parseInt(e_clap, 10);
		const ep_num = parseInt(e_point, 10);
		const c = (n: number) => Number.isNaN(n) || n < 1;
		// とりあえず、雑にチェック(onBlurで調整は入るけど)
		if (c(c_num) || c(p_num) || c(ec_num) || c(ep_num)) return false;
		if (available < p_num) return false; // 今週おくれる < 総消費P
		if (c_num < 1) return false; // 総C < 1
		if (ec_num < 0 || 60 < ec_num) return false; // 各投稿へのC < 0 || 仕様上限 < 各投稿へのC
		if (p_num < ep_num) return false; // 総消費P < 各投稿へのP
		return true;
	}, [available, clap, e_clap, e_point, point]);

	const handleSend = useCallback(async () => {
		close();
		if (!is_sendable || !me) return;

		const l = parseInt(limit);
		const ready = (card: TCardsItem) => {
			if (card.self_praise_count >= 60) return false;
			if (card.self_praise_count > l) return false;
			if (card.from_member.id === me.id) return false;
			for (const to_member of card.to_members) {
				if (to_member.id === me.id) return false;
			}
			return true;
		};

		const each = parseInt(e_clap, 10);
		let remain = parseInt(clap, 10);
		let _offset = offset;
		parent: for (;;) {
			const cards = (await UniposAPI.getCards(20, _offset, { from_member_id: from?.id, to_member_id: to?.id })).result;
			for (const card of cards) {
				if (ready(card)) {
					await new Promise((ok) => setTimeout(ok, 500));
					const sum = card.self_praise_count + each;
					const count = sum > 60 ? 60 - card.self_praise_count : each;
					UniposAPI.praise(card.id, count);
					console.log(`https://unipos.me/cards/${card.id} : ${count}`);
					remain -= count;
				}
				_offset = card.id;
				if (remain < each || card.id === breaker) break parent;
			}
		}
	}, [breaker, clap, close, e_clap, from, is_sendable, limit, me, offset, to]);

	// プロフィールを取得
	useEffect(() => {
		UniposAPI.getProfile().then((value) => {
			setMe(value.result.member);
		});
	}, []);

	if (!me) {
		return (
			<Stack justifyContent="center" alignItems="center">
				<CircularProgress />
			</Stack>
		);
	} else {
		return (
			<Stack spacing="12px">
				<Stack spacing="3px" direction="row" alignItems="center">
					<TextField
						fullWidth
						required
						value={point}
						onChange={handlePointChange}
						onBlur={handleCPBlur}
						label="総消費ポイント数"
						InputLabelProps={{ shrink: true }}
						InputProps={{
							startAdornment: '💰',
							endAdornment: (
								<InputAdornment position="end">
									<Button size="small" variant="outlined" onClick={handleAllClick}>
										ALL
									</Button>
								</InputAdornment>
							),
						}}
						type="number"
						inputProps={{ min: '0', step: '2' }}
						size="small"
						title="今回使用する総ポイント数です。[入力値]÷2が総拍手数となります。"
					/>
					<SyncAltIcon />
					<TextField
						fullWidth
						required
						value={clap}
						onChange={handleClapChange}
						onBlur={handleCPBlur}
						label="総拍手数"
						InputLabelProps={{ shrink: true }}
						InputProps={{ startAdornment: '👏' }}
						type="number"
						inputProps={{ min: '0', step: '1' }}
						size="small"
						title="今回使用する総拍手数です。[入力値]x2が総消費ポイント数となります。"
					/>
				</Stack>
				<Stack spacing="3px" direction="row" alignItems="center">
					<TextField
						fullWidth
						required
						value={e_point}
						onChange={handleEPointChange}
						onBlur={handleECPBlur}
						label="各投稿への消費ポイント数。"
						InputLabelProps={{ shrink: true }}
						InputProps={{ startAdornment: '💰' }}
						type="number"
						inputProps={{ min: '0', max: '120', step: '2' }}
						size="small"
						title="各投稿に送るポイント数です。[入力値]÷2が各投稿に送る拍手数となります。"
					/>
					<SyncAltIcon />
					<TextField
						fullWidth
						required
						value={e_clap}
						onChange={handleEClapChange}
						onBlur={handleECPBlur}
						label="各投稿への拍手数"
						InputLabelProps={{ shrink: true }}
						InputProps={{ startAdornment: '👏' }}
						type="number"
						inputProps={{ min: '0', max: '60', step: '1' }}
						size="small"
						title="各投稿に送る拍手数です。"
					/>
				</Stack>
				<TextField
					fullWidth
					value={offset}
					onChange={handleOffsetChange}
					label="オフセット(投稿ID)"
					InputLabelProps={{ shrink: true }}
					size="small"
					title="オフセットです。指定したIDの投稿より過去の投稿を対象にします。IDの投稿は含みません。"
				/>
				<TextField
					fullWidth
					value={breaker}
					onChange={handleBreakerChange}
					label="処理を中断する投稿(投稿ID)"
					InputLabelProps={{ shrink: true }}
					size="small"
					title="処理を中断する投稿です。指定したIDの投稿に拍手をした後、処理を中断します。"
				/>
				<Divider />
				<Typography variant="button">対象とする投稿の条件</Typography>
				<TextField
					fullWidth
					value={limit}
					onChange={handleLimitChange}
					onBlur={handleLimitBlur}
					label="自分の拍手の数"
					InputLabelProps={{ shrink: true }}
					InputProps={{ endAdornment: <InputAdornment position="end">以下</InputAdornment> }}
					type="number"
					inputProps={{ min: '0', max: '60', step: '1' }}
					size="small"
					title="自分が送っている拍手数が[入力値]以下の投稿にのみ、拍手をします。0を指定すれば拍手をしたことがない投稿に、60を指定すれば上限無しとなります。"
				/>
				<MemberSearch //
					value={from}
					setValue={setFrom}
					label="投稿の差出人"
					title={to ? '宛先と同時に指定することは出来ません。' : '投稿を「おくった人」を指定します。'}
					disabled={!!to}
				/>
				<MemberSearch
					value={to}
					setValue={setTo}
					label="投稿の宛先"
					title={
						from
							? '差出人と同時に指定することは出来ません。'
							: '投稿を「もらった人」を指定します。宛先が複数人の投稿に含まれている場合も対象です。'
					}
					disabled={!!from}
				/>
				<Divider />
				<Button
					fullWidth
					disabled={!is_sendable}
					onClick={handleSend}
					size="small"
					variant="contained"
					sx={{ textTransform: 'none' }}
				>
					実行(β)
				</Button>
			</Stack>
		);
	}
}, 'Dev2');
