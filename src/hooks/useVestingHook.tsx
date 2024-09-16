"use client";

import { useContext, useState } from 'react';

import { toast } from 'react-toastify';
import { ContractsContext } from './useContractContextHook';
import { ethers } from 'ethers';
import { LOG_METHODS } from 'config/config';

declare let window:any

export function useVestingHook() {

	const { contracts } = useContext(ContractsContext);

	// **********************************************************************************************************
	// ******************************************* loadBlockchainDatetime ***************************************
	// **********************************************************************************************************
	const [METAMASK_CHAIN_TIME_IN_MS, setChainTimeInMs] = useState<number>(0);

	async function loadBlockchainDatetime() {
		console.log('%c loadBlockchainDatetime', LOG_METHODS);

		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const blockTimestamp = (await provider.getBlock("latest")).timestamp;
		console.log('%c blockTimestamp', LOG_METHODS, blockTimestamp);
		setChainTimeInMs(blockTimestamp * 1000) ;
	}

	// **********************************************************************************************************
	// ********************************************** loadVestingPrograms ***************************************
	// **********************************************************************************************************
	const [VESTING_IDS, setVestingIds] = useState([]);
	async function loadVestingPrograms() {
		console.log('%c loadVestingPrograms', LOG_METHODS);

		// vesting
		let vestingIds = await contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.getVestingIds();
		console.log('%c vestingIds', LOG_METHODS, vestingIds);
		setVestingIds(vestingIds);

		let tokenAddressInVestingContract = await contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.getTokenAddress();
		console.log('%c tokenAddressInVestingContract', LOG_METHODS, tokenAddressInVestingContract);
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
		console.log('%c onSelectVestingId', LOG_METHODS, vestingId);

		let vesting = await contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.getVesting(vestingId);
		console.log('%c vesting', LOG_METHODS, vesting);

		let vestingStartInMillis = parseInt(vesting[0]) * 1000;
		console.log('%c vestingStartInMillis', LOG_METHODS, vestingStartInMillis);
		var dateFormat = new Date(vestingStartInMillis);
		console.log('%c dateFormat', LOG_METHODS, dateFormat);
		console.log('%c dateFormat', LOG_METHODS, dateFormat.toISOString().slice(0, 16));

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
		console.log('%c onSelectVestingSchedule', LOG_METHODS, vestingScheduleId);

		let vestingSchedule = await contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.getVestingSchedule(vestingScheduleId);
		console.log('%c vestingSchedule', LOG_METHODS, vestingSchedule);

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
		console.log('%c loadVestingScheduleList', LOG_METHODS);

		let vestingScheduleList = await contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.getVestingSchedulesIds();
		console.log('%c vestingScheduleList', LOG_METHODS, vestingScheduleList);
		setVestingScheduleList(vestingScheduleList);
	}

	// **********************************************************************************************************
	// ********************************* setVestingScheduleTokenAddress *****************************************
	// **********************************************************************************************************
	const [VESTING_SCHEDULE_TOKEN_ADDRESS, setVestingScheduleTokenAddress] = useState<string>()

	async function loadVestingScheduleTokenAddress() {
		console.log('%c loadVestingScheduleTokenAddress', LOG_METHODS);

		let tokenAddressInVestingContract = await contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.getTokenAddress();
		console.log('%c tokenAddressInVestingContract', LOG_METHODS, tokenAddressInVestingContract);
		setVestingScheduleTokenAddress(tokenAddressInVestingContract);
	}

	// **********************************************************************************************************
	// ********************************************** computeVesting ********************************************
	// **********************************************************************************************************
	async function computeVesting() {
		console.log('%c computeVesting', LOG_METHODS);

		let releseableAmount = await contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.computeReleasableAmount(VESTING_SCHEDULE_ID);
		console.log('%c releseableAmount', LOG_METHODS, releseableAmount);
		setVestingScheduleReleasedAmount(releseableAmount);
	}

	// **********************************************************************************************************
	// ********************************************** releaseVesting ********************************************
	// **********************************************************************************************************
	async function releaseVesting() {
		console.log('%c releaseVesting', LOG_METHODS, VESTING_SCHEDULE_ID);
		await contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.release(VESTING_SCHEDULE_ID);
	}

	// ***********************************************************************************************
	// ************************************** TX Processing ******************************************
	// ***********************************************************************************************
	async function handleICOReceipt(tx:any) {
		console.log('%c handleICOReceipt', LOG_METHODS, tx);
		console.log('%c Transaction hash', LOG_METHODS, tx.hash);

		// process transaction
		const receipt = await tx.wait();
		console.log('%c Transaction receipt', LOG_METHODS, receipt);
		console.log('%c Transaction confirmed in block', LOG_METHODS, receipt.blockNumber);
		console.log('%c Gas used', LOG_METHODS, receipt.gasUsed.toString());

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
		console.error('Ohhhh nooo', err, err.code, err.message);

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
		loadBlockchainDatetime, METAMASK_CHAIN_TIME_IN_MS,
		loadVestingPrograms, VESTING_IDS,
		loadVestingScheduleTokenAddress, VESTING_SCHEDULE_TOKEN_ADDRESS,
		onSelectVestingId, VESTING_ID, VESTING_START_MILLIS, VESTING_CLIFF_DAYS, VESTING_DURATION_DAYS, VESTING_NUM_SLIDES,
		onSelectVestingSchedule, VESTING_SCHEDULE_ID, VESTING_SCHEDULE_PROGRAM_ID, VESTING_SCHEDULE_HOLDER, VESTING_SCHEDULE_AMOUNT, VESTING_SCHEDULE_RELEASED_AMOUNT,
		loadVestingScheduleList, VESTING_SCHEDULE_LIST,
		computeVesting, 
		releaseVesting,
	}
}
