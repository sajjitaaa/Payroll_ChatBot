const { ComponentDialog, WaterfallDialog } = require("botbuilder-dialogs");
const { CardFactory } = require("botbuilder");
const { payrollDialog } = require("../Constants/DialogIds");

const payrollDialogWF1 = "payrollDialogWF1";

class PayrollDialog extends ComponentDialog {
  constructor(conversationState) {
    super(payrollDialog);

    if (!conversationState) throw new Error("conv. state req.");

    this.conversationState = conversationState;

    this.addDialog(
      new WaterfallDialog(payrollDialogWF1, [
        this.sendPayrollOptions.bind(this),
      ])
    );

    this.initialDialogId = payrollDialogWF1;
  }

  async sendPayrollOptions(stepContext) {
    await stepContext.context.sendActivity(
      "I can help you with the Payroll options!"
    );
    await stepContext.context.sendActivity({
      attachments: [
        CardFactory.heroCard(
          "Here are some options you can choose from :",
          null,
          CardFactory.actions([
            {
              type: "imBack",
              title: "Salary Slip",
              value: "Salary Slip",
            },
            {
              type: "imBack",
              title: "Bonus",
              value: "Bonus",
            },

            {
              type: "imBack",
              title: "Reimbursement",
              value: "Reimbursement",
            },
            {
              type: "imBack",
              title: "PF",
              value: "PF",
            },
            {
              type: "imBack",
              title: "Gratuity",
              value: "Gratuity",
            },
            {
              type: "imBack",
              title: "Recharge",
              value: "Recharge",
            },
          ])
        ),
      ],
    });

    return await stepContext.endDialog();
  }
}

module.exports.PayrollDialog = PayrollDialog;
