import User from "../../DB/Models/user.model.js";
import jwt from "jsonwebtoken";
export const auth = (accessRoles) => {
  return async (req, res, next) => {
    const { accesstoken } = req.headers;
    if (!accesstoken)
      return next({ message: "Access token is missing", cause: 401 });
    //* check if access token starts with token prefix
    if (!accesstoken.startsWith(process.env.TOKEN_PREFIX))
      return next({ message: "Invalid access token", cause: 401 });

    //* split token from the prefix
    const token = accesstoken.split(process.env.TOKEN_PREFIX)[1];

    //* verify the token
    try {
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      if (!decodedData || !decodedData.id)
        return next({ message: "Invalid access token", cause: 401 });

      //* check if the user is found in the database
      const user = await User.findById(decodedData.id, "-password");
      if (!user) return next({ message: "User is not found", cause: 404 });

      //* attach the user to the request object
      req.authUser = user;

      //* check if the user has the required role
      if (!accessRoles.includes(req.authUser.role))
        return next({ message: "Unauthorized", cause: 403 });
        
      return next();
    } catch (error) {
      //* check if the token is expired
      if (error == 'TokenExpiredError: jwt expired' || error == 'JsonWebTokenError: invalid signature') {
        const findUser = await User.findOne({ token });
        if (!findUser) return next({ message: "wrong token", cause: 404 });
        const newToken = jwt.sign({email: findUser.email, role:findUser.role, id:findUser._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION});
        findUser.token = newToken;
        await findUser.save();
        req.authUser = findUser;
        return res.status(200).json({message: "Token is refreshed", token: newToken});
        // return next();
      }
      else if(error == 'JsonWebTokenError: invalid signature'){
        return next({ message: "invalid token signature", cause: 401 });
      }
    }
  };
};
