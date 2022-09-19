import { Stack } from '@mui/material';
import { useState } from 'react';
import { TMember } from '../../unipos/type';
import { memofy } from '../components';
import { MemberSearch } from '../components/MemberSearch';

export const Control = memofy(() => {
	const [m1, setM1] = useState<TMember | null>(null);
	const [me1, setMe1] = useState(false);
	const [m2, setM2] = useState<TMember | null>(null);
	const [me2, setMe2] = useState(false);
	const [m3, setM3] = useState<TMember | null>(null);
	const [me3, setMe3] = useState(false);

	return (
		<Stack>
			<MemberSearch value={m1} setValue={setM1} me={me1} setMe={setMe1} label="おくった人" />
			<MemberSearch value={m2} setValue={setM2} me={me2} setMe={setMe2} label="もらった人" />
			<MemberSearch value={m3} setValue={setM3} me={me3} setMe={setMe3} label="拍手した人" />
		</Stack>
	);
}, 'Control');
