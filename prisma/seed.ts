import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driven.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });

    
  }
  let user = await prisma.user.findFirst();
  if (!user) {
    const password = 'admin'
    user = await prisma.user.create({
      data: {
        email: "admin@admin.com",
        password: await bcrypt.hash(password, 12),
      },
    });
  }
  let enrollment = await prisma.enrollment.findFirst();
  if (!enrollment) {
    enrollment = await prisma.enrollment.create({
      data: {
        name: "Administrador Seed",
        cpf: "13403946770",
        birthday: new Date('2000-01-01'),
        phone: "(99)12345-6789",
        userId: user.id
        
      },
    });
  }
  let address = await prisma.address.findFirst({where: {cep: "22743670"}});
  if (!address) {
    address = await prisma.address.create({
      data: {
        cep: "22743670",
        street: "rua dos bobos",
        city: 'cidade natal',
        state: 'RJ',
        number: '0',
        neighborhood: 'alguma',
        enrollmentId: enrollment.id
        
      },
    });
  }
  let ticketType = await prisma.ticketType.findFirst();
  if (!ticketType) {
    ticketType = await prisma.ticketType.create({
      data: {
        name: "Ticket Type Seed",
        price: 20000,
        isRemote: false,
        includesHotel: true
      },
    });
  }
  let ticket = await prisma.ticket.findFirst();
  if (!ticket) {
    ticket = await prisma.ticket.create({
      data: {
        ticketTypeId: ticketType.id,
        enrollmentId: enrollment.id,
        status: 'PAID'
      },
    });
  }
  let hotel = await prisma.hotel.findFirst();
  if (!hotel) {
    hotel = await prisma.hotel.create({
      data: {
        name: "Hotel Seed",
        image: "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2017/08/29/1013/Grand-Hyatt-Rio-de-Janeiro-P443-Pool.jpg/Grand-Hyatt-Rio-de-Janeiro-P443-Pool.16x9.jpg?imwidth=1920",
      },
    });
  }
    let room = await prisma.room.findFirst();
  if (!room) {
    room = await prisma.room.create({
      data: {
        name: "101",
        capacity: 3,
        hotelId: hotel.id
      },
    });
  }

  

  console.log({ event, hotel, room, ticket, ticketType, user, enrollment });

  }


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
