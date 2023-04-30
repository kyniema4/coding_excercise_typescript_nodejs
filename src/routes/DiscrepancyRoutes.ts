import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import DiscrepancyService from '@src/services/DiscrepancyService';
import { IReq, IRes } from './types/express/misc';


// **** Functions **** //


async function getAll(_: IReq, res: IRes) {
    const data = await DiscrepancyService.getAll();
    return res.status(HttpStatusCodes.OK).json(data);
}

async function getByGame(_: IReq, res: IRes) {
    const data = await DiscrepancyService.filterByGame();
    return res.status(HttpStatusCodes.OK).json(data);
}

async function getByPlayer(_: IReq, res: IRes) {
    const data = await DiscrepancyService.filterByPlayer();
    return res.status(HttpStatusCodes.OK).json(data);
}

async function getByTeam(_: IReq, res: IRes) {
    const data = await DiscrepancyService.filterByTeam();
    return res.status(HttpStatusCodes.OK).json(data);
}

// **** Export default **** //

export default {
  getAll,
  getByGame,
  getByPlayer,
  getByTeam,
} as const;
