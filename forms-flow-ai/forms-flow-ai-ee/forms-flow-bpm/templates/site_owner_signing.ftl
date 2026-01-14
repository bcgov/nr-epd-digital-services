<!DOCTYPE html>
<html style="margin: 0;padding: 0;box-sizing: border-box;border: none;">

<head style="margin: 0;padding: 0;box-sizing: border-box;border: none;">
    <meta charset="utf-8" style="margin: 0;padding: 0;box-sizing: border-box;border: none;">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" style="margin: 0;padding: 0;box-sizing: border-box;border: none;">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" style="margin: 0;padding: 0;box-sizing: border-box;border: none;">
</head>

<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;color: #313132;">
    <table style="width: 580px;">
        <tr>
            <td style="width: 151px;">
                <img style="width: 151px;" src="https://${host}/static/media/logo-banner.e5eec500e32dc7377862.png">
            </td>
            <td>
                <span id="sds_muncipality_notification" style="overflow: visible;line-height: 30px;text-align: left;font-style: normal;font-weight: bold;font-size: 20px;color: rgba(0, 51, 102, 1);letter-spacing: -0.2px;vertical-align: middle;">Site Remediation Services</span>
            </td>
        </tr>
    </table>
    <table style="width: 580px;">
        <tr>
            <td>
                <hr color="#DBDCDC" size="1px">
            </td>
        </tr>
        <tr>
            <td>
                <p class="info" style="margin-top: 24px;margin-bottom: 0;overflow: visible;line-height: 24px;text-align: left;font-style: normal;font-weight: bold;font-size: 16px;color: #313132;letter-spacing: 0px;text-decoration: underline;">
                    This message contains important information
                </p>
            </td>
        </tr>
        <tr>
            <td>
                <p>Hello,</p>
                <p>This message is to notify you that a Site Disclosure Statement (Application ID: ${applicationId?c}) is available for your signature in the SRS Web Application. 
                Please ensure you sign the statement before submitting it.  
                Unsigned Site Disclosure Statements cannot be processed.</p>
            </td>
        </tr>
        <tr>
            <td>
                <p>Instructions for signing the statement:</p>
                <p>1. Log in to the SRS Web App using the following link: ${appURL}/${taskId}.</p>
                <p>2. Navigate to the Application Package Dashboard.</p>
                <p>3. Locate the Application ID (listed above) associated with the statement.</p>
                <p>4. Open the statement and sign it</p>
                <p>5.Select <b> Send to Ministry </b> to forward the statement to the appropriate local government or ministry.</p>
            </td>
        </tr>
        <tr>
            <td style="padding-top: 24px;">
                <hr color="#DBDCDC" size="1px">
            </td>
        </tr>
        <tr>
            <td>
                <p>Have questions or nFor questions about using the SRS Web Application, please contact 
                    <a class="footer_link" href="mailto:${support}">${support}</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
