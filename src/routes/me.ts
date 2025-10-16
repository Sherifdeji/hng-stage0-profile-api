import { Router, Request, Response } from 'express';

const router = Router();

interface ProfileResponse {
  status: string;
  user: {
    email: string;
    name: string;
    stack: string;
  };
  timestamp: string;
  fact: string;
}

router.get('/me', async (req: Request, res: Response) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const catFactResponse = await fetch('https://catfact.ninja/fact', {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!catFactResponse.ok) {
      throw new Error('Failed to fetch cat fact');
    }
    const catFactData = await catFactResponse.json();
    const catFact: string = catFactData.fact;

    const myData: ProfileResponse = {
      status: 'success',
      user: {
        email: process.env.EMAIL || '',
        name: process.env.NAME || '',
        stack: process.env.STACK || '',
      },
      timestamp: new Date().toISOString(),
      fact: catFact,
    };
    res.status(200).json(myData);
  } catch (error) {
    console.error('Error fetching cat fact:', error);
    res.status(500).json({
      status: 'error',
      message: 'Could not fetch a cat fact at this time',
    });
  }
});

export default router;
