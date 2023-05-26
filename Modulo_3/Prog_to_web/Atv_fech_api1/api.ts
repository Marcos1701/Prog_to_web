import { Router, Response, Request} from "express";

const router = Router();

router.get('/', (r: Request, res: Response) => {
    res.send('Hello, World!')
})