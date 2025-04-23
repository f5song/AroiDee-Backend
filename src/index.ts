import express, { Request, Response } from 'express';


const app = express();
const PORT = 3000;

// Middleware สำหรับแปลง JSON
app.use(express.json());

// Route ตัวอย่าง
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express with TypeScript!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});