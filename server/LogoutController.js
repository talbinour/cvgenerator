class LogoutController {
    logout(req, res) {
      try {
        req.logout((err) => {
          if (err) {
            console.error('Error during logout:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }
          res.status(200).json({ message: 'Logout successful' });
        });
      } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
  
  module.exports = LogoutController;
  