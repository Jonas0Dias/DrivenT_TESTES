import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';
import { InputTicketBody } from '@/protocols';

export async function findHotels(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response> {
    const { userId } = req;
  
    try {
      const hotel = await hotelsService.findHotels(userId);
      return res.status(httpStatus.OK).send(hotel);
    } catch (e) {
      next(e);
    }
  }

  export async function findHotelsById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response> {
    const { userId } = req;
    const hotelId = Number(req.params.id)
  
    try {
      const hotelWithRoom = await hotelsService.findHotelsById(userId, hotelId);
      return res.status(httpStatus.OK).send(hotelWithRoom);
    } catch (e) {
      next(e);
    }
  }