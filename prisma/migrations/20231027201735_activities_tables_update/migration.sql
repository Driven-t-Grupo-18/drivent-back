-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "activityDayId" INTEGER NOT NULL,
    "startsAt" VARCHAR(255) NOT NULL,
    "endsAt" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityDay" (
    "id" SERIAL NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityRegistration" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,
    "activityDayId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityRegistration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_activityDayId_fkey" FOREIGN KEY ("activityDayId") REFERENCES "ActivityDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityRegistration" ADD CONSTRAINT "ActivityRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityRegistration" ADD CONSTRAINT "ActivityRegistration_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityRegistration" ADD CONSTRAINT "ActivityRegistration_activityDayId_fkey" FOREIGN KEY ("activityDayId") REFERENCES "ActivityDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
