import { faker } from "@faker-js/faker";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  registeredDate: string;
  fullName: string;
  dsr: number;
};

export const generateFakeUsers = (count: number = 500): User[] => {
  return Array.from({ length: count }).map(() => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const registeredDate = faker.date.past({ years: 2 });
    const fullName = `${firstName} ${lastName}`;
    const dsr = Math.floor(
      (Date.now() - registeredDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      id: faker.string.uuid(),
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }),
      city: faker.location.city(),
      registeredDate: registeredDate.toISOString().split("T")[0],
      fullName,
      dsr,
    };
  });
};
