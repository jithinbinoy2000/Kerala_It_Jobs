const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET_KEY;

exports.verifyUser = async (request, response, next) => {
    try {
      const authHeader = request.headers['authorization'];
      if (!authHeader) {
        return response.status(401).json({ message: "Authorization header is missing. Please login." });
      }
      const token = authHeader.split(' ')[1];
      if (!token) {
        return response.status(401).json({ message: "Token not provided. Please login." });
      }
  
      // Verify the token
      try {
        const jwtResponse = jwt.verify(token, jwtSecret);
        request.payload = jwtResponse;  
        next(); 
      } catch (error) {
        return response.status(401).json({ message: `Invalid or expired token. Please login again.` });
      }
    } catch (error) {
      response.status(500).json({ message: `Server error: ${error.message}` });
    }
  };
  
