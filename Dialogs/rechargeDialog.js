// const { MessageFactory, CardFactory } = require("botbuilder");
const {
  ComponentDialog,
  ChoicePrompt,
  ChoiceFactory,
  WaterfallDialog,
  NumberPrompt,
  TextPrompt,
  ConfirmPrompt,
} = require("botbuilder-dialogs");
const { rechargeDialog } = require("../Constants/DialogIds");
const { CancelAndHelpDialog } = require("./cancelAndHelpDialog");

// const { Channels } = require("botbuilder-core");
const rechargeDialogWF1 = "rechargeDialogWF1";

const NAME_PROMPT = "NAME_PROMPT";
const NUMBER_PROMPT = "NUMBER_PROMPT";
const ConfirmPromptDialog = "ConfirmPromptDialog";
const ChoicePromptDialog = "ChoicePromptDialog";

class RechargeDialog extends CancelAndHelpDialog {
  constructor(conversationState) {
    super(rechargeDialog);

    this.conversationState = conversationState;
    this.rechargeStateAccessor =
      this.conversationState.createProperty("rechargeState");

    this.addDialog(new TextPrompt(NAME_PROMPT));
    this.addDialog(new NumberPrompt(NUMBER_PROMPT));
    this.addDialog(new ConfirmPrompt(ConfirmPromptDialog));
    this.addDialog(new ChoicePrompt(ChoicePromptDialog));

    this.addDialog(
      new WaterfallDialog(rechargeDialogWF1, [
        this.addRechargeProvider.bind(this),
        this.amountOfRecharge.bind(this),
        this.getPhoneNumber.bind(this),
        this.rechargeProvider.bind(this),
        this.sendConfirmation.bind(this),
        this.endDialog1.bind(this),
      ])
    );

    this.initialDialogId = rechargeDialogWF1;
  }

  async addRechargeProvider(stepContext) {
    try {
      return await stepContext.prompt(ChoicePromptDialog, {
        prompt: "To recharge please choose your service provider?",
        choices: ChoiceFactory.toChoices(["Airtel", "Jio", "Vodafone"]),
      });
    } catch (error) {
      console.log(error);
    }
  }
  async amountOfRecharge(stepContext) {
    try {
      let dialogData = await this.rechargeStateAccessor.get(
        stepContext.context,
        {}
      );
      stepContext.values.provider = stepContext.result.value;
      dialogData.provider = stepContext.values.provider;

      return await stepContext.prompt(
        NUMBER_PROMPT,
        "Enter the recharge amount :"
      );
    } catch {
      console.log(error);
    }
  }
  async getPhoneNumber(stepContext) {
    try {
      let dialogData = await this.rechargeStateAccessor.get(
        stepContext.context
      );
      dialogData.amountVal = stepContext.result;
      return await stepContext.prompt(
        NUMBER_PROMPT,
        "Enter your Phone Number!"
      );
    } catch (error) {
      console.log(error);
    }
  }
  async rechargeProvider(stepContext) {
    try {
      let dialogData = await this.rechargeStateAccessor.get(
        stepContext.context
      );
      dialogData.Phno = stepContext.result;
      return await stepContext.prompt(ChoicePromptDialog, {
        prompt: "Choose a Payment method: ",
        choices: ChoiceFactory.toChoices([
          "Paytm",
          "NetBanking",
          "Credit Card",
          "Debit Card",
        ]),
      });
    } catch {
      console.log(error);
    }
  }
  async sendConfirmation(stepContext) {
    try {
      let dialogData = await this.rechargeStateAccessor.get(
        stepContext.context
      );
      dialogData.paymentProvider = stepContext.result.value;
      await stepContext.context.sendActivity(
        `Your Request of Recharge amount Rs. ${dialogData.amountVal} for 
                ${dialogData.Phno} by ${dialogData.provider} is successful!`
      );
      // console.log(
      //   "stepContext.parent.stack recharge -> ",
      //   stepContext.parent.stack.length
      // );

      if (stepContext.options.interrupt === true) {
        let text = stepContext.options.prevDialog;
        await stepContext.prompt(ConfirmPromptDialog, {
          prompt: `Do you want to continue where you left? `,
        });
      } else {
        await stepContext.prompt(ChoicePromptDialog, {
          prompt:
            "Do you need my help with anything else? Choose 'Yes' to see the suggestions : ",
          choices: ChoiceFactory.toChoices(["Yes", "No"]),
        });
        return await stepContext.endDialog();
      }
    } catch (error) {
      console.log(error);
    }
  }
  async endDialog1(stepContext) {
    return await stepContext.endDialog();
  }
}

module.exports.RechargeDialog = RechargeDialog;
