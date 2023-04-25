import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { findHotels, findHotelsById } from '@/controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken)
.get('/', findHotels)
.get('/:hotelId', findHotelsById)

export { hotelsRouter };