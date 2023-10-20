import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

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
  let userA = await prisma.user.findFirst({where: {email: 'admin@admin.com'}});
  if (!userA) {
    const password = "admin"
    userA = await prisma.user.create({
      data: {
        email: "admin@admin.com",
        password: await bcrypt.hash(password, 12),
      },
    });
  }
  let userB = await prisma.user.findFirst({where: {email: 'driven@driven.com'}});
  if (!userB) {
    const password = "driven"
    userB = await prisma.user.create({
      data: {
        email: "driven@driven.com",
        password: await bcrypt.hash(password, 12),
      },
    });
  }
  let enrollmentA = await prisma.enrollment.findFirst({where: {userId: userA.id}});
  if (!enrollmentA) {
    enrollmentA = await prisma.enrollment.create({
      data: {
        name: "Administrador Seed",
        cpf: "13403946770",
        birthday: new Date("2001-01-01"),
        phone: "(99)12345-6789",
        userId: userA.id
        
      },
    });
  }
  let enrollmentB = await prisma.enrollment.findFirst({where: {userId: userB.id}});
  if (!enrollmentB) {
    enrollmentB = await prisma.enrollment.create({
      data: {
        name: "Testando o ticket Seed",
        cpf: "13403945770",
        birthday: new Date("2001-01-01"),
        phone: "(99)98765-4321",
        userId: userB.id
        
      },
    });
  }
  let address = await prisma.address.findFirst({where: {enrollmentId: enrollmentA.id}});
  if (!address) {
    address = await prisma.address.create({
      data: {
        cep: "22743670",
        street: "rua dos bobos",
        city: 'cidade natal',
        state: 'RJ',
        number: '0',
        neighborhood: 'alguma',
        enrollmentId: enrollmentA.id
      },
    });
  }

  let addressB = await prisma.address.findFirst({where: {enrollmentId: enrollmentB.id}});
  if (!addressB) {
    addressB = await prisma.address.create({
      data: {
        cep: "22743670",
        street: "rua dos bobos",
        city: 'cidade natal',
        state: 'RJ',
        number: '0',
        neighborhood: 'alguma',
        enrollmentId: enrollmentA.id
      },
    });
  }
  let ticketTypeA = await prisma.ticketType.findFirst({where: {name:"Ticket com Hotel"}});
  if (!ticketTypeA) {
    ticketTypeA = await prisma.ticketType.create({
      data: {
        name: "Ticket com Hotel",
        price: 20000,
        isRemote: false,
        includesHotel: true
      },
    });
  }
  let ticketTypeB = await prisma.ticketType.findFirst({where: {name:"Ticket Sem Hotel"}});
  if (!ticketTypeB) {
    ticketTypeB = await prisma.ticketType.create({
      data: {
        name: "Ticket Sem Hotel",
        price: 10000,
        isRemote: false,
        includesHotel: false
      },
    });
  }
  let ticketTypeC = await prisma.ticketType.findFirst({where: {name:"Ticket Online"}});
  if (!ticketTypeC) {
    ticketTypeC = await prisma.ticketType.create({
      data: {
        name: "Ticket Online",
        price: 5000,
        isRemote: true,
        includesHotel: false
      },
    });
  }
  let ticket = await prisma.ticket.findFirst();
  if (!ticket) {
    ticket = await prisma.ticket.create({
      data: {
        ticketTypeId: ticketTypeA.id,
        enrollmentId: enrollmentA.id,
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

  

  console.log({ event, hotel, room, ticket, ticketTypeA, ticketTypeB, ticketTypeC, userA, userB, enrollmentA, enrollmentB });

  }


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
