import { setRedis } from '../src/redisConfig';
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    const objeto = {
      title: "Driven.t",
      logoImageUrl: "https://files.driven.com.br/images/logo-rounded.png",
      backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
      startsAt: dayjs().toDate(),
      endsAt: dayjs().add(21, "days").toDate(),
    }
    event = await prisma.event.create({data: objeto});

    setRedis('event', JSON.stringify(event));
    
  }
  let userA = await prisma.user.findFirst({where: {email: 'admin@admin.com'}});
  if (!userA) {
    const password = "admin"
    const objeto = {
      email: "admin@admin.com",
      password: await bcrypt.hash(password, 12),
    }
    userA = await prisma.user.create({data: objeto});

    setRedis('userA', JSON.stringify(userA));
  }
  let userB = await prisma.user.findFirst({where: {email: 'driven@driven.com'}});
  if (!userB) {
    const password = "driven"
    const objeto = {
      email: "driven@driven.com",
      password: await bcrypt.hash(password, 12),
    }
    userB = await prisma.user.create({data: objeto});

    setRedis('userB', JSON.stringify(userB));
  }
  let enrollmentA = await prisma.enrollment.findFirst({where: {userId: userA.id}});
  if (!enrollmentA) {
    const objeto = {
      name: "Administrador Seed",
      cpf: "13403946770",
      birthday: new Date("2001-01-01"),
      phone: "(99)12345-6789",
      userId: userA.id
      
    }
    enrollmentA = await prisma.enrollment.create({data: objeto});
    setRedis('enrollmentA', JSON.stringify(enrollmentA));

  }
  let enrollmentB = await prisma.enrollment.findFirst({where: {userId: userB.id}});
  if (!enrollmentB) {
    const objeto = {
      name: "Testando o ticket Seed",
      cpf: "13403945770",
      birthday: new Date("2001-01-01"),
      phone: "(99)98765-4321",
      userId: userB.id
      
    }
    enrollmentB = await prisma.enrollment.create({data: objeto});
    setRedis('enrollmentB', JSON.stringify(enrollmentB));
  }
  let addressA = await prisma.address.findFirst({where: {enrollmentId: enrollmentA.id}});
  if (!addressA) {
    const objeto = {
      cep: "22743670",
      street: "rua dos bobos",
      city: 'cidade natal',
      state: 'RJ',
      number: '0',
      neighborhood: 'alguma',
      enrollmentId: enrollmentA.id
    }
    addressA = await prisma.address.create({data: objeto});
    setRedis('addressA', JSON.stringify(addressA));
  }

  let addressB = await prisma.address.findFirst({where: {enrollmentId: enrollmentB.id}});
  if (!addressB) {
    const objeto = {
      cep: "22743670",
      street: "rua dos bobos",
      city: 'cidade natal',
      state: 'RJ',
      number: '0',
      neighborhood: 'alguma',
      enrollmentId: enrollmentB.id
    }
    addressB = await prisma.address.create({data: objeto});
    setRedis('addressB', JSON.stringify(addressB));
  }
  let ticketTypeA = await prisma.ticketType.findFirst({where: {name:"Ticket com Hotel"}});
  if (!ticketTypeA) {
    const objeto = {
      name: "Ticket com Hotel",
      price: 20000,
      isRemote: false,
      includesHotel: true
    }
    ticketTypeA = await prisma.ticketType.create({data: objeto});
    setRedis('ticketTypeA', JSON.stringify(ticketTypeA));
  }
  let ticketTypeB = await prisma.ticketType.findFirst({where: {name:"Ticket Sem Hotel"}});
  if (!ticketTypeB) {
    const objeto = {
      name: "Ticket Sem Hotel",
      price: 10000,
      isRemote: false,
      includesHotel: false
    }
    ticketTypeB = await prisma.ticketType.create({data: objeto});
    setRedis('ticketTypeB', JSON.stringify(ticketTypeB));
  }
  let ticketTypeC = await prisma.ticketType.findFirst({where: {name:"Ticket Online"}});
  if (!ticketTypeC) {
    const objeto = {
      name: "Ticket Online",
      price: 5000,
      isRemote: true,
      includesHotel: false
    }
    ticketTypeC = await prisma.ticketType.create({data: objeto});
    setRedis('ticketTypeC', JSON.stringify(ticketTypeC));
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
    const objeto = {
      name: "Hotel Seed",
      image: "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2017/08/29/1013/Grand-Hyatt-Rio-de-Janeiro-P443-Pool.jpg/Grand-Hyatt-Rio-de-Janeiro-P443-Pool.16x9.jpg?imwidth=1920",
    }
    hotel = await prisma.hotel.create({data: objeto});
    setRedis('hotel', JSON.stringify(hotel));
  }
    let room = await prisma.room.findFirst();
  if (!room) {
    const objeto = {
      name: "101",
      capacity: 3,
      hotelId: hotel.id
    }
    room = await prisma.room.create({data: objeto});
    setRedis('room', JSON.stringify(room));
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
