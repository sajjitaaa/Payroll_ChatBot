const {
  ComponentDialog,
  WaterfallDialog,
  TextPrompt,
  Dialog,
  ConfirmPrompt,
  ChoicePrompt,
  ChoiceFactory,
} = require("botbuilder-dialogs");
const { CardFactory } = require("botbuilder");
const { gratuityDialog, helpDialog } = require("../Constants/DialogIds");
const { monthCard, detailsCard, user1, user2 } = require("../cards/card");
const { HelpDialog } = require("./helpDialog");
const { CancelAndHelpDialog } = require("./cancelAndHelpDialog");
const gratuityDialogWF1 = "gratuityDialogWF1";
let { user } = require("../cards/card");

const TextPromptDialog = "TextPromptDialog";
const ChoicePromptDialog = "ChoicePromptDialog";
const ConfirmPromptDialog = "ConfirmPromptDialog";

class GratuityDialog extends CancelAndHelpDialog {
  constructor(conversationState) {
    super(gratuityDialog);

    if (!conversationState) throw new Error("conv. state req.");

    this.conversationState = conversationState;
    this.gratuityStateAccessor =
      this.conversationState.createProperty("gratuityState");
    this.addDialog(new HelpDialog(conversationState));

    this.addDialog(new TextPrompt(TextPromptDialog));
    this.addDialog(new ChoicePrompt(ChoicePromptDialog));
    this.addDialog(new ConfirmPrompt(ConfirmPromptDialog));

    this.addDialog(
      new WaterfallDialog(gratuityDialogWF1, [
        this.preprocessEntities.bind(this),

        this.empDetails.bind(this),
        this.checkDetails.bind(this),
        this.showMonthCard.bind(this),
        this.showGratuity.bind(this),
        this.endDialog1.bind(this),
      ])
    );

    this.initialDialogId = gratuityDialogWF1;
  }
  //  -------------------preprocessing entities----------------------------
  async preprocessEntities(stepContext) {
    try {
      if (stepContext.options && stepContext.options.luisResult) {
        console.log(stepContext.options.entities);

        let nameEntity = stepContext.options.entities.personName
          ? stepContext.options.entities.personName[0]
          : null;
        let empIdEntity = stepContext.options.entities.number
          ? stepContext.options.entities.number[0]
          : null;

        let monthEntity = stepContext.options.entities.month
          ? stepContext.options.entities.month[0]
          : null;

        stepContext.values.Entities = {
          nameEntity,
          empIdEntity,
          monthEntity,
        };
        return stepContext.next();
      }
    } catch {
      console.log(error);
    }
  }
  //  -------------------preprocessing entities-----------------------------

  // ------------------WATERFALL STEPS-------------------------------------
  async empDetails(stepContext) {
    try {
      if (
        (!stepContext.values.Entities.nameEntity &&
          stepContext.values.Entities.nameEntity == null) ||
        (!stepContext.values.Entities.empIdEntity &&
          stepContext.values.Entities.empIdEntity == null)
      ) {
        if (stepContext.options && stepContext.options.formRefill) {
          return stepContext.next();
        } else {
          await stepContext.context.sendActivity(
            "Please fill the following details to view your Gratuity :"
          );
          await stepContext.context.sendActivity({
            attachments: [CardFactory.adaptiveCard(detailsCard())],
          });
          return Dialog.EndOfTurn;
        }
      } else {
        return await stepContext.next();
      }
    } catch (error) {
      console.log(error);
    }
  }
  async checkDetails(stepContext) {
    try {
      // if (
      //   stepContext.context.activity.text &&
      //   (!stepContext.values.Entities.nameEntity ||
      //     !stepContext.values.Entities.empIdEntity)
      // ) {
      //   await stepContext.prompt(ChoicePromptDialog, {
      //     prompt: `I dont understand your text '${stepContext.context.activity.text}'! Choose 'Help' to see the other suggestions. `,
      //     choices: ChoiceFactory.toChoices(["Help"]),
      //   });
      //   return await stepContext.endDialog();
      // }
      let dialogData = await this.gratuityStateAccessor.get(
        stepContext.context,
        {}
      );
      let userDetails = stepContext.context.activity.value;
      // -------if userdetails exist or not------------------------------
      if (
        stepContext.values.Entities.nameEntity &&
        stepContext.values.Entities.nameEntity != null &&
        stepContext.values.Entities.empIdEntity &&
        stepContext.values.Entities.empIdEntity != null
      ) {
        dialogData.empID = stepContext.values.Entities.empIdEntity;
        dialogData.empName = stepContext.values.Entities.nameEntity;
      } else {
        dialogData.empID = userDetails.empID;
        dialogData.empName = userDetails.empName;
      }
      // -------if userdetails exist or not------------------------------
      if (
        (user1.empName === dialogData.empName &&
          user1.empID === parseInt(dialogData.empID)) ||
        (user2.empName === dialogData.empName &&
          user2.empID === parseInt(dialogData.empID))
      ) {
        await stepContext.context.sendActivity(
          `Found employee with ID ${dialogData.empID} `
        );
        return stepContext.next();
      } else {
        await stepContext.context.sendActivity(
          "Please enter valid employee details!"
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
  async showMonthCard(stepContext) {
    try {
      // if (stepContext.context.activity.text) {
      //   return await stepContext.endDialog();
      // }

      console.log("In month step : ", stepContext.values.Entities);
      let dialogData = await this.gratuityStateAccessor.get(
        stepContext.context,
        {}
      );
      let userDetails = stepContext.context.activity.value;
      // -------if userdetails exist or not------------------------------

      if (
        stepContext.values.Entities.nameEntity &&
        stepContext.values.Entities.nameEntity != null &&
        stepContext.values.Entities.empIdEntity &&
        stepContext.values.Entities.empIdEntity != null
      ) {
        dialogData.empID = stepContext.values.Entities.empIdEntity;
        dialogData.empName = stepContext.values.Entities.nameEntity;
      } else {
        dialogData.empID = userDetails.empID;
        dialogData.empName = userDetails.empName;
      }
      // -------if userdetails exist or not------------------------------

      if (user1.empID === parseInt(dialogData.empID)) {
        user = user1;
      } else {
        user = user2;
      }

      //--------- if month exists or not-------------------------------
      if (
        !stepContext.values.Entities.monthEntity &&
        stepContext.values.Entities.monthEntity == null
      ) {
        if (stepContext.options && stepContext.options.formRefill) {
          return stepContext.next();
        } else {
          await stepContext.context.sendActivity(
            "Please choose month for which you want to view Gratuity"
          );
          await stepContext.context.sendActivity({
            attachments: [CardFactory.adaptiveCard(monthCard())],
          });
          return Dialog.EndOfTurn;
        }
      } else {
        return await stepContext.next();
      }
      //--------- if month exists or not-------------------------------
    } catch (error) {
      console.log(error);
    }
  }
  async showGratuity(stepContext) {
    try {
      let dialogData = await this.gratuityStateAccessor.get(
        stepContext.context
      );
      let userDetails = stepContext.context.activity.value;

      //-----------if month exists or not----------------------------------
      if (
        stepContext.values.Entities.monthEntity &&
        stepContext.values.Entities.monthEntity != null
      ) {
        dialogData.month = stepContext.values.Entities.monthEntity;
      } else {
        dialogData.month = userDetails.month;
      }
      //-----------if month exists or not----------------------------------

      await stepContext.context.sendActivity(
        `Your gratuity for the month of ${dialogData.month} is ${user.GratuityCount}`
      );
      if (stepContext.options.interrupt === true) {
        await stepContext.prompt(ConfirmPromptDialog, {
          prompt: "Do you want to continue where you left? ",
        });
      } else {
        await stepContext.prompt(ChoicePromptDialog, {
          prompt:
            "Do you need help with anything else? Choose 'Yes' to see the suggestions : ",
          choices: ChoiceFactory.toChoices(["Yes", "No"]),
        });
        return await stepContext.endDialog();
      }
    } catch {
      console.log(error);
    }
  }
  async endDialog1(stepContext) {
    return await stepContext.endDialog();
  }
  // -----------------WATERFALL STEPS---------------------------------------
}

module.exports.GratuityDialog = GratuityDialog;
