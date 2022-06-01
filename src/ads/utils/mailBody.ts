const getRows = (items) => {
  let str = "";
  items && items.length && items.forEach((campaign) => {
    str += `<tr>
     <td>
         ${campaign.name}
     </td>
     <td>
         ${campaign.dateScheduled}
     </td>
     <td>${campaign.budgetAmount}</td>
     <td>${campaign.runDate}</td>
     <td>${campaign.scheduledBy}</td>
 </tr>`;
  });
  return str;
};
const SET_EMAIL_MESSAGE = (campaigns, toEmail) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

        body {
            background: #E5E5E5;
            font-family: 'Roboto', sans-serif;
        }

        #table-block {
            width: 1512px;
            margin: auto;
            background: #fff;
            padding-bottom: 58px;
        }

        #table-block h2 {
            display: inline-block;
            padding-left: 3.5%;
            font-weight: 400;
            font-size: 36px;
            line-height: 42.19px;
            margin-top: 58px;
        }

        .logo {
            padding-bottom: 80px;
        }

        .logo img {
            width: 55px;
            vertical-align: middle;
            margin-left: 55px;
            margin-right: 15px;
        }

        .logo span {
            font-weight: 700;
            font-size: 18px;
        }

        table {
            border-collapse: collapse;
            margin: 0 auto;
            padding: 0;
            width: 93%;
            table-layout: fixed;
        }

        table thead {
            background: #F7F7F7;
            height: 90px;
        }

        table th {
            font-weight: 700;
            text-align: left;
            padding: 24px 58px;
            font-size: 18px;
        }

        table td {
            padding: 24px 58px;
            font-size: 18px;
            line-height: 21.09px;
            font-weight: 400;
            text-align: left;
        }
    </style>
</head>

<body>

    <div id="table-block">
        <h2>Daily Alert: Google Adwords Budget Pacer</h2>
        <div class="logo">
<!--        //Todo: will have to change the image link. Current Ref: https://postimages.org/-->
            <img src="https://i.postimg.cc/jSM3VgjJ/email-logo.jpg" alt="Logo">
            <span class="h3">${toEmail}</span>
        </div>
        <table>
            <thead>
                <tr>
                    <th scope="col">Campaign Name</th>
                    <th scope="col">Date Scheduled</th>
                    <th scope="col">Budget Amount</th>
                    <th scope="col">Run Date</th>
                    <th scope="col">Scheduled By</th>
                </tr>
            </thead>
            <tbody>
                ${getRows(campaigns)}                
            </tbody>
        </table>
    </div>

</body>

</html>
`;

module.exports = SET_EMAIL_MESSAGE;
