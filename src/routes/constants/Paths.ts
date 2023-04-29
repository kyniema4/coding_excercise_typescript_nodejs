/**
 * Express router paths go here.
 */

import { Immutable } from '@src/other/types';


const Paths = {
  Base: '/api',
  Discrepancy:{
    Base: '/discrepancies',
    All: '/all',
    Player:'/player',
    Team:'/team',
    Game:'/game',
  },
};


// **** Export **** //

export type TPaths = Immutable<typeof Paths>;
export default Paths as TPaths;
