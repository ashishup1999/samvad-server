const {
  getUser,
  addUser,
  createOTP,
  getOTP,
  updateUser,
} = require("../db/AuthRepo");
const nodemailer = require("nodemailer");
const { decryptData } = require("../utils/Encryption");
const { activateUser } = require("../db/HomeRepo");

const AuthenticateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user =
      (await getUser("email", email)) || (await getUser("username", username));
    if (!user) {
      res.send({ status: "ERROR", responseCd: "User does not exists" });
    } else if (decryptData(user?.password) === decryptData(password)) {
      await activateUser(username);
      res.send({
        status: "SUCCESS",
        isAuthenticated: true,
        fullName: user?.fullName,
        profileImg: user?.profileImg,
        responseCd: "0",
      });
    } else {
      res.send({ status: "ERROR", isAuthenticated: false, responseCd: "0" });
    }
  } catch (error) {
    res.send({ status: "ERROR" });
  }
};

const SignUpUser = async (req, res) => {
  try {
    const { fullName, username, email, password, profileImg } = req.body;
    if (
      (await getUser("email", username)) ||
      (await getUser("username", username))
    ) {
      res.send({ status: "SUCCESS", responseCd: "USERNAME_ALLREADY_EXISTS" });
    } else if (
      (await getUser("email", email)) ||
      (await getUser("username", email))
    ) {
      res.send({ status: "SUCCESS", responseCd: "EMAIL_ALLREADY_EXISTS" });
    } else {
      await addUser({ fullName, username, email, password, profileImg });
      res.send({
        status: "SUCCESS",
        responseCd: "0",
        message: "User Created Successully",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: "ERROR" });
  }
};

const SendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!(await getUser("email", email))) {
      res.send({
        status: "ERROR",
        responseCd: "Email not found",
        errCode: "401",
      });
    } else {
      const transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        auth: {
          user: "samvadkaro@outlook.com",
          pass: "A11shishup@",
        },
        tls: {
          ciphers: "SSLv3",
        },
      });

      const otp = await createOTP(email);

      const mailConfigurations = {
        from: "Samvad samvadkaro@outlook.com",
        to: email,
        subject: "Email Verification",
        text: `Hi forgot your password no worries please use this code: ${otp} `,
      };

      transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) throw Error(error);
        console.log("Email Sent Successfully");
        console.log(info);
      });

      res.send({
        status: "SUCCESS",
        responseCd: "0",
        message: "Code sent on email",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: "ERROR", responseCd: "Seems to be a technical error." });
  }
};

const VerifyOtp = async (req, res) => {
  try {
    const { email, enteredOtp } = req.body;
    const realOtp = await getOTP(email);
    if (realOtp) {
      if (enteredOtp === realOtp) {
        res.send({
          status: "SUCCESS",
          responseCd: "0",
          message: "OTP validated successfuly",
        });
      } else {
        res.send({
          status: "SUCCESS",
          errCode: "403",
          responseCd: "Incorrect OTP try again",
        });
      }
    } else {
      res.send({
        status: "SUCCESS",
        errCode: "402",
        responseCd: "OTP has been expired, Try sending OTP again",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: "ERROR", responseCd: "Seems to be a technical error" });
  }
};

const UpdateUserPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    await updateUser(email, "password", password);
    res.send({
      status: "SUCCESS",
      responseCd: "0",
      message: "Password updated successfuly",
    });
  } catch (error) {
    res.send({
      status: "ERROR",
      responseCd:
        "Sorry your password could not be updated, would request you to try again",
      errCode: "404",
    });
  }
};

module.exports = {
  AuthenticateUser,
  SignUpUser,
  SendVerificationCode,
  VerifyOtp,
  UpdateUserPassword,
};
