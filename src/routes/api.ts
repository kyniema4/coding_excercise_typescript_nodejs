import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from './constants/Paths';
import User from '@src/models/User';
import UserRoutes from './UserRoutes';


// **** Variables **** //

const apiRouter = Router(),
  validate = jetValidator();



  
// ** Add Discrepancies Router ** //

const discrepanciesRouter = Router();



// Add UserRouter
apiRouter.use(Paths.Discrepancies.Base, discrepanciesRouter);


// **** Export default **** //

export default apiRouter;
