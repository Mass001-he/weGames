import * as z from 'zod';

// const schema = z.object({
// 	name: z.string().min(1),
// 	age: z.number().int().min(0).optional(),
// 	d: z.literal("yoda").nullable(),
// 	dd: z.literal("yoda").nullish(),
// 	ddd: z.literal("yoda").optional(),
// }).extend({
// 	email: z.email(),
// 	phone: z.string().optional(),
// }).omit({
// 	age: true,
// }).required({
// 	phone: true,
// }).refine((data) => {

// 	return data.phone?.trim().length > 0
// })

// type SchemaType = z.infer<typeof schema>;

// const result = schema.safeParse({
// 	name: "John Doe",
// 	age: 30,
// });

// console.log(result);

// // all properties are required by default
// const Person = z.object({
// 	name: z.string(),
// 	age: z.number().optional(),
// });

// const person = Person.parse({
// 	name: "John Doe",
// 	age: 30,
// 	email: "john.doe@example.com",
// });

// console.log(person);

// const DogWithStrings = z.object({
// 	name: z.string(),
// 	age: z.number().optional(),
// }).catchall(z.string());

// type DogWithStringsType = z.infer<typeof DogWithStrings>;

// const dogWithStrings = DogWithStrings.parse({ name: "Yeller", extraKey: "extraValue" }); // ✅
// const dogWithStrings2 = DogWithStrings.parse({ name: "Yeller", extraKey: 42 }); // ❌

// type DogWithStringsAgeType = DogWithStrings.shape.age;

// const DogWithStringsKeys = DogWithStrings.keyof();

// const DogWithArrayOfStrings = z.array(z.string().min(1)).min(5);

// type DogWithArrayOfStringsType = z.infer<typeof DogWithArrayOfStrings>;

// const payment = z.xor([
// 	z.object({ type: z.literal("card"), cardNumber: z.string() }),
// 	z.object({ type: z.literal("bank"), accountNumber: z.string() }),
// ]);

// payment.parse({ type: "bank", accountNumber: "1234" });

// const numberKeys = z.record(z.number(), z.string());

// type NumberKeysType = z.infer<typeof numberKeys>;

// type MyRecord = Record<"a" | "b", string>;

// const myString = z.string().refine((val) => val.length > 8, {
// 	error: "Too short!"
// });

const schema = z.string().refine((val) => {
	return val.length > 8;
});

schema.parse('123456789'); // ✅
schema.parse('1234'); // ❌
