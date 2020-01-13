/**
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * 
 * Middleware use for authentication, constructor method
 * Middleware functions are functions that have access to the request object (req), 
 * the response object (res), and the next middleware function in the application’s request-response cycle.
 */

const helloWorldMiddleware = async (req, res, next) => {
    try {
      console.log("this is middleware")
      next()
    } catch (error) {
      res
        .status(400)
        .send({
          message: 'catch exception error'
        })
    }
  }
  
  module.exports = {
    helloWorldMiddleware
  }