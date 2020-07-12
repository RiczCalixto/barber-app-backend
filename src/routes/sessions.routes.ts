import { Router } from 'express';
import { CreateSessionService } from '../services/CreateSession.service';

export const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;
    const createSession = new CreateSessionService();
    const { user } = await createSession.execute({ email, password });

    delete user.password;

    return response.json({ user });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});
