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
      
        <#if siteId??>
        <tr>
            <td>
                <p class="info" style="margin-top: 24px;margin-bottom: 0;overflow: visible;
                                    line-height:27px;text-align: left;font-style: normal;
                                    font-weight: bold;font-size: 20px;color: #313132;letter-spacing: 0px;">
                    <span style="font-weight: bold;">SITE ID:</span> ${siteId}, ${siteAddress!""}, ${siteCity!""}
                </p>
            </td>
        </tr>
        </#if>

        <tr>
            <td>
                <p class="info" style="margin-top: 24px;margin-bottom: 0;overflow: visible;
                                       line-height:27px;text-align: left;font-style: normal;
                                       font-weight: bold;font-size: 20px;color: #313132;letter-spacing: 0px;">
                    <span style="font-weight: bold;">Application ID:</span> ${applicationId}
                </p>
            </td>
        </tr>

        <tr>
            <td>
                <p class="info" style="margin-top: 24px;margin-bottom: 0;overflow: visible;line-height: 24px;text-align: left;font-style: normal;font-weight: normal;font-size: 16px;color: #313132;letter-spacing: 0px;">
                    This letter is to acknowledge receipt of a satisfactorily completed Site Disclosure Statement (SDS) pertaining to the above-referenced site/application ID. Based on the SDS submitted to the ministry, a <a href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/375_96_04" style="color: #1A5A96;text-decoration: underline;">Schedule 2</a> commercial or industrial use has occurred on your site and it may be contaminated.
                </p>
                <p class="info" style="margin-top: 24px;margin-bottom: 0;overflow: visible;line-height: 24px;text-align: left;font-style: normal;font-weight: normal;font-size: 16px;color: #313132;letter-spacing: 0px;">
                    In accordance with the <a href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/03053_04#part4" style="color: #1A5A96;text-decoration: underline;">Environmental Management Act</a> and <a href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/375_96_00" style="color: #1A5A96;text-decoration: underline;">Contaminated Sites Regulation (CSR)</a>, this has triggered the <a href="https://www2.gov.bc.ca/gov/content/environment/air-land-water/site-remediation/identifying-and-disclosing-sites-that-may-be-contaminated" style="color: #1A5A96;text-decoration: underline;">Site Identification process</a>, and site investigation is required. For more information about site investigation and reporting requirements, please review <a href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/375_96_01#division_d1e1030" style="color: #1A5A96;text-decoration: underline;">CSR: Division 6 - Investigations</a>.
                </p>
                <p class="info" style="margin-top: 24px;margin-bottom: 0;overflow: visible;line-height: 24px;text-align: left;font-style: normal;font-weight: normal;font-size: 16px;color: #313132;letter-spacing: 0px;">
                    The municipality or approving officer cannot approve your permit application until you obtain a <a href="https://www2.gov.bc.ca/gov/content/environment/air-land-water/site-remediation/identifying-and-disclosing-sites-that-may-be-contaminated/release-notices" style="color: #1A5A96;text-decoration: underline;">Release Notice</a> or <a href="https://www2.gov.bc.ca/gov/content/environment/air-land-water/site-remediation/apply-for-certification" style="color: #1A5A96;text-decoration: underline;">Certification Document</a> from the ministry. This restriction is outlined in the following local government statutes: <a href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96239_01" style="color: #1A5A96;text-decoration: underline;">Islands Trust Act (section 34.1)</a>, <a href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96250_00" style="color: #1A5A96;text-decoration: underline;">Land Title Act (section 85.1)</a>, <a href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/r15001_00" style="color: #1A5A96;text-decoration: underline;">Local Government Act (section 557)</a>, and the <a href="mailto:VancouverCharter@gov.bc.ca" style="color: #1A5A96;text-decoration: underline;">Vancouver Charter (section 571B)</a>. Please note that submission of site investigation reports alone will not remove this restriction.
                </p>
                <p class="info" style="margin-top: 24px;margin-bottom: 0;overflow: visible;line-height: 24px;text-align: left;font-style: normal;font-weight: normal;font-size: 16px;color: #313132;letter-spacing: 0px;">
                    If you have any questions about this letter, please send your enquiry to <a href="mailto:SiteID@gov.bc.ca" style="color: #1A5A96;text-decoration: underline;">SiteID@gov.bc.ca</a>.
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
                <p class="footer">Have questions or need help? Please email us at:
                    <a class="footer_link" href="mailto:${support}">${support}</a>
                </p>
                <p> BC Public Services will never send an email that asks you to provide, confirm or verify personal, log on or account information.
                    DO NOT reply to this email as it was sent from an unmonitored account.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
