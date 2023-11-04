"use client";

import { useContext, useState } from 'react';

import { toast } from 'react-toastify';
import { ContractsContext } from './useContractContextHook';

export function useVestingHook() {

	const { contracts } = useContext(ContractsContext);

	// **********************************************************************************************************
	// ********************************************** loadVestingPrograms ***************************************
	// **********************************************************************************************************
	const [VESTING_IDS, setVestingIds] = useState([]);
	async function loadVestingPrograms() {
		// vesting
		let vestingIds = await contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.getVestingIds();
		console.log(`vestingIds: ` + vestingIds);
		setVestingIds(vestingIds);

		let tokenAddressInVestingContract = await contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.getTokenAddress();
		console.log(`tokenAddressInVestingContract: ` + tokenAddressInVestingContract);
		setVestingScheduleTokenAddress(tokenAddressInVestingContract);
	}

	// **********************************************************************************************************
	// ************************************************ onSelectVestingId ***************************************
	// **********************************************************************************************************
	const [VESTING_ID, setVestingId] = useState<string>('');
	const [VESTING_START_MILLIS, setVestingStartMillis] = useState("");
	const [VESTING_CLIFF_DAYS, setVestingCliffInDays] = useState<number>(0);
	const [VESTING_DURATION_DAYS, setVestingDurationInDays] = useState<number>(0);
	const [VESTING_NUM_SLIDES, setVestingNumSlides] = useState<number>(0);

	const onSelectVestingId = async (vestingId: any)=>{
		console.log('onSelectVestingId', vestingId);

		let vesting = await contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.getVesting(vestingId);
		console.log('vesting', vesting);
		console.log('vesting[0])', vesting[0]);
		let vestingStartInMillis = parseInt(vesting[0]) * 1000;
		console.log('vestingStartInMillis: ', vestingStartInMillis);
		var dateFormat = new Date(vestingStartInMillis);
		console.log('dateFormat: ', dateFormat);
		console.log(dateFormat.toISOString().slice(0, 16));

		setVestingId(vestingId);
		setVestingStartMillis(dateFormat.toISOString().slice(0, 16));
		setVestingCliffInDays(vesting[1] ? vesting[1] / (60 * 60 * 24) : 0);
		setVestingDurationInDays(vesting[2] ? vesting[2] / (60 * 60 * 24) : 0);
		setVestingNumSlides(vesting[3]);
	}

	// **********************************************************************************************************
	// ****************************************** onSelectVestingSchedule ***************************************
	// **********************************************************************************************************
	const [VESTING_SCHEDULE_ID, setVestingScheduleId] = useState<string>('');
	const [VESTING_SCHEDULE_PROGRAM_ID, setVestingScheduleProgramId] = useState<string>('');
	const [VESTING_SCHEDULE_HOLDER, setVestingScheduleHolder] = useState<string>('');
	const [VESTING_SCHEDULE_AMOUNT, setVestingScheduleAmount] = useState<number>(0);
	const [VESTING_SCHEDULE_RELEASED_AMOUNT, setVestingScheduleReleasedAmount] = useState<number>(0);

	const onSelectVestingSchedule = async (vestingScheduleId: any)=>{
		console.log('onSelectVestingSchedule', vestingScheduleId);

		let vestingSchedule = await contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.getVestingSchedule(vestingScheduleId);
		console.log('vestingSchedule', vestingSchedule);

		setVestingScheduleId(vestingScheduleId);
		setVestingScheduleHolder(vestingSchedule[0]);
		setVestingScheduleAmount(vestingSchedule[1]);
		setVestingScheduleProgramId(vestingSchedule[2]);
		setVestingScheduleReleasedAmount(vestingSchedule[3]);
	}

	// **********************************************************************************************************
	// ********************************************** loadVestingScheduleList ***********************************
	// **********************************************************************************************************
	const [VESTING_SCHEDULE_LIST, setVestingScheduleList] = useState<[]>()

	async function loadVestingScheduleList() {
		let vestingScheduleList = await contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.getVestingSchedulesIds();
		console.log(`VESTING_SCHEDULE_LIST: ` + vestingScheduleList);
		setVestingScheduleList(vestingScheduleList);
	}

	// **********************************************************************************************************
	// ********************************************** computeVesting ********************************************
	// **********************************************************************************************************
	async function computeVesting() {
		console.log('computeVesting', VESTING_SCHEDULE_ID);
		let releseableAmount = await contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.computeReleasableAmount(VESTING_SCHEDULE_ID);
		console.log('releseableAmount', releseableAmount);
		setVestingScheduleReleasedAmount(releseableAmount);
	}

	// **********************************************************************************************************
	// ********************************************** releaseVesting ********************************************
	// **********************************************************************************************************
	async function releaseVesting() {
		console.log('releaseVesting', VESTING_SCHEDULE_ID);
		await contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.release(VESTING_SCHEDULE_ID);
	}

	// **********************************************************************************************************
	// **************************************** setVestinGrantorOnSC ********************************************
	// **********************************************************************************************************
	const [VESTING_GRANTOR, setVestinGrantor] = useState<string>('');

	async function setVestinGrantorOnSC() {
		console.log(`setting VESTING_GRANTOR: ` + VESTING_GRANTOR);
		await contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.addGrantor(VESTING_GRANTOR).then(await handleICOReceipt).catch(handleError);
	}

	// **********************************************************************************************************
	// ************************************* setTokenAddressOnVestingSC *****************************************
	// **********************************************************************************************************
	const [VESTING_SCHEDULE_TOKEN_ADDRESS, setVestingScheduleTokenAddress] = useState<string>()

	async function setTokenAddressOnVestingSC() {
		console.log(`setting VESTING_SCHEDULE_TOKEN_ADDRESS: ` + VESTING_SCHEDULE_TOKEN_ADDRESS);
		await contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.setTokenAddress(VESTING_SCHEDULE_TOKEN_ADDRESS).then(await handleICOReceipt).catch(handleError);
	}

	// ***********************************************************************************************
	// ************************************** TX Processing ******************************************
	// ***********************************************************************************************
	async function handleICOReceipt(tx:any) {
		console.log('handle tx');
		console.log(tx);

		// process transaction
		console.log(`Transaction hash: ${tx.hash}`);
		const receipt = await tx.wait();
		console.log(receipt);
	  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
		console.log(`Gas used: ${receipt.gasUsed.toString()}`);

		//parseError(err.message,);
		let msg = 'GasUsed: ' + receipt.gasUsed;
		toast.info(msg, {
			position: "bottom-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
		});

	}
	function handleError(err:any) {
		console.log('Ohhhh nooo');
		console.log(err);
		console.log(err.code);
		console.log('err.message: ' + err.message);

		//parseError(err.message,);
		toast.error(parseError(err.message), {
			position: "bottom-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
		});
	}

	function parseError(err:any) {
		if(err.indexOf('ERRW_OWNR_NOT') > -1) return 'Caller is not the owner';
		else if(err.indexOf('ERRP_INDX_PAY') > -1) return 'Wrong index';
		else if(err.indexOf('ERRD_MUST_ONG') > -1) return 'ICO must be ongoing';
		else if(err.indexOf('ERRD_MUSN_BLK') > -1) return 'Must not be blacklisted';
		else if(err.indexOf('ERRD_TRAS_LOW') > -1) return 'Transfer amount too low';
		else if(err.indexOf('ERRD_TRAS_HIG') > -1) return 'Transfer amount too high';
		else if(err.indexOf('ERRD_MUST_WHI') > -1) return 'Must be whitelisted';
		else if(err.indexOf('ERRD_INVT_HIG') > -1) return 'Total invested amount too high';
		else if(err.indexOf('ERRD_HARD_CAP') > -1) return 'Amount higher than available';
		else if(err.indexOf('ERRD_ALLO_LOW') > -1) return 'Insuffient allowance';
		else if(err.indexOf('ERRR_MUST_FIN') > -1) return 'ICO must be finished';
		else if(err.indexOf('ERRR_PASS_SOF') > -1) return 'Passed SoftCap. No refund';
		else if(err.indexOf('ERRR_ZERO_REF') > -1) return 'Nothing to refund';
		else if(err.indexOf('ERRR_WITH_REF') > -1) return 'Unable to refund';
		else if(err.indexOf('ERRC_MUST_FIN') > -1) return 'ICO must be finished';
		else if(err.indexOf('ERRC_NPAS_SOF') > -1) return 'Not passed SoftCap';
		else if(err.indexOf('ERRC_MISS_TOK') > -1) return 'Provide Token';
		else if(err.indexOf('ERRW_MUST_FIN') > -1) return 'ProvidICO must be finishede Token';
		else if(err.indexOf('ERRW_MISS_WAL') > -1) return 'Provide Wallet';
		else if(err.indexOf('ERRR_ZERO_WIT') > -1) return 'Nothing to withdraw';
		else if(err.indexOf('ERRR_WITH_BAD') > -1) return 'Unable to withdraw';
	
		return err;
	}

	return {
		loadVestingPrograms, VESTING_IDS,
		onSelectVestingId, VESTING_ID, VESTING_START_MILLIS, VESTING_CLIFF_DAYS, VESTING_DURATION_DAYS, VESTING_NUM_SLIDES,
		onSelectVestingSchedule, VESTING_SCHEDULE_ID, VESTING_SCHEDULE_PROGRAM_ID, VESTING_SCHEDULE_HOLDER, VESTING_SCHEDULE_AMOUNT, VESTING_SCHEDULE_RELEASED_AMOUNT,
		loadVestingScheduleList, VESTING_SCHEDULE_LIST,
		computeVesting, 
		releaseVesting, 
		setVestinGrantorOnSC, setVestinGrantor,
	}
}
