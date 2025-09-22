import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { LEAVE_TYPE, ROLE } from "@/enum";
import { eq } from "drizzle-orm";
import { nanoid } from "@/lib/utils";
import {
  LeaveTypeTableInsertType,
  UserDetailTableInsertType,
  UserTableInsertType,
} from "./types";
import {
  LeaveTypeTable,
  LeaveYearTable,
  UserDetailTable,
  UserTable,
} from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle({ client: pool });

const usersData: {
  user: UserTableInsertType;
  detail: UserDetailTableInsertType;
}[] = [
  {
    user: {
      id: "",
      name: "Munawar Saeed",
      email: "munawar@lycusinc.com",
    },
    detail: {
      userId: "",
      employeeId: "1",
      role: ROLE.ADMIN,
    },
  },
  {
    user: {
      id: "",
      name: "Shoaib Amjad",
      email: "shoaibamjad@lycusinc.com",
    },
    detail: {
      userId: "",
      employeeId: "2",
      role: ROLE.ADMIN,
    },
  },
];

const leavesData: LeaveTypeTableInsertType[] = [
  {
    name: "Casual Leave",
    description: "Leave for personal reasons or non-critical matters.",
    category: LEAVE_TYPE.PAID,
    dayFraction: "1.00",
    maxAllowed: 8,
    isPrivate: false,
    systemGenerated: true,
  },
  {
    name: "Sick Leave",
    description: "Leave for medical or health-related issues.",
    category: LEAVE_TYPE.PAID,
    dayFraction: "1.00",
    maxAllowed: 6,
    isPrivate: false,
    systemGenerated: true,
  },
  {
    name: "Annual Leave",
    description: "Planned leave for vacations or holidays.",
    category: LEAVE_TYPE.PAID,
    dayFraction: "1.00",
    maxAllowed: 10,
    isPrivate: false,
    systemGenerated: true,
  },
  {
    name: "Half Day Leave",
    description: "Leave taken for half a working day.",
    category: LEAVE_TYPE.PAID,
    dayFraction: "0.5",
    isPrivate: false,
    systemGenerated: true,
  },
  {
    name: "Short Leave",
    description: "Brief time-off for errands, quick tasks or coming late.",
    category: LEAVE_TYPE.PAID,
    dayFraction: "0.33",
    isPrivate: true,
    systemGenerated: true,
  },
];

const main = async () => {
  console.log("Starting database seeding...");

  const [user] = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.email, "munawar@lycusinc.com"));

  if (user) {
    console.log("Data already exists. Seeding aborted.");
    process.exit(0);
  }

  for (const user of usersData) {
    const [newUser] = await db
      .insert(UserTable)
      .values({
        ...user.user,
        id: nanoid(),
      })
      .returning();

    await db.insert(UserDetailTable).values({
      ...user.detail,
      userId: newUser.id,
    });
  }

  for (const leave of leavesData) {
    await db.insert(LeaveTypeTable).values(leave);
  }

  const currentYear = new Date().getFullYear();
  await db.insert(LeaveYearTable).values({
    name: String(currentYear),
    startDate: `${currentYear}-01-01`,
    isActive: true,
  });

  console.log("Database seeding completed.");
  process.exit(0);
};

main()
  .then()
  .catch((error) => {
    console.error(`An Error Occured!\n${error}`);
    process.exit(0);
  });
