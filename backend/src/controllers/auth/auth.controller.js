import authService from '../../services/auth/auth.service.js';

class AuthController {
  signup = async (req, res, next) => {
    try {
      const result = await authService.signup(req.body);
      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          userId: result.userId,
          email: result.email,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  verifyOtp = async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      const result = await authService.verifyOtp(email, otp);
      res.status(200).json({
        success: true,
        message: result.message,
        data: {},
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: result.user,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      res.status(200).json({
        success: true,
        message: 'Access token refreshed successfully',
        data: {
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      await authService.logout(req.user._id);
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
        data: {},
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      res.status(200).json({
        success: true,
        message: result.message,
        data: {},
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { email, otp, newPassword } = req.body;
      const result = await authService.resetPassword(email, otp, newPassword);
      res.status(200).json({
        success: true,
        message: result.message,
        data: {},
      });
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req, res, next) => {
    try {
      const user = await authService.getProfile(req.user._id);
      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req, res, next) => {
    try {
      const updatedUser = await authService.updateProfile(req.user._id, req.body);
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();
