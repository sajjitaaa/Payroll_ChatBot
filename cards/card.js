// let userDetails = {
//   empName: "",
//   empID: "",
// };
const user1 = {
  empName: "Sajjita",
  empID: 202086,
  BasicSalary: "$11200",
  PFCount: "$1280",
  BonusCount: "$20",
  GratuityCount: "$30",
  ESICont: "$347",
  LWFCont: "$0",
  EPFContribution: "$1380",
  ESIContribution: "$102",
  LWFContribution: "$0",
  TotalDeduction: "$3109",
  CTC: "$13127",
  NetSalary: "$9968",
};
const user2 = {
  empName: "Nancy",
  empID: 303011,
  BasicSalary: "$11500",
  PFCount: "$1380",
  BonusCount: "$10",
  GratuityCount: "$20",
  ESICont: "$547",
  LWFCont: "$0",
  EPFContribution: "$1380",
  ESIContribution: "$202",
  LWFContribution: "$0",
  TotalDeduction: "$3509",
  CTC: "$13427",
  NetSalary: "$9888",
};
let user;
module.exports = {
  monthCard: () => {
    return {
      type: "AdaptiveCard",
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      version: "1.0",
      body: [
        {
          type: "TextBlock",
          text: "Month",
          wrap: true,
          horizontalAlignment: "Center",
          fontType: "Default",
          size: "Medium",
          weight: "Bolder",
          color: "Accent",
          isSubtle: true,
          separator: true,
        },
        {
          type: "Input.ChoiceSet",

          style: "compact",
          errorMessage: "This is a required input",
          choices: [
            {
              title: "January",
              value: "January",
            },
            {
              title: "February",
              value: "February",
            },
            {
              title: "March",
              value: "February",
            },
            {
              title: "April",
              value: "April",
            },
            {
              title: "May",
              value: "May",
            },
            {
              title: "June",
              value: "June",
            },
            {
              title: "July ",
              value: "July ",
            },
            {
              title: "August",
              value: "August",
            },
            {
              title: "September",
              value: "September",
            },
            {
              title: "October",
              value: "October",
            },
            {
              title: "November",
              value: "November",
            },
            {
              title: "December",
              value: "December",
            },
          ],
          label: "Choose month below:",
          placeholder: "--- Select month ---",
          id: "month",
          separator: true,
        },
      ],
      actions: [
        {
          type: "Action.Submit",
          title: "Submit",
          style: "positive",
          id: "monthSubmitBtn",
          data: {
            actiontype: "monthSubmit",
          },
        },
      ],
    };
  },
  detailsCard: () => {
    return {
      type: "AdaptiveCard",
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      version: "1.2",
      body: [
        {
          type: "TextBlock",
          text: "Please enter employee details:",
          wrap: true,
          horizontalAlignment: "Left",
          separator: true,
          size: "Medium",
          weight: "Bolder",
          color: "Accent",
          isSubtle: true,
        },
        {
          type: "Container",
          items: [
            {
              type: "TextBlock",
              wrap: true,
              text: "Employee Name :",
              weight: "Bolder",
            },
            {
              type: "Input.Text",
              placeholder: "Enter your name as registered ",
              id: "empName",
              isRequired: true,
              errorMessage: "please enter your name to continue",
              label: "required",
            },
          ],
          backgroundImage: {
            verticalAlignment: "Bottom",
          },
          separator: true,
        },
        {
          type: "Container",
          items: [
            {
              type: "TextBlock",
              text: `Employee ID `,
              wrap: true,
              weight: "Bolder",
            },
            {
              type: "Input.Text",
              placeholder: "Enter your unique employee ID",
              id: "empID",
              isRequired: true,
              errorMessage: "employee ID required",
              label: "required",
            },
          ],
          separator: true,
        },
        {
          type: "ActionSet",
          separator: true,
          actions: [
            {
              type: "Action.Submit",
              title: "Submit",
              id: "detailsSubmitBtn",
              data: {
                actiontype: "detailsSubmit",
              },
            },
          ],
        },
      ],
    };
  },
  user1,
  user2,
  user,
  salarySlipCard: (user) => {
    return {
      type: "AdaptiveCard",
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      version: "1.2",
      body: [
        {
          type: "Container",
          items: [
            {
              type: "TextBlock",
              text: "Salary Slip",
              wrap: true,
              separator: true,
              horizontalAlignment: "Center",
              size: "Medium",
              color: "Accent",
              weight: "Bolder",
            },
          ],
        },
        {
          type: "ColumnSet",
          columns: [
            {
              type: "Column",
              width: "stretch",
              separator: true,
              items: [
                {
                  type: "TextBlock",
                  text: "Employee Name",
                  wrap: true,
                  weight: "Bolder",
                },
              ],
            },
            {
              type: "Column",
              width: "stretch",
              separator: true,
              items: [
                {
                  type: "TextBlock",
                  text: `${user.empName}`,
                  wrap: true,
                },
              ],
            },
          ],
          separator: true,
        },
        {
          type: "ColumnSet",
          columns: [
            {
              type: "Column",
              width: "stretch",
              items: [
                {
                  type: "TextBlock",
                  text: "Empoyee ID",
                  wrap: true,
                  weight: "Bolder",
                },
              ],
            },
            {
              type: "Column",
              width: "stretch",
              separator: true,
              items: [
                {
                  type: "TextBlock",
                  text: `${user.empID}`,
                  wrap: true,
                },
              ],
            },
          ],
          separator: true,
        },
        {
          type: "ColumnSet",
          columns: [
            {
              type: "Column",
              width: "stretch",
              items: [
                {
                  type: "TextBlock",
                  text: "Basic Salary",
                  wrap: true,
                  weight: "Bolder",
                },
              ],
            },
            {
              type: "Column",
              width: "stretch",
              separator: true,
              items: [
                {
                  type: "TextBlock",
                  text: `${user.BasicSalary}`,
                  wrap: true,
                },
              ],
            },
          ],
          separator: true,
        },
        {
          type: "ColumnSet",
          columns: [
            {
              type: "Column",
              width: "stretch",
              items: [
                {
                  type: "TextBlock",
                  wrap: true,
                  text: "Employer's PF Cont.",
                  weight: "Bolder",
                },
              ],
            },
            {
              type: "Column",
              width: "stretch",
              separator: true,
              items: [
                {
                  type: "TextBlock",
                  text: `${user.PFCount}`,
                  wrap: true,
                },
              ],
            },
          ],
          separator: true,
        },
        {
          type: "ColumnSet",
          columns: [
            {
              type: "Column",
              width: "stretch",
              items: [
                {
                  type: "TextBlock",
                  text: "Employer's Bonus",
                  wrap: true,
                  weight: "Bolder",
                },
              ],
            },
            {
              type: "Column",
              width: "stretch",
              separator: true,
              items: [
                {
                  type: "TextBlock",
                  text: `${user.BonusCount}`,
                  wrap: true,
                },
              ],
            },
          ],
        },
        {
          type: "ColumnSet",
          columns: [
            {
              type: "Column",
              width: "stretch",
              items: [
                {
                  type: "TextBlock",
                  text: "Employer's Gratuity",
                  wrap: true,
                  weight: "Bolder",
                },
              ],
            },
            {
              type: "Column",
              width: "stretch",
              separator: true,
              items: [
                {
                  type: "TextBlock",
                  text: `${user.GratuityCount}`,
                  wrap: true,
                },
              ],
            },
          ],
          separator: true,
        },
        {
          type: "ColumnSet",
          columns: [
            {
              type: "Column",
              width: "stretch",
              items: [
                {
                  type: "TextBlock",
                  text: "Employer's ESI Cont.",
                  wrap: true,
                  weight: "Bolder",
                },
              ],
            },
            {
              type: "Column",
              width: "stretch",
              separator: true,
              items: [
                {
                  type: "TextBlock",
                  text: `${user.ESICont}`,
                  wrap: true,
                },
              ],
            },
          ],
          separator: true,
        },
        {
          type: "ColumnSet",
          columns: [
            {
              type: "Column",
              width: "stretch",
              items: [
                {
                  type: "TextBlock",
                  text: "Employer's LWF Cont.",
                  wrap: true,
                  weight: "Bolder",
                },
              ],
            },
            {
              type: "Column",
              width: "stretch",
              separator: true,
              items: [
                {
                  type: "TextBlock",
                  text: `${user.LWFCont}`,
                  wrap: true,
                },
              ],
            },
          ],
          separator: true,
        },
        {
          type: "ColumnSet",
          columns: [
            {
              type: "Column",
              width: "stretch",
              items: [
                {
                  type: "TextBlock",
                  text: "Employee EPF Contribution",
                  wrap: true,
                  weight: "Bolder",
                },
              ],
            },
            {
              type: "Column",
              width: "stretch",
              separator: true,
              items: [
                {
                  type: "TextBlock",
                  text: `${user.EPFContribution}`,
                  wrap: true,
                },
              ],
            },
          ],
          separator: true,
        },
        {
          type: "ColumnSet",
          columns: [
            {
              type: "Column",
              width: "stretch",
              items: [
                {
                  type: "TextBlock",
                  text: "Employee ESI Contribution",
                  wrap: true,
                  weight: "Bolder",
                },
              ],
            },
            {
              type: "Column",
              width: "stretch",
              separator: true,
              items: [
                {
                  type: "TextBlock",
                  text: `${user.ESIContribution}`,
                  wrap: true,
                },
              ],
            },
          ],
          separator: true,
        },
        {
          type: "ColumnSet",
          columns: [
            {
              type: "Column",
              width: "stretch",
              items: [
                {
                  type: "TextBlock",
                  wrap: true,
                  weight: "Bolder",
                  text: "Total LWF Contribution",
                },
              ],
            },
            {
              type: "Column",
              width: "stretch",
              separator: true,
              items: [
                {
                  type: "TextBlock",
                  text: `${user.LWFContribution}`,
                  wrap: true,
                },
              ],
            },
          ],
          separator: true,
        },
        {
          type: "ColumnSet",
          columns: [
            {
              type: "Column",
              width: "stretch",
              items: [
                {
                  type: "TextBlock",
                  wrap: true,
                  weight: "Bolder",
                  text: "Total Deduction",
                },
              ],
            },
            {
              type: "Column",
              width: "stretch",
              separator: true,
              items: [
                {
                  type: "TextBlock",
                  text: `${user.TotalDeduction}`,
                  wrap: true,
                },
              ],
            },
          ],
          separator: true,
        },
        {
          type: "ColumnSet",
          columns: [
            {
              type: "Column",
              width: "stretch",
              items: [
                {
                  type: "TextBlock",
                  text: "Total CTC",
                  wrap: true,
                  weight: "Bolder",
                },
              ],
            },
            {
              type: "Column",
              width: "stretch",
              separator: true,
              items: [
                {
                  type: "TextBlock",
                  text: `${user.CTC}`,
                  wrap: true,
                },
              ],
            },
          ],
          separator: true,
        },
        {
          type: "ColumnSet",
          columns: [
            {
              type: "Column",
              width: "stretch",
              items: [
                {
                  type: "TextBlock",
                  text: "Net Salary",
                  wrap: true,
                  weight: "Bolder",
                  size: "Medium",
                },
              ],
            },
            {
              type: "Column",
              width: "stretch",
              separator: true,
              items: [
                {
                  type: "TextBlock",
                  text: `${user.NetSalary}`,
                  wrap: true,
                  size: "Medium",
                },
              ],
            },
          ],
          separator: true,
        },
      ],
    };
  },
};
