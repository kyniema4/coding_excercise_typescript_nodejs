import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import DiscrepancyService from '@src/services/DiscrepancyService';
import { IReq, IRes } from './types/express/misc';


// **** Functions **** //


async function getAll(_: IReq, res: IRes) {
    const data = await DiscrepancyService.getAll();
    return res.status(HttpStatusCodes.OK).json(data);
}


// **** Export default **** //

export default {
  getAll,
} as const;
