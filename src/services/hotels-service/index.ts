import { Hotel, Room } from '@prisma/client';
import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import hotelsRepositoty from '@/repositories/hotels-repositoty';
import httpStatus, { PAYMENT_REQUIRED } from 'http-status';
import { HotelWithRooms } from '@/protocols';

async function findHotels(userId: number): Promise<Hotel[]> {
    const Hotels: Hotel[] = await hotelsRepositoty.findHotels();
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

    const ticketWithType = await ticketsRepository.findTickeWithTypeById(ticket.id)
    

    if (!Hotels || !enrollment || !ticket) throw notFoundError();
    if (ticketWithType.TicketType.isRemote || ticket.status !== "PAID" || !ticketWithType.TicketType.includesHotel) throw httpStatus.PAYMENT_REQUIRED
    
    return Hotels;
    
  }


  async function findHotelsById(userId: number, hotelId: number): Promise<Hotel & { Rooms: Room[] }> {
    const Hotel: HotelWithRooms = await hotelsRepositoty.findHotelsById(hotelId);
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

    const ticketWithType = await ticketsRepository.findTickeWithTypeById(ticket.id)
    

    if (!Hotel || !enrollment || !ticket) throw notFoundError();
    if (ticketWithType.TicketType.isRemote || ticket.status !== "PAID" || !ticketWithType.TicketType.includesHotel) throw httpStatus.PAYMENT_REQUIRED
    
    return Hotel;
  }  

  const hotelsService = {findHotels, findHotelsById };

export default hotelsService;