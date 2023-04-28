import { Address, Enrollment, Hotel, Room } from '@prisma/client';
import { notFoundError, cannotListHotelsError} from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import hotelsRepositoty from '@/repositories/hotels-repositoty';
import httpStatus, { PAYMENT_REQUIRED } from 'http-status';
import { HotelWithRooms } from '@/protocols';

async function findHotels(userId: number): Promise<Hotel[]> {
    const Hotels: Hotel[] = await hotelsRepositoty.findHotels();
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

    if (!ticket) throw notFoundError();
    console.log('teste tickets')

    const ticketWithType = await ticketsRepository.findTickeWithTypeById(ticket.id)

    if (ticketWithType.TicketType.isRemote || ticket.status !== "PAID" || !ticketWithType.TicketType.includesHotel) throw cannotListHotelsError();

    if (Hotels.length===0 ) throw notFoundError();
    return Hotels;
    
  }


  async function findHotelsById(userId: number, hotelId: number): Promise<Hotel & { Rooms: Room[] }> {
    const Hotel: HotelWithRooms = await hotelsRepositoty.findHotelsById(hotelId);
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
   if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

    if (!ticket) throw notFoundError();
    console.log('teste tickets')

    const ticketWithType = await ticketsRepository.findTickeWithTypeById(ticket.id)

    if (ticketWithType.TicketType.isRemote || ticket.status !== "PAID" || !ticketWithType.TicketType.includesHotel) throw httpStatus.PAYMENT_REQUIRED
    
    if (!Hotel) throw notFoundError();
    
    
    return Hotel;
  }  

  const hotelsService = {findHotels, findHotelsById };

export default hotelsService;