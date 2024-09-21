"use client";

import { useNotifications } from '@web3-onboard/react';
import { LOG_METHODS } from 'config/config';
import { toast } from 'react-toastify';

export function useResponseHook() {

	const [notifications, customNotification, updateNotify, preflightNotifications] = useNotifications()

	async function handleICOReceipt(tx:any) {
		console.log('%c handleICOReceipt', LOG_METHODS, tx);

		// process transaction
		console.log('%c Transaction hash', LOG_METHODS, tx.hash);
		const receipt = await tx.wait();
		console.log(receipt);
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

		customNotification({
			eventCode: 'connect',
			type: 'success',
			message: 'GasUsed: ' + receipt.gasUsed,
			autoDismiss: 5000,
			//onClick: () => window.open(`https://www.blocknative.com`)
		})

		//populateICOContractData();
		return tx;
	}

	async function handleError(err:any) {
		console.error('Ohhhh nooo', err, err.code);
		console.error('err.message: ' + err.message);

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

		customNotification({
			eventCode: 'connect',
			type: 'error',
			message: parseError(err.message),
			autoDismiss: 5000,
			//onClick: () => window.open(`https://www.blocknative.com`)
		})
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
		handleICOReceipt,
		handleError,
	}
}
