const emailVerificationTemplate = (username, otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Email Verification</title>
<style>
    body{
        margin:0;
        padding:0;
        background:#f4f4f4;
        font-family:Arial, Helvetica, sans-serif;
    }

    .container{
        max-width:600px;
        margin:40px auto;
        background:#ffffff;
        border-radius:10px;
        overflow:hidden;
        box-shadow:0 4px 12px rgba(0,0,0,0.1);
    }

    .header{
        background:#2563eb;
        color:#fff;
        text-align:center;
        padding:25px;
    }

    .header h1{
        margin:0;
        font-size:28px;
    }

    .content{
        padding:35px;
        color:#333;
        line-height:1.7;
    }

    .content h2{
        margin-top:0;
        color:#2563eb;
    }

    .otp-box{
        width:220px;
        margin:30px auto;
        padding:18px;
        text-align:center;
        background:#f8f9ff;
        border:2px dashed #2563eb;
        border-radius:8px;
        font-size:34px;
        font-weight:bold;
        letter-spacing:8px;
        color:#2563eb;
    }

    .note{
        background:#fff8e6;
        border-left:5px solid #ffb300;
        padding:12px;
        margin-top:25px;
        border-radius:5px;
    }

    .footer{
        background:#f1f5f9;
        text-align:center;
        padding:20px;
        font-size:13px;
        color:#666;
    }
</style>
</head>

<body>

<div class="container">

    <div class="header">
        <h1>Email Verification</h1>
    </div>

    <div class="content">

        <h2>Hello ${username},</h2>

        <p>
            Thank you for registering with us.
            Please use the following One-Time Password (OTP)
            to verify your email address.
        </p>

        <div class="otp-box">
            ${otp}
        </div>

        <p>
            This OTP is valid for <strong>10 minutes</strong>.
            Please do not share this code with anyone.
        </p>

        <div class="note">
            If you did not request this verification,
            you can safely ignore this email.
        </div>

    </div>

    <div class="footer">
        © ${new Date().getFullYear()} Your Company. All Rights Reserved.
    </div>

</div>

</body>
</html>
`;
};

export default emailVerificationTemplate;