import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from './constants/Paths';
import User from '@src/models/User';
import DiscrepancyRoutes from './DiscrepancyRoutes';


// **** Variables **** //

const apiRouter = Router(),
  validate = jetValidator();



  
// ** Add Discrepancies Router ** //

const discrepanciesRouter = Router();

// Get all 
discrepanciesRouter.get(
  Paths.Discrepancy.All,
  DiscrepancyRoutes.getAll,
);

discrepanciesRouter.get(
  Paths.Discrepancy.Team,
  DiscrepancyRoutes.getAll,
);

// Add UserRouter
apiRouter.use(Paths.Discrepancy.Base, discrepanciesRouter);


// **** Export default **** //

export default apiRouter;
