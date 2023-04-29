import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import UserService from '@src/services/DiscrepancyService';
import { IUser } from '@src/models/User';
import { IReq, IRes } from './types/express/misc';


// **** Functions **** //


async function getAll(_: IReq, res: IRes) {
//   const users = await UserService.getAll();
    const data = {}
    return res.status(HttpStatusCodes.OK).json(data);
}

async function getByUsers(_: IReq, res: IRes) {
//   const users = await UserService.getAll();
    const data = {}
    return res.status(HttpStatusCodes.OK).json(data);
}


// **** Export default **** //

export default {
  getAll,
} as const;
