
import { RouteError } from '@src/other/classes';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import DiscrepancyRepo from '@src/repos/DiscrepancyRepo';


// **** Variables **** //

export const USER_NOT_FOUND_ERR = 'User not found';


// **** Functions **** //

/**
 * Get all discrepancy.
 */
function getAll() {
    return DiscrepancyRepo.getAll();
}


export default {
  getAll,
} as const;
