<!DOCTYPE html>
<html style="margin: 0;padding: 0;box-sizing: border-box;border: none;">

<head style="margin: 0;padding: 0;box-sizing: border-box;border: none;">
    <meta charset="utf-8" style="margin: 0;padding: 0;box-sizing: border-box;border: none;">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" style="margin: 0;padding: 0;box-sizing: border-box;border: none;">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" style="margin: 0;padding: 0;box-sizing: border-box;border: none;">
    
</head>

<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;color: #313132;">
    <table>
        <tr>
            <td style="width: 151px;">
                <img style="width: 151px;" src="https://taft.fin.gov.bc.ca/img/BCID_H_rgb_pos_150.png">
            </td>
            <td>
                <span id="upload_doc" style="overflow: visible;line-height: 30px;text-align: left;font-style: normal;font-weight: bold;font-size: 20px;color: rgba(0, 51, 102, 1);letter-spacing: -0.2px;vertical-align: middle;">Site Remediation Services</span>
            </td>
        </tr>
    </table>
    <table>
        <tr>
            <td>
                <hr color="#DBDCDC" size="1px">
            </td>
        </tr>       
        <tr>
            <td>
                <p class="info" style="margin-top: 24px;margin-bottom: 0;overflow: visible;line-height: 24px;text-align: left;font-style: normal;font-weight: normal;font-size: 16px;color: #313132;letter-spacing: 0px;">
                  Thank you for your submission to the Site Remediation Services Web Application. Your application (ID: ${applicationId}) has been received and is currently under review by the Ministry.
                
                </p>
                <p class="info" style="margin-top: 24px;margin-bottom: 0;overflow: visible;line-height: 24px;text-align: left;font-style: normal;font-weight: normal;font-size: 16px;color: #313132;letter-spacing: 0px;">
                  To proceed with processing, we require all relevant supporting documents to complete your application. Please upload the necessary documents using the link below:
                </p>
                <p>
                     <b><a href=${uploadLink}>[Upload Documents]</a></b>
                </p>
            </td>
        </tr>
        <tr>
            <td>
             <p class="info" style="margin-top: 24px;margin-bottom: 0;overflow: visible;line-height: 24px;text-align: left;font-style: normal;font-weight: normal;font-size: 16px;color: #313132;letter-spacing: 0px;">
                  To ensure proper processing, please use the following naming convention for all documents submitted: 
                </p>
                <p>
                  <b> Date (YYYY-MM-DD), Site ID (if known), Title </b>
                </p>
            </td>
        </tr>
        <tr>
            <td>
                <p class="info" style="margin-top: 24px;margin-bottom: 0;overflow: visible;line-height: 24px;text-align: left;font-style: normal;font-weight: normal;font-size: 16px;color: #313132;letter-spacing: 0px;">
                    <span>If you have any questions, feel free to contact us at <a class="link" href="mailto:${support}" style="overflow: visible;line-height: 24px;text-align: left;overflow-wrap: break-word;word-wrap: break-word;font-style: normal;font-weight: normal;font-size: 16px;color: #1A5A96;text-decoration: underline;">${support}</a></span>
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding-top: 24px;">
                <hr color="#DBDCDC" size="1px">
            </td>
        </tr>
        <tr>
            <td>               
                <p> Thank you,
                    Site Remediation Services Team
                </p>
            </td>
        </tr>
    </table>
</body>
</html>