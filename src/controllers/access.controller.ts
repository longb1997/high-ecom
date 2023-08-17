import AccessService from "../services/access.service";

class AccessController {
  signup = async (req: any, res: any, next: any) => {
    try {
      console.log(`P::signUp::`, req.body);
      return res.status(201).json(await AccessService.signUp(req.body));
    } catch (error) {
      next(error);
    }
  };
}

export default new AccessController();
