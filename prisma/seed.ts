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
      endsAt: dayjs().add(10, "years").toDate(),
    }
    event = await prisma.event.create({data: objeto});
    
  }
  let userA = await prisma.user.findFirst({where: {email: 'admin@admin.com'}});
  if (!userA) {
    const password = "admin"
    const objeto = {
      email: "admin@admin.com",
      password: await bcrypt.hash(password, 12),
    }
    userA = await prisma.user.create({data: objeto});

  }
  let userB = await prisma.user.findFirst({where: {email: 'driven@driven.com'}});
  if (!userB) {
    const password = "driven"
    const objeto = {
      email: "driven@driven.com",
      password: await bcrypt.hash(password, 12),
    }
    userB = await prisma.user.create({data: objeto});

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
  }
  let ticketTypeA = await prisma.ticketType.findFirst({where: {name:"Ticket com Hotel"}});
  if (!ticketTypeA) {
    const objeto = {
      name: "Ticket com Hotel",
      price: 350,
      isRemote: false,
      includesHotel: true
    }
    ticketTypeA = await prisma.ticketType.create({data: objeto});
  }
  let ticketTypeB = await prisma.ticketType.findFirst({where: {name:"Ticket Sem Hotel"}});
  if (!ticketTypeB) {
    const objeto = {
      name: "Ticket Sem Hotel",
      price: 250,
      isRemote: false,
      includesHotel: false
    }
    ticketTypeB = await prisma.ticketType.create({data: objeto});
  }
  let ticketTypeC = await prisma.ticketType.findFirst({where: {name:"Ticket Online"}});
  if (!ticketTypeC) {
    const objeto = {
      name: "Ticket Online",
      price: 100,
      isRemote: true,
      includesHotel: false
    }
    ticketTypeC = await prisma.ticketType.create({data: objeto});
  }
 
  let hotel = await prisma.hotel.findFirst();
  if (!hotel) {
    const objeto = {
      name: "Hotel Seed",
      image: "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2017/08/29/1013/Grand-Hyatt-Rio-de-Janeiro-P443-Pool.jpg/Grand-Hyatt-Rio-de-Janeiro-P443-Pool.16x9.jpg?imwidth=1920",
    }
    hotel = await prisma.hotel.create({data: objeto});
  }
    let roomA = await prisma.room.findFirst();
  if (!roomA) {
    const objeto = {
      name: "101",
      capacity: 3,
      hotelId: hotel.id
    }
    roomA = await prisma.room.create({data: objeto});
  }

  let roomB = await prisma.room.findFirst({where: {AND: [{name: '102'}, {hotelId: hotel.id}]}});
  if (!roomB) {
    const objeto = {
      name: "102",
      capacity: 2,
      hotelId: hotel.id
    }
    roomB = await prisma.room.create({data: objeto});
    
  }

  let activityDays: any = await prisma.activityDay.findFirst();
  if (!activityDays) {
    activityDays = await prisma.activityDay.createMany({
      data: [
        { startsAt: dayjs().add(2, "days").toDate() },
        { startsAt: dayjs().add(3, "days").toDate() },
        { startsAt: dayjs().add(4, "days").toDate() },
      ],
    });
  }

  const activitiesList = await prisma.activity.findFirst();
  let seedActivities: any; 
  if (!activitiesList) {
    activityDays = await prisma.activityDay.findMany({});
    seedActivities = await prisma.activity.createMany(
      {
        data: [
          { 
            activityDayId: activityDays[0].id, 
            name: "Minecraft: montando o PC ideal", 
            location: "Auditório Principal", 
            capacity: 27, 
            startsAt: "09:00",
            endsAt: "10:00",
          },
          { 
            activityDayId: activityDays[0].id, 
            name: "LoL: montando o PC ideal", 
            location: "Auditório Principal", 
            capacity: 0, 
            startsAt: "10:00",
            endsAt: "11:00",
          },
          { 
            activityDayId: activityDays[0].id, 
            name: "Palestra x", 
            location: "Auditório Lateral", 
            capacity: 27, 
            startsAt: "09:00",
            endsAt: "11:00",
          },
          { 
            activityDayId: activityDays[0].id, 
            name: "Palestra y", 
            location: "Workshop", 
            capacity: 27, 
            startsAt: "09:00",
            endsAt: "10:00",
          },
          { 
            activityDayId: activityDays[0].id, 
            name: "Palestra z", 
            location: "Workshop", 
            capacity: 0, 
            startsAt: "10:00",
            endsAt: "11:00",
          },
        ]
      });
  }
  console.log({ event, hotel, roomA, roomB, ticketTypeA, ticketTypeB, ticketTypeC, userA, userB, enrollmentA, enrollmentB, activityDays, seedActivities });
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
