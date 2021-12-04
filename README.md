## Running the Project
1. Install dependecies `npm install`
2. Run the migrations `npx prisma migrate dev` (or `npx prisma migrate deploy`)
3. Optional, run the seeders:
To run the seeders you need to add `"type": "module"` to package.json, and then run `npx prisma db seed`, remove the same line from package.json after.
4. Start the application `npm run dev`