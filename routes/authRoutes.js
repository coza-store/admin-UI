const express = require('express');
const { body } = require('express-validator/check');
const authController = require('../controllers/authController');
const router = express.Router();
const checkAuth = require('../middleware/protect-routes');


//dang nhap
router.get('/login', authController.getLogIn);
//xu ly dang nhap
router.post('/login', authController.postLogIn);
//dang xuat
router.post('/logout', authController.postLogOut);

router.get('/setting', checkAuth, authController.getSetting);

router.post('/setting', checkAuth, authController.postSetting);

router.post('/setting-password', checkAuth,
    body('newPswd', 'Password must have upper,lower,number and at least 8 charater').matches(/^(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i"),
    body('confirmPswd', '').custom((value, { req }) => {
        if (value !== req.body.newPswd) {
            throw new Error('Confirm password is not match');
        }
        return true;
    }),
    authController.postResetSetting);
module.exports = router;