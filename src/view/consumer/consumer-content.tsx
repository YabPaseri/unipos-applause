import PaidIcon from '@mui/icons-material/Paid';
import SavingsIcon from '@mui/icons-material/Savings';
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { ClipboardEventHandler, memo, useCallback, useMemo, useRef } from 'react';
import { Logger } from '../../logger';
import UniposAPI from '../../unipos';
import { CardsItem, Member } from '../../unipos/type';
import { GetCardsOptions } from '../../unipos/unipos-api';
import { IntInput, MemberSearch, MemoizedInput, SyncIntInput } from '../components';
import { useConsumerDispatch, useConsumerState } from './consumer-context';

const MAX_PRAISE_COUNT = UniposAPI.MAX_PRAISE_COUNT;
const MAX_ALREADY_COUNT = MAX_PRAISE_COUNT - 1;

type TProps = {
	close: () => void;
};

/**
 * Consumerの本体。\
 * `<ConsumerContextProvider/>` の子孫でなければならない。
 */
export const ConsumerContent = memo<TProps>(({ close }) => {
	const { me, t_point, t_clap, e_point, e_clap, offset, breaks, already, from, to } = useConsumerState();
	const dispatch = useConsumerDispatch();

	const handleTPointChange = useCallback((point: number | undefined) => dispatch({ type: 'SET_TOTAL_POINT', point }), [dispatch]);
	const handleTClapChange = useCallback((clap: number | undefined) => dispatch({ type: 'SET_TOTAL_CLAP', clap }), [dispatch]);
	const handleTotalsBlur = useCallback(() => dispatch({ type: 'ADJUST_TOTALS' }), [dispatch]);
	const allIn = useCallback(() => dispatch({ type: 'SET_TOTAL_POINT', point: me?.pocket.available_point }), [dispatch, me]);

	const handleEPointChange = useCallback((point: number | undefined) => dispatch({ type: 'SET_EACH_POINT', point }), [dispatch]);
	const handleEClapChange = useCallback((clap: number | undefined) => dispatch({ type: 'SET_EACH_CLAP', clap }), [dispatch]);
	const handleEachsBlur = useCallback(() => dispatch({ type: 'ADJUST_EACHS' }), [dispatch]);

	const lastOffsetPasted = useRef('');
	const lastOffsetPastedTime = useRef(0);
	const handleOffsetChange = useCallback(
		(offset: string) => {
			// Pasteの検知からonChangeまで500ms未満 && 貼り付けた内容が変化後のテキストと同じ
			if (Date.now() - lastOffsetPastedTime.current < 500 && offset === lastOffsetPasted.current) {
				offset = UniposAPI.extractCardIdFromCardLink(offset) || offset;
			}
			dispatch({ type: 'SET_OFFSET', offset });
		},
		[dispatch]
	);
	const handleOffsetPaste = useCallback<ClipboardEventHandler<HTMLElement>>((e) => {
		lastOffsetPasted.current = e.clipboardData.getData('text');
		lastOffsetPastedTime.current = Date.now();
	}, []);

	const lastBreaksPasted = useRef('');
	const lastBreaksPastedTime = useRef(0);
	const handleBreaksChange = useCallback(
		(breaks: string) => {
			// Pasteの検知からonChangeまで500ms未満 && 貼り付けた内容が変化後のテキストと同じ
			if (Date.now() - lastBreaksPastedTime.current < 500 && breaks === lastBreaksPasted.current) {
				breaks = UniposAPI.extractCardIdFromCardLink(breaks) || breaks;
			}
			dispatch({ type: 'SET_BREAKS', breaks });
		},
		[dispatch]
	);
	const handleBreaksPaste = useCallback<ClipboardEventHandler<HTMLElement>>((e) => {
		lastBreaksPasted.current = e.clipboardData.getData('text');
		lastBreaksPastedTime.current = Date.now();
	}, []);

	const handleAlreadyChange = useCallback((already: number | undefined) => dispatch({ type: 'SET_ALREADY', already }), [dispatch]);
	const handleAlreadyBlur = useCallback(() => dispatch({ type: 'ADJUST_ALREADY' }), [dispatch]);

	const handleFromChange = useCallback((from: Member | undefined) => dispatch({ type: 'SET_FROM', from }), [dispatch]);
	const handleToChange = useCallback((to: Member | undefined) => dispatch({ type: 'SET_TO', to }), [dispatch]);

	const notReadyMessage = useMemo<string | undefined>(() => {
		if (me === void 0 || t_point === void 0 || t_clap === void 0 || e_clap === void 0) {
			return '必須パラメータが見つかりませんでした。';
		}
		if (me.pocket.available_point < t_point) {
			return '「総使用ポイント数」が所持ポイント数を超えています。';
		}
		if (t_clap < 1) {
			return '「総拍手数」が1未満です。';
		}
		if (e_clap < 1 || MAX_PRAISE_COUNT < e_clap) {
			return `「各投稿に送る拍手数」が 1～${MAX_PRAISE_COUNT} の範囲外です。`;
		}
		if (t_clap < e_clap) {
			return '「各投稿に送る拍手数」が「総拍手数」を超えています。';
		}
		return;
	}, [e_clap, me, t_clap, t_point]);

	const run = useCallback(async () => {
		if (me === void 0 || t_point === void 0 || t_clap === void 0 || e_clap === void 0) return;
		close();

		const id = Date.now(); // 識別さえ出来ればOK
		Logger.info(`Start of praise: id="${id}"`);

		const possible = (card: CardsItem): boolean => {
			if (card.from_member.id === me.id) return false;
			for (const to_member of card.to_members) {
				if (to_member.id === me.id) return false;
			}
			if ((already !== void 0 ? already : MAX_ALREADY_COUNT) < card.self_praise_count) return false;
			return true;
		};

		let remain = t_clap;
		let _offset = offset;
		loop: for (;;) {
			const options: GetCardsOptions = { from_member_id: from?.id, to_member_id: to?.id };
			const cards = (await UniposAPI.getCards(20, _offset, options)).result;
			for (const card of cards) {
				_offset = card.id;
				if (!possible(card)) continue;
				// 以下、送れる場合
				await new Promise((ok) => setTimeout(ok, 500));
				const max = MAX_PRAISE_COUNT - card.self_praise_count;
				const pay = Math.min(e_clap, max); // 59拍手済みのところに、2拍手送ろうとしたときなどのケア。
				UniposAPI.praise(card.id, pay); // awaitしない。待つ理由はない。
				Logger.info(`https://unipos.me/cards/${card.id} : ${pay}`);
				remain -= pay;
				// 各投稿への拍手数を下回った場合は、消費はしない。
				if (remain < e_clap || card.id == breaks) break loop;
			}
		}
	}, [already, breaks, close, e_clap, from, me, offset, t_clap, t_point, to]);

	return !me ? (
		<Stack justifyContent="center" alignItems="center">
			<CircularProgress />
		</Stack>
	) : (
		<Stack spacing="12px">
			<SyncIntInput
				v1={t_point}
				onChangeV1={handleTPointChange}
				onBlurV1={handleTotalsBlur}
				labelV1="総使用ポイント数"
				titleV1="今回使用する総ポイント数です。[入力値]÷2が総拍手数となります。"
				inputPropsV1={{ min: '0', step: '2', max: `${me.pocket.available_point}` }}
				InputPropsV1={{
					startAdornment: (
						<InputAdornment position="start">
							<PaidIcon fontSize="small" />
						</InputAdornment>
					),
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								title="所持ポイントを全て使用する"
								disabled={me.pocket.available_point === t_point}
								onClick={allIn}
								size="small"
								edge="end"
							>
								<SavingsIcon />
							</IconButton>
						</InputAdornment>
					),
				}}
				v2={t_clap}
				onChangeV2={handleTClapChange}
				onBlurV2={handleTotalsBlur}
				labelV2="総拍手数"
				titleV2="今回送る総拍手数です。[入力値]x2が総使用ポイント数となります。"
				inputPropsV2={{ min: '0', step: '1', max: `${Math.floor(me.pocket.available_point / 2)}` }}
				InputPropsV2={{
					startAdornment: (
						<InputAdornment position="start">
							<SignLanguageIcon fontSize="small" />
						</InputAdornment>
					),
				}}
			/>
			<SyncIntInput
				v1={e_point}
				onChangeV1={handleEPointChange}
				onBlurV1={handleEachsBlur}
				labelV1="各投稿に送るポイント数"
				titleV1="各投稿に送るポイント数です。[入力値]÷2が各投稿に送る拍手数となります。"
				inputPropsV1={{ min: '0', step: '2', max: '120' }}
				InputPropsV1={{
					startAdornment: (
						<InputAdornment position="start">
							<PaidIcon fontSize="small" />
						</InputAdornment>
					),
				}}
				//v2
				v2={e_clap}
				onChangeV2={handleEClapChange}
				onBlurV2={handleEachsBlur}
				labelV2="各投稿に送る拍手数"
				titleV2="各投稿に送る拍手数です。[入力値]x2が各投稿に送るポイント数となります。"
				inputPropsV2={{ min: '0', step: '1', max: `${MAX_PRAISE_COUNT}` }}
				InputPropsV2={{
					startAdornment: (
						<InputAdornment position="start">
							<SignLanguageIcon fontSize="small" />
						</InputAdornment>
					),
				}}
			/>
			<Divider textAlign="center">
				<Chip label="対象とする投稿の条件（オプション）" />
			</Divider>
			<MemoizedInput
				fullWidth
				size="small"
				value={offset}
				onChange={handleOffsetChange}
				onPaste={handleOffsetPaste}
				label="オフセット(投稿ID)"
				title="指定した投稿より、過去の投稿のみを対象にします。指定された投稿は拍手の対象となりません。&#13;&#10;各投稿の「リンクをコピーする」で取得したURLを貼り付けると、自動でIDに変換されます。"
				InputLabelProps={{ shrink: true }}
			/>
			<MemoizedInput
				fullWidth
				size="small"
				value={breaks}
				onChange={handleBreaksChange}
				onPaste={handleBreaksPaste}
				label="拍手を終える投稿(投稿ID)"
				title="指定した投稿に拍手をして、一括拍手の処理を終了します。&#13;&#10;各投稿の「リンクをコピーする」で取得したURLを貼り付けると、自動でIDに変換されます。"
				InputLabelProps={{ shrink: true }}
			/>
			<IntInput
				fullWidth
				size="small"
				value={already}
				onChange={handleAlreadyChange}
				onBlur={handleAlreadyBlur}
				label="自分の拍手数の上限"
				title={`自分の拍手数が入力値以下の投稿のみ拍手をします。0なら拍手をしたことがない投稿のみ、${MAX_ALREADY_COUNT}を指定すれば全ての投稿が対象となります。`}
				inputProps={{ min: '0', step: '1', max: `${MAX_ALREADY_COUNT}` }}
				InputLabelProps={{ shrink: true }}
			/>
			<MemberSearch
				value={from}
				onChange={handleFromChange}
				label="投稿をおくった人"
				title={!to ? '投稿の差出人を指定します。' : '「投稿をもらった人」と同時に指定することは出来ません。'}
				disabled={!!to}
			/>
			<MemberSearch
				value={to}
				onChange={handleToChange}
				label="投稿をもらった人"
				title={!from ? '投稿の宛先を指定します。' : '「投稿をおくった人」と同時に指定することは出来ません。'}
				disabled={!!from}
			/>
			<Stack direction="row" justifyContent="center">
				{/* Buttonをdisabledにするとtitleが出ないので、Boxでラップ */}
				<Box title={notReadyMessage}>
					<Button onClick={run} variant="contained" disabled={!!notReadyMessage}>
						送る
					</Button>
				</Box>
			</Stack>
		</Stack>
	);
});
ConsumerContent.displayName = 'ConsumerContent';
